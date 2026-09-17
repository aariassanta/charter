import { NextRequest } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_INTERVAL_MS = 1000;
const MAX_STREAM_LIFE_MS = 10 * 60 * 1000; // 10 min — el pipeline termina antes

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const extractionId = parseInt(id, 10);
  if (isNaN(extractionId)) return new Response("Bad id", { status: 400 });

  // Verificar propiedad
  const db = getDb();
  const row = db
    .prepare("SELECT id FROM extractions WHERE id = ? AND user_id = ?")
    .get(extractionId, user.id);
  if (!row) {
    db.close();
    return new Response("Not found", { status: 404 });
  }
  db.close();

  const sinceParam = req.nextUrl.searchParams.get("since");
  let lastEventId = sinceParam ? parseInt(sinceParam, 10) || 0 : 0;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const startedAt = Date.now();
      const writeEvent = (id: number, ts: string, label: string) => {
        const lines = [
          `id: ${id}`,
          `data: ${JSON.stringify({ ts, label })}`,
          "",
          "",
        ];
        controller.enqueue(encoder.encode(lines.join("\n")));
      };

      // Comentario inicial para "abrir" el stream en proxies / browsers
      controller.enqueue(
        encoder.encode(`: SSE stream started for extraction ${extractionId}\n\n`)
      );

      // Enviar eventos ya conocidos al conectar (replay desde `since`)
      const replay = eventsSince(extractionId, lastEventId);
      for (const [id, ts, label] of replay) {
        writeEvent(id, ts, label);
        lastEventId = id;
      }

      // Bucle: poll cada POLL_INTERVAL_MS hasta cerrar
      while (Date.now() - startedAt < MAX_STREAM_LIFE_MS) {
        const stopRequested =
          req.signal.aborted ||
          (await is_terminal(extractionId));

        // Cierre temprano si la extracción ya está terminada y no quedan eventos nuevos
        if (stopRequested) {
          const tail = eventsSince(extractionId, lastEventId);
          for (const [id, ts, label] of tail) {
            writeEvent(id, ts, label);
          }
          controller.enqueue(encoder.encode("event: done\ndata: end\n\n"));
          controller.close();
          return;
        }

        // Poll eventos nuevos
        const fresh = eventsSince(extractionId, lastEventId);
        for (const [id, ts, label] of fresh) {
          writeEvent(id, ts, label);
          lastEventId = id;
        }

        // Heartbeat (mantiene conexión viva en proxies)
        controller.enqueue(encoder.encode(": ping\n\n"));

        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }

      try {
        controller.close();
      } catch {
        /* ya cerrado */
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // nginx hint para no hacer buffering
    },
  });
}

function eventsSince(extractionId: number, lastEventId: number): [number, string, string][] {
  const db = getDb();
  try {
    const rows = db
      .prepare(
        "SELECT id, ts, label FROM extraction_events " +
          "WHERE extraction_id = ? AND id > ? ORDER BY id ASC LIMIT 200"
      )
      .all(extractionId, lastEventId);
    return rows.map((r: any) => [r.id, r.ts, r.label]);
  } finally {
    db.close();
  }
}

async function is_terminal(extractionId: number): Promise<boolean> {
  const db = getDb();
  try {
    const row = db
      .prepare("SELECT status FROM extractions WHERE id = ?")
      .get(extractionId) as { status?: string } | undefined;
    return row?.status === "completed" || row?.status === "failed";
  } finally {
    db.close();
  }
}

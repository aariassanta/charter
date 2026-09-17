import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM extractions WHERE id = ? AND user_id = ?").get(parseInt(id), user.id) as Record<string, unknown> | undefined;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const pdfMod = await import("@react-pdf/renderer");
    const charterPdfMod = await import("@/components/CharterPDF");
    const { renderToBuffer } = pdfMod;
    const CharterPDF = charterPdfMod.CharterPDF;
    // @ts-ignore
    const el = /* @ts-ignore */ CharterPDF({ row });
    const pdfBuffer = await renderToBuffer(el);
    const pdfArray = new Uint8Array(pdfBuffer);
    return new NextResponse(pdfArray, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${String(row.project_name ?? "charter")}.pdf"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: `PDF generation failed: ${err}` }, { status: 500 });
  }
}

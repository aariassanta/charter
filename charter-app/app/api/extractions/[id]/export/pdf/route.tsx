import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { CharterPDF } from "@/components/CharterPDF";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM extractions WHERE id = ? AND user_id = ?").get(parseInt(id), user.id) as Record<string, unknown> | undefined;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    // @ts-ignore
    const pdfBuffer = await renderToBuffer(<CharterPDF row={row} />);
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

import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { CharterPDF } from "./CharterPDF";

export async function generatePdfResponse(row: Record<string, unknown>): Promise<NextResponse> {
  try {
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

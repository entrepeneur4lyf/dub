import { generatePDF } from "@dub/pdf";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const stream = await generatePDF();
  const blob = await new Response(stream).blob();

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
    "Content-Disposition": `attachment; filename="payout-invoice.pdf"`,
  };

  return new Response(blob, { headers });
}

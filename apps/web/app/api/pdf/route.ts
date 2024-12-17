import { renderToStream } from "@dub/pdf";

import type { NextRequest } from "next/server";

// export const dynamic = "force-dynamic";

import dynamic from 'next/dynamic'

const PayoutInvoice = dynamic(
  () => import('@dub/pdf/templates').then((mod) => mod.PayoutInvoice),
  { ssr: false }
)

export async function GET(req: NextRequest) {
  const stream = await renderToStream(PayoutInvoice());

  const blob = await new Response(stream).blob();

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
    "Content-Disposition": `attachment; filename="payout-invoice.pdf"`,
  };

  return new Response(blob, { headers });
}

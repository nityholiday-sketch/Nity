import { NextResponse } from 'next/server';

// Shaymavenue Webhook — Payin & Payout
// Docs: payload is an array of transaction objects:
// [{ Txn_ID, TXN_date, TXN_amount, UTR, TXN_Status }]
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let payload: any;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      // Fallback: URL-encoded form body
      const params = new URLSearchParams(rawBody);
      payload = Object.fromEntries(params.entries());
    }

    // Normalise: docs send an array, but defensively handle a single object too
    const transactions: any[] = Array.isArray(payload) ? payload : [payload];

    for (const txn of transactions) {
      const {
        Txn_ID,
        TXN_date,
        TXN_amount,
        UTR,
        TXN_Status,
      } = txn;

      console.log('Shaymavenue Webhook:', JSON.stringify({ Txn_ID, TXN_date, TXN_amount, UTR, TXN_Status }, null, 2));

      if (!Txn_ID) {
        console.warn('Shaymavenue Webhook: missing Txn_ID, skipping entry');
        continue;
      }

      const status = (TXN_Status || '').toLowerCase();

      if (status === 'success') {
        // TODO: Mark order as PAID in your database using Txn_ID & UTR
        console.log(`✅ Payment SUCCESS — Txn_ID: ${Txn_ID}, UTR: ${UTR}, Amount: ₹${TXN_amount}`);
      } else if (status === 'failed') {
        // TODO: Mark order as FAILED in your database
        console.log(`❌ Payment FAILED — Txn_ID: ${Txn_ID}, Amount: ₹${TXN_amount}`);
      } else {
        console.log(`⏳ Payment ${TXN_Status} — Txn_ID: ${Txn_ID}`);
      }
    }

    // Shaymavenue requires HTTP 200 OK to acknowledge receipt
    return new NextResponse('OK', { status: 200 });
  } catch (error: any) {
    console.error('Shaymavenue Callback Error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

import { NextResponse } from 'next/server';

// Bharat4U webhook callback handler
// Expected payload: { order_id, amount, status, utr }
export async function POST(request: Request) {
  try {
    let data: Record<string, any> = {};

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      // Handle form-encoded callbacks (application/x-www-form-urlencoded)
      const text = await request.text();
      text.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key) data[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }

    console.log('Bharat4U Webhook Received:', JSON.stringify(data, null, 2));

    const { order_id, status, utr, amount } = data;

    if (status === 'SUCCESS') {
      // TODO: Update your database order status using order_id & utr
      console.log(`✅ Payment SUCCESS — OrderID: ${order_id}, UTR: ${utr}, Amount: ${amount}`);
      return NextResponse.json({ status: true, msg: 'Callback processed successfully' });
    }

    console.log(`❌ Payment ${status} — OrderID: ${order_id}`);
    return NextResponse.json({ status: false, msg: `Transaction ${status || 'not successful'}` });
  } catch (error: any) {
    console.error('Bharat4U callback error:', error);
    return NextResponse.json({ status: false, msg: 'Error processing callback' }, { status: 500 });
  }
}

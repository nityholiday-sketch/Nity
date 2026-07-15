
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Bharat4U Webhook Received:', data);

    // Expected format: { order_id, amount, status, utr }
    if (data.status === 'SUCCESS') {
      // Logic to update order status in your database would go here
      return NextResponse.json({ status: true, msg: 'Callback processed' });
    }

    return NextResponse.json({ status: false, msg: 'Transaction not successful' });
  } catch (error) {
    return NextResponse.json({ status: false, msg: 'Error processing callback' }, { status: 500 });
  }
}

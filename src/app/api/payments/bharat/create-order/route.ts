
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, order_id } = body;

    // Use your Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: order_id || `ORD${Date.now()}`,
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      amount: amount.toString(),
    };

    const response = await fetch('https://api.bharat4upe.com/api/payin/v1/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: data.msg || 'Payment initiation failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Bharat4U API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, order_id } = body;

    // Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    // Generate a strictly alphanumeric unique order ID (Max 20 chars for safety)
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const finalOrderId = order_id || `ORD${timestamp}${random}`;

    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: customer_name.substring(0, 30), // Limit length
      customer_mobile: customer_mobile,
      amount: Math.floor(amount).toString(), // Must be string integer
    };

    console.log('Sending payload to Bharat4U:', { ...payload, bharat_key: '***' });

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
      // Log the exact error from Bharat4U for debugging
      console.error('Bharat4U API Error:', data);
      return NextResponse.json({ 
        error: data.msg || 'Payment initiation failed',
        details: data 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

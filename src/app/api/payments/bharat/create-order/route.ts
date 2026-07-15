
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
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const finalOrderId = order_id || `ORD${timestamp}${random}`;

    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: customer_name.substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, ''),
      customer_mobile: customer_mobile,
      amount: Math.floor(amount).toString(), // Must be string integer
    };

    console.log('Initiating Bharat4U Payment:', { ...payload, bharat_key: '***' });

    // Using the V1 endpoint as per the primary documentation
    const response = await fetch('https://api.bharat4upe.com/api/payin/v1/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bharat4U HTTP Error:', response.status, errorText);
      return NextResponse.json({ error: `Gateway Error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log('Bharat4U API Response:', data);

    if (data.status) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ 
        error: data.msg || 'Payment initiation failed',
        details: data 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Internal Server Error in Bharat Payment Route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

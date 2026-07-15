
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, order_id } = body;

    // Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    // Generate a unique order ID if not provided, ensuring it's not too long
    const finalOrderId = order_id || `ORD${Math.floor(Date.now() / 1000)}${Math.floor(Math.random() * 1000)}`;

    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      amount: Math.floor(amount).toString(), // Ensure amount is an integer string as per example
    };

    // Using the URL from the documentation's status table
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
      // Log the actual error from Bharat4U to the server console for debugging
      console.error('Bharat4U API Error Response:', data);
      return NextResponse.json({ 
        error: data.msg || 'Payment initiation failed',
        details: data
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Bharat4U Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

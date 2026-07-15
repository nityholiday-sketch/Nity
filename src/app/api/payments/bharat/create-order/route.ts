
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, order_id } = body;

    // Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    // Generate a strictly alphanumeric unique order ID (limited to 15 chars for compatibility)
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const finalOrderId = order_id || `ORD${timestamp}${random}`;

    // Bharat4U V1 Create Order Endpoint
    const API_URL = 'https://api.bharat4upe.com/api/payin/v1/create-order';

    // Strictly follow the 6-parameter payload from the documentation's cURL example
    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: (customer_name || "Customer").substring(0, 20).replace(/[^a-zA-Z0-9 ]/g, ''),
      customer_mobile: (customer_mobile || "9999999999").replace(/[^0-9]/g, '').slice(-10),
      amount: Math.floor(amount).toString(),
    };

    console.log('Initiating Bharat4U V1 Payment Request:', { ...payload, bharat_key: '***' });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Bharat4U V1 Error Response:', data);
      return NextResponse.json({ 
        error: `Gateway Error: ${response.status}`, 
        details: data 
      }, { status: response.status });
    }

    console.log('Bharat4U V1 Success Response:', data);

    if (data.status) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ 
        error: data.msg || data.message || 'Payment initiation failed',
        details: data 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Internal Server Error in Bharat Payment Route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

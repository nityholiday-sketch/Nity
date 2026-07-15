
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, order_id } = body;

    // Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    // Generate a strictly alphanumeric unique order ID (Shorter for safety)
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const finalOrderId = order_id || `B${timestamp}${random}`;

    // Based on the 404 error, the .php extension is incorrect.
    // Based on the 400 error, the gateway is likely rejecting extra parameters like email or callback_url.
    const API_URL = 'https://api.bharat4upe.com/api/payin/v1/create-order';

    // Construct the payload exactly as per the successful cURL example in documentation
    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: (customer_name || "Customer").substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, ''),
      customer_mobile: customer_mobile || "9999999999",
      amount: Math.floor(amount).toString(), // Must be string integer as per cURL
    };

    console.log('Initiating Bharat4U Payment (V1):', { ...payload, bharat_key: '***' });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bharat4U HTTP Error:', response.status, errorText);
      return NextResponse.json({ 
        error: `Gateway Error: ${response.status}`, 
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Bharat4U API Response:', data);

    if (data.status) {
      return NextResponse.json(data);
    } else {
      // If status is false, return the error message from the gateway
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

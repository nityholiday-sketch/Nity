
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, customer_email, order_id } = body;

    // Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    const origin = request.headers.get('origin') || 'https://nityholiday.com';

    // Generate a strictly alphanumeric unique order ID (under 15 chars)
    const timestamp = Date.now().toString().slice(-8);
    const finalOrderId = order_id || `ORD${timestamp}`;

    // Bharat4U V4 Create Order Endpoint
    const API_URL = 'https://api.bharat4upe.com/api/payin/v4/create-order';

    // Construct payload with exactly required fields for V4
    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: (customer_name || "Customer").substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, '').trim(),
      customer_mobile: (customer_mobile || "9999999999").replace(/[^0-9]/g, '').slice(-10),
      customer_email: customer_email || "customer@nityholiday.com",
      amount: Math.floor(amount).toString(),
      redirect_url: `${origin}/payment-status?order_id=${finalOrderId}&status=SUCCESS`,
      callback_url: `${origin}/api/payments/bharat/callback`,
      remark: "Tour Package Booking"
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: `Gateway Error: ${response.status}`, 
        details: data 
      }, { status: response.status });
    }

    if (data.status) {
      return NextResponse.json(data);
    } else {
      // Return the exact message from Bharat4U for debugging
      return NextResponse.json({ 
        error: data.msg || data.message || 'Missing required parameters',
        details: data 
      }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

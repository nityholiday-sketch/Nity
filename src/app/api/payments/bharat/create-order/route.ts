
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, order_id } = body;

    // Bharat4U Credentials
    const BHARAT_MID = "BHARAT906370096";
    const BHARAT_KEY = "MKEY8ON66ORPLUF9";

    // Workstation Base URL for callbacks
    const baseUrl = "https://6000-firebase-studio-1756398918332.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev";

    // Generate a strictly alphanumeric unique order ID
    const finalOrderId = order_id || `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Using V4 API as it is the most modern and active version listed in your documentation
    const API_URL = 'https://api.bharat4upe.com/api/payin/v4/create-order';

    // V4 Payload construction
    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: (customer_name || "Customer").substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, ''),
      customer_mobile: customer_mobile || "9999999999",
      customer_email: "nity.holiday@gmail.com",
      amount: Math.floor(amount).toString(), // V4 expects INR string
      redirect_url: `${baseUrl}/payment-status`,
      callback_url: `${baseUrl}/api/payments/bharat/callback`,
    };

    console.log('Initiating Bharat4U V4 Payment:', { ...payload, bharat_key: '***' });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Bharat4U V4 Error Response:', data);
      return NextResponse.json({ 
        error: `Gateway Error: ${response.status}`, 
        details: data 
      }, { status: response.status });
    }

    console.log('Bharat4U V4 Success Response:', data);

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

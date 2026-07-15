
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

    // Generate a strictly alphanumeric unique order ID (Using ORD prefix as per examples)
    const finalOrderId = order_id || `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const API_URL = 'https://api.bharat4upe.com/api/payin/v1/create-order';

    // Construct the payload with all potentially required fields
    // Many gateways return 'Missing parameters' if redirect/callback URLs aren't provided
    const payload = {
      bharat_mid: BHARAT_MID,
      bharat_key: BHARAT_KEY,
      order_id: finalOrderId,
      customer_name: (customer_name || "Customer").substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, ''),
      customer_mobile: customer_mobile || "9999999999",
      customer_email: "nity.holiday@gmail.com", // Often required despite simple docs
      amount: Math.floor(amount).toString(),
      redirect_url: `${baseUrl}/payment-status`,
      callback_url: `${baseUrl}/api/payments/bharat/callback`,
    };

    console.log('Initiating Bharat4U Payment (Full Payload):', { ...payload, bharat_key: '***' });

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

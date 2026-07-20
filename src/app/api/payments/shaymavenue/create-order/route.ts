import { NextResponse } from 'next/server';
import dns from 'dns';

// Force Node's DNS resolver to prefer IPv4 — Shaymavenue only accepts IPv4.
// This must be called before any fetch; it affects the entire process DNS order.
dns.setDefaultResultOrder('ipv4first');

const API_URL = 'https://shaymavenue.in/api/v1/create_order';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, customer_email, order_id } = body;

    const MID = process.env.SHYAM_MID;
    const KEY = process.env.SHYAM_KEY;

    if (!MID || !KEY) {
      console.error('Shaymavenue: SHYAM_MID or SHYAM_KEY env var missing');
      return NextResponse.json({ error: 'Payment gateway not configured.' }, { status: 500 });
    }

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://nityholiday.com';

    // Generate a strictly alphanumeric unique order ID
    const timestamp = Date.now().toString().slice(-10);
    const finalOrderId = order_id || `SHYAM${timestamp}`;

    const payload = {
      mid: MID,
      apikey: KEY,
      client_txn_id: finalOrderId,
      amount: Math.floor(amount).toString(),
      customer_name: (customer_name || 'Customer').substring(0, 30).trim(),
      customer_mobile: (customer_mobile || '9999999999').replace(/[^0-9]/g, '').slice(-10),
      customer_email: customer_email || 'customer@nityholiday.com',
      redirect_url: `${origin}/payment-status?order_id=${finalOrderId}&status=SUCCESS`,
      callback_url: `${origin}/api/payments/shaymavenue/callback`,
    };

    console.log('Shaymavenue Request:', JSON.stringify({ ...payload, apikey: '***' }, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error(`Shaymavenue Response [${response.status}]:`, raw.substring(0, 300));
      return NextResponse.json(
        { error: `Gateway returned invalid response (HTTP ${response.status})`, raw: raw.substring(0, 200) },
        { status: 502 }
      );
    }

    console.log(`Shaymavenue Response [${response.status}]:`, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway Error: ${response.status}`, details: data },
        { status: response.status }
      );
    }

    // Assuming the response contains status and payment_url
    if (data.status === true || String(data.status).toLowerCase() === 'true' || data.status === 'SUCCESS' || data.payment_url || data.upiLink) {
      const paymentUrl =
        data.payment_url ||
        data.upiLink ||
        data.data?.payment_url ||
        data.data?.url ||
        data.url;

      return NextResponse.json({
        status: true,
        payment_url: paymentUrl,
        order_id: finalOrderId,
        data: data.data || data,
      });
    }

    return NextResponse.json(
      {
        error: data.msg || data.message || 'Payment order creation failed',
        details: data,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Shaymavenue create-order error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

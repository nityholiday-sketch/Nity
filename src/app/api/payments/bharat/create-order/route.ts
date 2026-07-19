import { NextResponse } from 'next/server';

// Bharat4U V1 endpoint (only active pay-in endpoint)
const BHARAT_API_URL = 'https://api.bharat4upe.com/api/payin/v1/create-order';

// Safely parse response — handles HTML error pages without throwing
async function safeJson(res: Response): Promise<{ data: any; raw: string }> {
  const raw = await res.text();
  try {
    return { data: JSON.parse(raw), raw };
  } catch {
    return { data: null, raw };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_mobile, customer_email, order_id } = body;

    const MID = process.env.BHARAT_MID;
    const KEY = process.env.BHARAT_KEY;

    if (!MID || !KEY) {
      console.error('Bharat4U: BHARAT_MID or BHARAT_KEY env var missing');
      return NextResponse.json({ error: 'Payment gateway not configured.' }, { status: 500 });
    }

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://nityholiday.com';

    // Unique alphanumeric order ID — max 15 chars as required by Bharat4U
    const timestamp = Date.now().toString().slice(-10);
    const finalOrderId = order_id || `ORD${timestamp}`;

    const payload = {
      bharat_mid: MID,
      bharat_key: KEY,
      order_id: finalOrderId,
      customer_name: (customer_name || 'Customer')
        .substring(0, 30)
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .trim(),
      customer_mobile: (customer_mobile || '9999999999')
        .replace(/[^0-9]/g, '')
        .slice(-10),
      customer_email: customer_email || 'customer@nityholiday.com',
      amount: Math.floor(amount).toString(),
      redirect_url: `${origin}/payment-status?order_id=${finalOrderId}&status=SUCCESS`,
      callback_url: `${origin}/api/payments/bharat/callback`,
    };

    console.log('Bharat4U V1 Request:', JSON.stringify({ ...payload, bharat_key: '***' }, null, 2));

    // ⚠️ Bharat4U V1 requires application/x-www-form-urlencoded — NOT JSON
    const formBody = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => formBody.append(key, String(val)));

    const response = await fetch(BHARAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    const { data, raw } = await safeJson(response);

    console.log(`Bharat4U V1 Response [${response.status}]:`, raw.substring(0, 500));

    // Gateway returned HTML — wrong URL or server error
    if (data === null) {
      return NextResponse.json(
        {
          error: `Gateway returned an unexpected response (HTTP ${response.status}). Please try again.`,
          raw: raw.substring(0, 300),
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway Error: ${response.status}`, details: data },
        { status: response.status }
      );
    }

    // Bharat4U V1 actual response: { status: true, message: "Order created successfully", result: { order_id, Txnid, amount, payment_url } }
    if (data.status === true || data.status === 'true') {
      const paymentUrl =
        data.result?.payment_url ||
        data.result?.url ||
        data.data?.payment_url ||
        data.payment_url ||
        data.url;

      return NextResponse.json({
        status: true,
        payment_url: paymentUrl,
        order_id: finalOrderId,
        data: data.result || data.data || {},
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
    console.error('Bharat4U create-order error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

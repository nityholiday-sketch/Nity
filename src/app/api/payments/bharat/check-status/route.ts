import { NextResponse } from 'next/server';

const BHARAT_STATUS_URL = 'https://api.bharat4upe.com/api/payin/v1/check-status';

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
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    const MID = process.env.BHARAT_MID;
    const KEY = process.env.BHARAT_KEY;

    if (!MID || !KEY) {
      return NextResponse.json({ error: 'Payment gateway not configured.' }, { status: 500 });
    }

    const payload = {
      bharat_mid: MID,
      bharat_key: KEY,
      order_id,
    };

    const response = await fetch(BHARAT_STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const { data, raw } = await safeJson(response);

    if (data === null) {
      return NextResponse.json(
        { error: `Gateway returned unexpected response (HTTP ${response.status})`, raw: raw.substring(0, 300) },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Bharat4U check-status error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

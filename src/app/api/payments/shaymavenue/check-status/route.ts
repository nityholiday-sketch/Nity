import { NextResponse } from 'next/server';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const API_URL = 'https://shaymavenue.in/api/v1/check_status';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_txn_id } = body;

    if (!client_txn_id) {
      return NextResponse.json({ error: 'client_txn_id is required' }, { status: 400 });
    }

    const MID = process.env.SHYAM_MID;
    const KEY = process.env.SHYAM_KEY;

    if (!MID || !KEY) {
      return NextResponse.json({ error: 'Payment gateway not configured.' }, { status: 500 });
    }

    const payload = {
      mid: MID,
      apikey: KEY,
      client_txn_id: client_txn_id,
      route: 1, // 1 for Payin status check
    };

    console.log('Shaymavenue Check Status Request:', JSON.stringify({ ...payload, apikey: '***' }, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(`Shaymavenue Check Status Response [${response.status}]:`, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway Error: ${response.status}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Shaymavenue check-status error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const API_URL = 'https://shaymavenue.in/api/v1/fetch_balance';

// GET /api/payments/shaymavenue/balance
// Returns the current merchant wallet balance from Shaymavenue
export async function GET() {
  try {
    const MID = process.env.SHYAM_MID;
    const KEY = process.env.SHYAM_KEY;

    if (!MID || !KEY) {
      return NextResponse.json({ error: 'Payment gateway not configured.' }, { status: 500 });
    }

    const url = `${API_URL}?mid=${encodeURIComponent(MID)}&apikey=${encodeURIComponent(KEY)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Disable Next.js caching — balance must always be fresh
      cache: 'no-store',
    });

    const data = await response.json();
    console.log('Shaymavenue Fetch Balance:', JSON.stringify(data, null, 2));

    if (!response.ok || !data.status) {
      return NextResponse.json(
        { error: data.statusMsg || 'Failed to fetch balance', details: data },
        { status: response.status }
      );
    }

    // Response: { status: true, statusMsg: "...", data: { Main_Balance: "18277.60" } }
    return NextResponse.json({
      balance: data.data?.Main_Balance ?? '0.00',
      raw: data,
    });
  } catch (error: any) {
    console.error('Shaymavenue fetch-balance error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

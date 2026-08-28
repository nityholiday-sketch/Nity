import { NextResponse } from 'next/server';
import { parsePayGlocalToken } from '@/lib/payglocal';

export async function POST(req: Request) {
  try {
    let payload: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const rawText = await req.text();
      try {
        payload = JSON.parse(rawText);
      } catch {
        const params = new URLSearchParams(rawText);
        params.forEach((v, k) => {
          payload[k] = v;
        });
      }
    }

    // Check if webhook is wrapped in x-gl-token
    if (payload['x-gl-token'] || payload['token']) {
      const parsed = parsePayGlocalToken(payload['x-gl-token'] || payload['token']);
      if (parsed.payload) {
        payload = { ...payload, ...parsed.payload };
      }
    }

    console.log('[PayGlocal Webhook Received]:', {
      gid: payload.gid,
      status: payload.status,
      merchantTxnId: payload.merchantTxnId,
      amount: payload.amount,
      currency: payload.currency,
      type: payload.type,
      paymentMethod: payload.paymentMethod,
    });

    // Handle transaction status update:
    // Statuses: SENT_FOR_CAPTURE, AUTHORIZED, SUCCESS, CAPTURED, ISSUER_DECLINE, CUSTOMER_CANCELLED, etc.
    const isSuccess =
      payload.status === 'SENT_FOR_CAPTURE' ||
      payload.status === 'AUTHORIZED' ||
      payload.status === 'SUCCESS' ||
      payload.status === 'CAPTURED';

    if (isSuccess) {
      console.log(`[PayGlocal Webhook] Transaction ${payload.gid} (${payload.merchantTxnId}) successfully captured!`);
      // Here you can update your Firestore database, send automated email vouchers, etc.
    } else {
      console.log(`[PayGlocal Webhook] Transaction ${payload.gid} (${payload.merchantTxnId}) failed with status: ${payload.status}`);
    }

    return NextResponse.json({
      success: true,
      received: true,
      gid: payload.gid,
      status: 'ACKNOWLEDGED',
    });
  } catch (error: any) {
    console.error('PayGlocal webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    service: 'PayGlocal Webhook Endpoint',
    merchant: 'Nityholiday',
  });
}

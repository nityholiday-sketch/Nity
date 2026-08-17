import { NextResponse } from 'next/server';
import { encryptCCAvenue, CCAVENUE_ACTION_URL } from '@/lib/ccavenue';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      packageName,
      amount,
      customer_name,
      customer_email,
      customer_mobile,
      travelDate,
      guests,
    } = body;

    const merchantId = process.env.CCAVENUE_MERCHANT_ID;
    const accessCode = process.env.CCAVENUE_ACCESS_CODE;
    const workingKey = process.env.CCAVENUE_WORKING_KEY;

    if (!merchantId || !accessCode || !workingKey) {
      console.error('CCAvenue credentials missing in environment variables');
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration is incomplete.' },
        { status: 500 }
      );
    }

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'A valid payment amount is required.' },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_email || !customer_mobile) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and mobile are required.' },
        { status: 400 }
      );
    }

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}` || 'https://www.nityholiday.com';

    const orderId = `NH_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const redirectUrl = `${baseUrl}/api/payments/ccavenue/response`;
    const cancelUrl = `${baseUrl}/api/payments/ccavenue/response`;

    const paymentParams: Record<string, string> = {
      merchant_id: merchantId,
      order_id: orderId,
      currency: 'INR',
      amount: Number(amount).toFixed(2),
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
      language: 'EN',
      billing_name: customer_name,
      billing_address: 'India',
      billing_city: 'Delhi',
      billing_state: 'Delhi',
      billing_zip: '110001',
      billing_country: 'India',
      billing_tel: customer_mobile,
      billing_email: customer_email,
      merchant_param1: packageName || 'Holiday Package',
      merchant_param2: travelDate || '',
      merchant_param3: String(guests || 1),
    };

    const plainText = Object.entries(paymentParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    const encRequest = encryptCCAvenue(plainText, workingKey);

    return NextResponse.json({
      success: true,
      encRequest,
      access_code: accessCode,
      actionUrl: CCAVENUE_ACTION_URL,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error('CCAvenue initiate transaction error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to initiate CCAvenue payment.' },
      { status: 500 }
    );
  }
}

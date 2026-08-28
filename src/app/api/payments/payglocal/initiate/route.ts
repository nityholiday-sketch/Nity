import { NextResponse } from 'next/server';
import { initiatePayCollectPayment } from '@/lib/payglocal';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      packageName,
      amount,
      currency = 'INR',
      customer_name,
      customer_email,
      customer_mobile,
      travelDate,
      guests,
    } = body;

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

    // Determine host & protocol for absolute callback URL
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (host ? `${protocol}://${host}` : 'https://www.nityholiday.com');

    // PayGlocal rule: merchantUniqueId & merchantTxnId MUST NOT start with "gl-"
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const merchantTxnId = `NH_${timestamp}_${randomSuffix}`;
    const merchantUniqueId = `UID_${timestamp}_${randomSuffix}`;

    const merchantCallbackURL = `${baseUrl}/api/payments/payglocal/callback`;

    // Extract client IP and headers for PayGlocal risk assessment
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || undefined;
    const httpAccept = req.headers.get('accept') || undefined;

    const result = await initiatePayCollectPayment({
      merchantTxnId,
      merchantUniqueId,
      amount: Number(amount),
      currency: (currency || 'INR').toUpperCase(),
      customer: {
        name: customer_name,
        email: customer_email,
        mobile: customer_mobile,
        ipAddress,
        userAgent,
        httpAccept,
      },
      product: {
        name: packageName || 'Holiday Package',
        sku: `PKG_${(packageName || 'HOLIDAY').toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 20)}`,
        type: 'Tour Package',
        quantity: Number(guests) || 1,
        price: Number(amount),
      },
      merchantCallbackURL,
    });

    if (result.success && result.redirectUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: result.redirectUrl,
        gid: result.gid,
        merchantTxnId,
        merchantUniqueId,
        currency,
        message: result.message || 'Payment initiation successful.',
      });
    }

    // Fallback/Simulated checkout if PayGlocal credentials are in test mode or failed
    console.error('PayGlocal initiate failed:', result.error);
    return NextResponse.json(
      {
        success: false,
        error: result.error || 'Failed to initiate PayGlocal payment.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('PayGlocal initiate route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while initiating payment.',
      },
      { status: 500 }
    );
  }
}

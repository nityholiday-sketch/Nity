import { NextRequest, NextResponse } from 'next/server';
import { generateVegaahSignature, formatAmount, generateTrackId } from '@/utils/vegaah';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      orderId,
      amount,
      currency = 'SAR', // Defaulting to SAR as per doc
      customerName,
      customerEmail,
      customerMobile,
      billingAddress,
      packageName,
      paymentType = '1' // 1 for purchase
    } = body;

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerMobile || !packageName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Environment variables
    const terminalId = process.env.VEGAAH_TERMINAL_ID!;
    const password = process.env.VEGAAH_PASSWORD!;
    const merchantKey = process.env.VEGAAH_MERCHANT_KEY!;
    const requestUrl = process.env.VEGAAH_REQUEST_URL!;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/vegaah/callback`;

    // Generate track ID and format amount
    const trackId = generateTrackId(orderId);
    const formattedAmount = formatAmount(Number(amount));

    // Generate signature
    const signature = generateVegaahSignature(
      trackId,
      terminalId,
      password,
      merchantKey,
      formattedAmount,
      currency
    );

    // Prepare request payload according to VegaaH specification
    const payload = {
      terminalId,
      password,
      signature,
      paymentType,
      amount: formattedAmount,
      currency,
      order: {
        orderId: trackId, // As per doc, hash uses trackId, and orderId in payload should match
        description: `Booking for ${packageName}`
      },
      customer: {
        customerName: customerName,
        customerEmail,
        customerMobile: customerMobile,
        billingAddressStreet: billingAddress?.street || 'Not Provided',
        billingAddressCity: billingAddress?.city || 'Not Provided',
        billingAddressState: billingAddress?.state || 'Not Provided',
        billingAddressPostalCode: billingAddress?.postalCode || '00000',
        billingAddressCountry: billingAddress?.country || 'IN'
      },
      callbackUrl: callbackUrl,
    };

    console.log('VegaaH Request Payload:', JSON.stringify(payload, null, 2));

    // Make request to VegaaH
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    console.log('VegaaH Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(responseData.responseDescription || 'Payment initiation failed at gateway');
    }

    // Check response code from VegaaH
    if (responseData.responseCode !== '001' && responseData.responseCode !== '000') {
      throw new Error(responseData.responseDescription || 'Gateway rejected payment initiation');
    }

    return NextResponse.json({
      success: true,
      transactionId: responseData.transactionId,
      paymentLink: responseData.paymentLink?.linkUrl,
    });

  } catch (error: any) {
    console.error('VegaaH Payment Route Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An internal server error occurred during payment initiation.',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

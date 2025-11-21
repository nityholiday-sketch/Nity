import { NextRequest, NextResponse } from 'next/server';
import { generateVegaahSignature, formatAmount, generateTrackId } from '@/lib/vegaah';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    console.log('Received payment request:', body);
    
    const {
      orderId,
      amount,
      packageName, // Added this to match frontend
      customerName,
      customerEmail,
      customerMobile,
      billingAddress,
      paymentType = '1'
    } = body;

    // Hardcode currency to SAR as per gateway configuration
    const currency = 'SAR';

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerMobile) {
      console.error('Missing required fields:', { orderId, amount, customerEmail, customerMobile });
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          details: {
            orderId: !orderId ? 'Order ID is required' : undefined,
            amount: !amount ? 'Amount is required' : undefined,
            customerEmail: !customerEmail ? 'Email is required' : undefined,
            customerMobile: !customerMobile ? 'Mobile is required' : undefined,
          }
        },
        { status: 400 }
      );
    }

    // Get environment variables
    const terminalId = process.env.VEGAAH_TERMINAL_ID;
    const password = process.env.VEGAAH_PASSWORD;
    const merchantKey = process.env.VEGAAH_MERCHANT_KEY;
    const requestUrl = process.env.VEGAAH_REQUEST_URL;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/vegaah/callback`;


    // Validate environment variables
    if (!terminalId || !password || !merchantKey || !requestUrl) {
      console.error('Missing environment variables:', {
        terminalId: !!terminalId,
        password: !!password,
        merchantKey: !!merchantKey,
        requestUrl: !!requestUrl
      });
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment gateway configuration error',
          details: 'Missing required environment variables'
        },
        { status: 500 }
      );
    }

    // Generate track ID and format amount
    const trackId = generateTrackId(orderId);
    const formattedAmount = formatAmount(Number(amount));

    console.log('Generating signature with:', {
      trackId,
      terminalId,
      password: '***', // Don't log password
      merchantKey: '***', // Don't log key
      amount: formattedAmount,
      currency
    });

    // Generate signature
    const signature = generateVegaahSignature(
      trackId,
      terminalId,
      password,
      merchantKey,
      formattedAmount,
      currency
    );

    // Prepare request payload
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

    let responseData;
    const responseText = await response.text();
    
    console.log('VegaaH Raw Response:', responseText);

    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse VegaaH response:', parseError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid response from payment gateway',
          details: responseText
        },
        { status: 502 }
      );
    }

    console.log('VegaaH Parsed Response:', JSON.stringify(responseData, null, 2));

    // Check if response is successful
    if (!response.ok) {
      console.error('VegaaH API error:', responseData);
      return NextResponse.json(
        { 
          success: false,
          error: responseData.responseDescription || 'Payment initiation failed at gateway',
          details: responseData
        },
        { status: response.status }
      );
    }

    // Check response code (000 = success, 001 = approved)
    if (responseData.responseCode !== '001' && responseData.responseCode !== '000') {
      console.error('VegaaH returned error code:', responseData.responseCode);
      return NextResponse.json(
        { 
          success: false,
          error: responseData.responseDescription || 'Gateway rejected payment initiation',
          responseCode: responseData.responseCode,
          details: responseData
        },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      transactionId: responseData.transactionId,
      paymentLink: responseData.paymentLink?.linkUrl,
      trackId,
      responseCode: responseData.responseCode,
      responseDescription: responseData.responseDescription,
      data: responseData
    });

  } catch (error: any) {
    console.error('VegaaH Payment Route Error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'An internal server error occurred during payment initiation.',
        details: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

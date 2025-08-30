import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/sabpaisa';
import { URLSearchParams } from 'url';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const encResponse = formData.get('encResponse');

    if (typeof encResponse !== 'string') {
      return NextResponse.json({ error: 'Invalid response from payment gateway' }, { status: 400 });
    }

    const decryptedData = decrypt(encResponse);
    
    // Log the full decrypted string for debugging
    console.log("Decrypted SabPaisa Response:", decryptedData);

    // Parse the decrypted string into an object
    const responseParams = new URLSearchParams(decryptedData);
    const responseJson: { [key: string]: string | null } = {};
    responseParams.forEach((value, key) => {
        responseJson[key] = value;
    });

    console.log("Parsed SabPaisa Response JSON:", responseJson);

    const statusCode = responseJson.statusCode;

    // Here you would typically update your database based on the payment status
    // For example: find the order by clientTxnId and update its status.
    if (statusCode === '0000') {
      // Payment Successful
      console.log(`Payment successful for clientTxnId: ${responseJson.clientTxnId}`);
    } else {
      // Payment Failed or Aborted
      console.log(`Payment failed/aborted for clientTxnId: ${responseJson.clientTxnId}. Status: ${responseJson.status}, Message: ${responseJson.sabpaisaMessage}`);
    }

    // Redirect user to a success or failure page
    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('status', responseJson.status || 'UNKNOWN');
    redirectUrl.searchParams.set('txnId', responseJson.clientTxnId || '');

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Error processing payment callback:', error);
    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('status', 'ERROR');
    return NextResponse.redirect(redirectUrl);
  }
}

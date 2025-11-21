
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const responseData = Object.fromEntries(formData.entries());

    console.log("VegaaH Callback Data:", responseData);
    
    const salt = process.env.VEGAAH_SALT!;
    const key = process.env.VEGAAH_MERCHANT_KEY!;
    const status = responseData.status as string;
    const txnid = responseData.txnid as string;
    const amount = responseData.amount as string;
    const productinfo = responseData.productinfo as string;
    const firstname = responseData.firstname as string;
    const email = responseData.email as string;
    const receivedHash = responseData.hash as string;

    // As per VegaaH docs, the hash string for response is: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
    const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const computedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('txnId', txnid);

    if (receivedHash !== computedHash) {
        console.error("Payment callback hash mismatch!");
        console.log("Expected hash string:", hashString);
        console.log("Received hash:", receivedHash);
        console.log("Computed hash:", computedHash);
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'Hash mismatch');
        return NextResponse.redirect(redirectUrl);
    }
    
    if (status === 'success') {
      console.log(`Payment successful for txnid: ${txnid}`);
      // Here you would typically update your database (e.g., Firestore) to mark the order as "PAID".
      redirectUrl.searchParams.set('status', 'SUCCESS');
    } else {
      console.log(`Payment failed for txnid: ${txnid}. Status: ${status}, Error: ${responseData.error_Message}`);
       // Here you would update your database to mark the order as "FAILED".
      redirectUrl.searchParams.set('status', 'FAILED');
    }

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Error processing payment callback:', error);
    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('status', 'ERROR');
    return NextResponse.redirect(redirectUrl);
  }
}

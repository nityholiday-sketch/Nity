
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper to decrypt AES-256-ECB (Java default) 
function decryptVegaahResponse(encryptedHex: string, keyHex: string) {
  try {
    const key = Buffer.from(keyHex, 'hex');
    const encryptedBytes = Buffer.from(encryptedHex, 'hex'); // OR base64 depending on gateway actual output, usually hex or base64
    
    // Note: Java's "AES" usually defaults to AES/ECB/PKCS5Padding
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encryptedBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (e) {
    console.error("Decryption error:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // VegaaH usually sends the parameter as 'data' or 'response'
    // You might need to inspect `req.body` if it's not form-data
    const encryptedData = formData.get('data') as string; 

    if (!encryptedData) {
        return NextResponse.json({ status: 'error', message: 'No data received' }, { status: 400 });
    }

    const merchantKey = process.env.VEGAAH_MERCHANT_KEY!;
    
    // 1. Decrypt
    const decryptedString = decryptVegaahResponse(encryptedData, merchantKey);
    if (!decryptedString) {
        // Redirect to a failure page if decryption fails
        const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'Decryption failed');
        return NextResponse.redirect(redirectUrl);
    }

    const responseJson = JSON.parse(decryptedString);
    
    // 2. Verify Signature
    // Formula: PaymentId|merchantKey|responseCode|amount
    const { transactionId, responseCode, amountDetails, signature } = responseJson;
    const amount = amountDetails.amount; // Ensure this matches the decimal format sent

    const calculatedHashString = `${transactionId}|${merchantKey}|${responseCode}|${amount}`;
    const calculatedSignature = crypto.createHash('sha256').update(calculatedHashString).digest('hex');

    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('txnId', transactionId);

    if (calculatedSignature !== signature) {
        console.error("Signature mismatch!");
        // TODO: Log this serious security event to your database
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'Invalid Signature');
        return NextResponse.redirect(redirectUrl);
    }

    // 3. Handle Success/Failure
    if (responseCode === "000" || responseCode === "001") { 
        // TODO: Update your Firestore/Database here using responseJson.orderDetails.orderId
        console.log("Payment Success for Order:", responseJson.orderDetails.orderId);
        
        redirectUrl.searchParams.set('status', 'SUCCESS');
        return NextResponse.redirect(redirectUrl);
    } else {
        console.log("Payment Failed:", responseCode);
        redirectUrl.searchParams.set('status', 'FAILED');
        return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error("Callback Error:", error);
    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('status', 'ERROR');
    redirectUrl.searchParams.set('reason', 'Internal Server Error');
    return NextResponse.redirect(redirectUrl);
  }
}

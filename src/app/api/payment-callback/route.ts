
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 1. Helper: Correctly Decrypt VegaaH Response
// Logic: Input is Base64. Key is Hex. Algorithm is AES-256-ECB.
function decryptVegaahResponse(encryptedBase64: string, keyHex: string) {
  try {
    // Convert the Merchant Key from Hex String to Byte Array (32 bytes)
    const key = Buffer.from(keyHex, 'hex'); 
    
    // Convert the Encrypted Data from Base64 to Buffer
    const encryptedBytes = Buffer.from(encryptedBase64, 'base64');
    
    // Create Decipher using AES-256-ECB (Standard for this gateway)
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
    decipher.setAutoPadding(true); // Expects PKCS5/PKCS7 padding (Java default)
    
    // Decrypt
    let decrypted = decipher.update(encryptedBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (e) {
    console.error("Decryption Logic Failed:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  console.log("🔹 Callback Received from Gateway");

  try {
    // 2. Parse Incoming Data
    // The gateway sends 'data' as a Form POST parameter
    const formData = await req.formData();
    const encryptedData = formData.get('data') as string;

    if (!encryptedData) {
        console.error("❌ No 'data' parameter found in body");
        const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'No data received from gateway');
        return NextResponse.redirect(redirectUrl);
    }

    const merchantKey = process.env.VEGAAH_MERCHANT_KEY;
    if (!merchantKey) {
        console.error("❌ Missing Merchant Key in Environment Variables");
        const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'Server configuration error');
        return NextResponse.redirect(redirectUrl);
    }
    
    // 3. Perform Decryption
    const decryptedString = decryptVegaahResponse(encryptedData, merchantKey);
    
    if (!decryptedString) {
        console.error("❌ Decryption returned null. Check Key or Data format.");
        const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'Could not decrypt gateway response');
        return NextResponse.redirect(redirectUrl);
    }

    console.log("✅ Decrypted Payload:", decryptedString);
    const responseJson = JSON.parse(decryptedString);
    
    // 4. Validate Signature (SHA256)
    // Formula: PaymentId|merchantKey|responseCode|amount
    const { transactionId, responseCode, amountDetails, signature } = responseJson;
    const amount = amountDetails.amount; 

    const calculatedHashString = `${transactionId}|${merchantKey}|${responseCode}|${amount}`;
    const calculatedSignature = crypto.createHash('sha256').update(calculatedHashString).digest('hex');

    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('txnId', transactionId);

    if (calculatedSignature !== signature) {
        console.warn("⚠️ Signature Mismatch! Request might be tampered.");
        // TODO: Log this serious security event to your database
        redirectUrl.searchParams.set('status', 'ERROR');
        redirectUrl.searchParams.set('reason', 'Invalid Signature');
        return NextResponse.redirect(redirectUrl);
    }

    // 5. Process Result
    if (responseCode === "000" || responseCode === "001") {
        // Payment Success
        // TODO: Update your database (e.g., await updateOrderStatus(responseJson.orderDetails.orderId, 'PAID'))
        console.log("Payment Success for Order:", responseJson.orderDetails.orderId);
        redirectUrl.searchParams.set('status', 'SUCCESS');
        return NextResponse.redirect(redirectUrl);
    } else {
        // Payment Failed
        console.log("Payment Failed:", responseCode, responseJson.responseDescription);
        redirectUrl.searchParams.set('status', 'FAILED');
        return NextResponse.redirect(redirectUrl);
    }

  } catch (error) {
    console.error("🔥 Critical Callback Error:", error);
    const redirectUrl = new URL('/payment-status', req.nextUrl.origin);
    redirectUrl.searchParams.set('status', 'ERROR');
    redirectUrl.searchParams.set('reason', 'Internal Server Error');
    return NextResponse.redirect(redirectUrl);
  }
}

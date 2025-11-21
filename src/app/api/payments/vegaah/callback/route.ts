import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function generateResponseSignature(
  paymentId: string,
  merchantKey: string,
  responseCode: string,
  amount: string
): string {
  const pipeSeperatedString = `${paymentId}|${merchantKey}|${responseCode}|${amount}`;
  return crypto.createHash('sha256').update(pipeSeperatedString).digest('hex');
}

function decryptVegaahResponse(encryptedBase64: string, keyHex: string): string | null {
  try {
    const key = Buffer.from(keyHex, 'hex');
    console.log("Debug: Key length (bytes):", key.length); // Should be 32 for AES-256

    // FIX: Sanitize the Base64 string. Web servers can convert '+' to ' ' during form-urlencoded parsing.
    const cleanBase64 = encryptedBase64.replace(/ /g, '+');
    console.log("Debug: Incoming data length:", encryptedBase64.length, "Cleaned data length:", cleanBase64.length);

    const encryptedBytes = Buffer.from(cleanBase64, 'base64');
    
    // Use aes-256-ecb, which does not use an IV.
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
    decipher.setAutoPadding(true); // Enable PKCS5/PKCS7 padding
    
    let decrypted = decipher.update(encryptedBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (e) {
    console.error("Decryption Logic Failed:", e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  console.log("🔹 Callback Received from VegaaH");
  try {
    const formData = await request.formData();
    const encryptedData = formData.get('data') as string;

    if (!encryptedData) {
      console.error("❌ No 'data' parameter found in callback body");
      return NextResponse.redirect(new URL('/payment-status?status=FAILED&reason=InvalidCallback', request.url));
    }

    const merchantKey = process.env.VEGAAH_MERCHANT_KEY;
    if (!merchantKey) {
        console.error("❌ Missing VEGAAH_MERCHANT_KEY in environment variables");
        return NextResponse.redirect(new URL('/payment-status?status=FAILED&reason=ServerConfigError', request.url));
    }
    
    const decryptedString = decryptVegaahResponse(encryptedData, merchantKey);
    
    if (!decryptedString) {
        console.error("❌ Decryption failed. Check key, data format, and encoding.");
        return NextResponse.redirect(new URL('/payment-status?status=FAILED&reason=DecryptionFailed', request.url));
    }

    console.log("✅ Decrypted JSON:", decryptedString);
    const responseData = JSON.parse(decryptedString);
    
    const { transactionId, responseCode, amountDetails, signature } = responseData;
    const amount = amountDetails.amount; 

    const expectedSignature = generateResponseSignature(
      transactionId,
      merchantKey,
      responseCode,
      amount
    );

    if (signature !== expectedSignature) {
      console.warn("⚠️ Invalid response signature. Data may be tampered with.");
      return NextResponse.redirect(new URL('/payment-status?status=FAILED&reason=InvalidSignature', request.url));
    }

    if (responseData.responseCode === '000' || responseData.responseCode === '001') {
      // Payment successful
      // TODO: Update your database (e.g., await updateBookingStatus(responseData.orderDetails.orderId, 'paid', responseData));
      
      console.log(`💰 Payment Successful for Txn: ${transactionId}`);
      return NextResponse.redirect(
        new URL(`/payment-status?status=SUCCESS&txnId=${transactionId}`, request.url)
      );
    } else {
      // Payment failed
      const reason = responseData.responseDescription || "Transaction Failed";
      console.error(`🛑 Payment Failed for Txn ${transactionId}: ${reason}`);
      return NextResponse.redirect(
        new URL(`/payment-status?status=FAILED&reason=${encodeURIComponent(reason)}&txnId=${transactionId}`, request.url)
      );
    }

  } catch (error) {
    console.error('🔥 Critical Callback Error:', error);
    return NextResponse.redirect(new URL('/payment-status?status=FAILED&reason=CallbackError', request.url));
  }
}

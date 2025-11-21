
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 1. Helper: Correctly Decrypt VegaaH Response
function decryptVegaahResponse(encryptedBase64: string, keyHex: string) {
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

export async function POST(req: NextRequest) {
  console.log("🔹 Callback Received");

  try {
    const formData = await req.formData();
    
    // Get the encrypted data from the 'data' parameter
    const encryptedData = formData.get('data') as string;

    if (!encryptedData) {
        console.error("❌ No 'data' parameter found in form body");
        return NextResponse.json({ status: 'error', message: 'No data received' }, { status: 400 });
    }

    const merchantKey = process.env.VEGAAH_MERCHANT_KEY;
    if (!merchantKey) {
        console.error("❌ Missing VEGAAH_MERCHANT_KEY in environment variables");
        return NextResponse.json({ status: 'error', message: 'Server Configuration Error' }, { status: 500 });
    }
    
    // 3. Attempt Decryption with the robust helper function
    const decryptedString = decryptVegaahResponse(encryptedData, merchantKey);
    
    if (!decryptedString) {
        console.error("❌ Decryption failed. Check key, data format, and encoding.");
        return NextResponse.json({ status: 'error', message: 'Decryption failed' }, { status: 400 });
    }

    console.log("✅ Decrypted JSON:", decryptedString);
    const responseJson = JSON.parse(decryptedString);
    
    // 4. Validate Signature (SHA256)
    // Formula: PaymentId|merchantKey|responseCode|amount
    const { transactionId, responseCode, amountDetails, signature } = responseJson;
    const amount = amountDetails.amount; 

    const calculatedHashString = `${transactionId}|${merchantKey}|${responseCode}|${amount}`;
    const calculatedSignature = crypto.createHash('sha256').update(calculatedHashString).digest('hex');

    if (calculatedSignature !== signature) {
        console.warn("⚠️ Signature Mismatch! Data may be tampered with.");
        console.warn("   Expected:", calculatedSignature);
        console.warn("   Received:", signature);
        // In a production environment, you should treat this as an error.
    }

    // 5. Handle Success/Failure and Redirect
    if (responseCode === "000" || responseCode === "001") {
        const orderId = responseJson.orderDetails?.orderId || 'unknown';
        console.log(`💰 Payment Successful for Order: ${orderId}`);
        
        // TODO: Update your database with the successful payment status here.
        
        return NextResponse.redirect(new URL(`/payment-status?status=SUCCESS&txnId=${transactionId}`, req.url));
    } else {
        const reason = responseJson.responseDescription || "Transaction Failed";
        console.error(`🛑 Payment Failed for txnId ${transactionId}: ${reason}`);
        return NextResponse.redirect(new URL(`/payment-status?status=FAILED&reason=${encodeURIComponent(reason)}&txnId=${transactionId}`, req.url));
    }

  } catch (error) {
    console.error("🔥 Critical Callback Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

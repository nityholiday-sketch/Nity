
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 1. Helper: Correctly Decrypt VegaaH Response
function decryptVegaahResponse(encryptedBase64: string, keyHex: string) {
  try {
    const key = Buffer.from(keyHex, 'hex'); 
    
    // FIX: Gateway often sends '+' as ' ' (space). We must fix this manually.
    // If we don't, the binary data shifts and decryption fails with "bad decrypt".
    const cleanBase64 = encryptedBase64.replace(/ /g, '+');
    
    const encryptedBytes = Buffer.from(cleanBase64, 'base64');
    
    // VegaaH uses AES-256-ECB (Electronic Codebook)
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
    decipher.setAutoPadding(true); 
    
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
    
    // 2. Get Data
    // Some gateways name the field 'data', others 'response'. 
    // We check both just in case.
    const encryptedData = (formData.get('data') || formData.get('response')) as string;

    if (!encryptedData) {
        console.error("❌ No 'data' or 'response' parameter found");
        return NextResponse.json({ status: 'error', message: 'No data received' }, { status: 400 });
    }

    const merchantKey = process.env.VEGAAH_MERCHANT_KEY;
    if (!merchantKey) {
        console.error("❌ Missing Merchant Key");
        return NextResponse.json({ status: 'error', message: 'Config Error' }, { status: 500 });
    }
    
    // 3. Attempt Decryption
    const decryptedString = decryptVegaahResponse(encryptedData, merchantKey);
    
    if (!decryptedString) {
        console.error("❌ Decryption failed. The Key might be wrong or Data is corrupted.");
        return NextResponse.json({ status: 'error', message: 'Decryption failed' }, { status: 400 });
    }

    console.log("✅ Decrypted JSON:", decryptedString);
    const responseJson = JSON.parse(decryptedString);
    
    // 4. Validate Signature
    // Hash Formula: PaymentId|merchantKey|responseCode|amount
    const { transactionId, responseCode, amountDetails, signature } = responseJson;
    
    // Note: We use the 'amount' exactly as received in the JSON (e.g., "10.00")
    const amount = amountDetails.amount; 

    const calculatedHashString = `${transactionId}|${merchantKey}|${responseCode}|${amount}`;
    const calculatedSignature = crypto.createHash('sha256').update(calculatedHashString).digest('hex');

    if (calculatedSignature !== signature) {
        console.warn("⚠️ Signature Mismatch! Expected:", calculatedSignature, "Got:", signature);
    }

    // 5. Handle Success (000 = Success, 001 = Approved)
    if (responseCode === "000" || responseCode === "001") {
        const orderId = responseJson.orderDetails?.orderId || 'unknown';
        console.log(`💰 Payment Successful for Order: ${orderId}`);
        
        // TODO: Add your Firestore update logic here
        
        return NextResponse.redirect(new URL(`/payment-status?status=SUCCESS&txnId=${transactionId}`, req.url));
    } else {
        const reason = responseJson.responseDescription || "Transaction Failed";
        console.error(`🛑 Payment Failed: ${reason}`);
        return NextResponse.redirect(new URL(`/payment-status?status=FAILED&reason=${encodeURIComponent(reason)}&txnId=${transactionId}`, req.url));
    }

  } catch (error) {
    console.error("🔥 Callback Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

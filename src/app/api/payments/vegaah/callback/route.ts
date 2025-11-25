// app/api/payments/vegaah/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const APP_URL      = process.env.NEXT_PUBLIC_APP_URL!;     // e.g. https://nityholiday.com
const MERCHANT_KEY = process.env.VEGAAH_MERCHANT_KEY!;     // hex string from Vegaah

// Response signature: SHA256(paymentId|merchantKey|responseCode|amount)
function generateResponseSignature(
  paymentId: string,
  merchantKey: string,
  responseCode: string,
  amount: string
): string {
  const pipeSeparatedString = `${paymentId}|${merchantKey}|${responseCode}|${amount}`;
  return crypto
    .createHash("sha256")
    .update(pipeSeparatedString, "utf8")
    .digest("hex");
}

// AES-256-ECB decryption (Base64 input, hex key)
function decryptVegaahResponse(encryptedBase64: string, keyHex: string): string | null {
  try {
    const key = Buffer.from(keyHex, "hex");
    console.log("Debug: Key length (bytes):", key.length); // should be 32 for AES-256

    // spaces → '+' in case of form-urlencoded conversion
    const cleanBase64 = encryptedBase64.replace(/ /g, "+");
    const encryptedBytes = Buffer.from(cleanBase64, "base64");

    const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
    decipher.setAutoPadding(true);

    let decrypted = decipher.update(encryptedBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (e) {
    console.error("Decryption Logic Failed:", e);
    return null;
  }
}

// simple GET so you can test in browser
export async function GET(request: NextRequest) {
  return NextResponse.json({
    ok: true,
    message: "VegaaH callback endpoint is alive. Use POST for real callbacks.",
  });
}

export async function POST(request: NextRequest) {
  console.log("🔹 Callback Received from VegaaH (final response)");
  try {
    const formData = await request.formData();
    const encryptedData = formData.get("data") as string | null;

    if (!encryptedData) {
      console.error("❌ No 'data' parameter found in callback body");
      return NextResponse.redirect(
        new URL("/payment-status?status=FAILED&reason=InvalidCallback", APP_URL)
      );
    }

    if (!MERCHANT_KEY) {
      console.error("❌ Missing VEGAAH_MERCHANT_KEY in environment variables");
      return NextResponse.redirect(
        new URL("/payment-status?status=FAILED&reason=ServerConfigError", APP_URL)
      );
    }

    const decryptedString = decryptVegaahResponse(encryptedData, MERCHANT_KEY);
    if (!decryptedString) {
      console.error("❌ Decryption failed. Check key, data format, and encoding.");
      return NextResponse.redirect(
        new URL("/payment-status?status=FAILED&reason=DecryptionFailed", APP_URL)
      );
    }

    console.log("✅ Decrypted JSON:", decryptedString);
    const responseData = JSON.parse(decryptedString);

    const {
      transactionId,
      responseCode,
      responseDescription,
      amountDetails,
      signature,
      paymentId, // some versions use paymentId; we handle both
    } = responseData;

    const amount = amountDetails?.amount?.toString() ?? "";

    // pick id used for signature (transactionId or paymentId)
    const idForSignature = (paymentId || transactionId || "").toString();

    if (!idForSignature || !responseCode || !amount) {
      console.warn("⚠️ Missing fields in decrypted data for signature check");
    } else {
      const expectedSignature = generateResponseSignature(
        idForSignature,
        MERCHANT_KEY,
        responseCode,
        amount
      );

      if (signature !== expectedSignature) {
        console.warn("⚠️ Invalid response signature. Data may be tampered with.");
        // You can hard-fail here if you want:
        // return NextResponse.redirect(
        //   new URL("/payment-status?status=FAILED&reason=InvalidSignature", APP_URL)
        // );
      }
    }

    // Determine success / failure
    if (responseCode === "000" || responseCode === "001") {
      console.log(`💰 Payment Successful for Txn: ${transactionId || paymentId}`);

      // TODO: update DB here if you want

      return NextResponse.redirect(
        new URL(
          `/payment-status?status=SUCCESS&txnId=${encodeURIComponent(
            transactionId || paymentId || ""
          )}`,
          APP_URL
        )
      );
    } else {
      const reason = responseDescription || "Transaction Failed";
      console.error(
        `🛑 Payment Failed for Txn ${transactionId || paymentId}: ${reason}`
      );

      return NextResponse.redirect(
        new URL(
          `/payment-status?status=FAILED&reason=${encodeURIComponent(
            reason
          )}&txnId=${encodeURIComponent(transactionId || paymentId || "")}`,
          APP_URL
        )
      );
    }
  } catch (error: any) {
    console.error("🔥 Critical Callback Error:", error);
    return NextResponse.redirect(
      new URL("/payment-status?status=FAILED&reason=CallbackError", APP_URL)
    );
  }
}

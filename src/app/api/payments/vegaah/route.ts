
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const TERMINAL_ID  = process.env.VEGAAH_TERMINAL_ID!;
const PASSWORD     = process.env.VEGAAH_PASSWORD!;
const MERCHANT_KEY = process.env.VEGAAH_MERCHANT_KEY!;
const CURRENCY     = "INR";

const VEGAH_URL =
  "https://test-vegaah.concertosoft.com/vegaahpayments/v2/payments/pay-request";

function generateVegaahSignature(params: {
  trackId: string;
  terminalId: string;
  password: string;
  merchantKey: string;
  amount: string;
  currency: string;
}) {
  const { trackId, terminalId, password, merchantKey, amount, currency } = params;
  const data = `${trackId}|${terminalId}|${password}|${merchantKey}|${amount}|${currency}`;
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderId,
      packageName,
      amount,
      customerName,
      customerEmail,
      customerMobile,
      billingAddress,
    } = body;

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: orderId or amount" },
        { status: 400 }
      );
    }

    const trackId = orderId;
    const amountStr = Number(amount).toFixed(2);

    const signature = generateVegaahSignature({
      trackId,
      terminalId: TERMINAL_ID,
      password: PASSWORD,
      merchantKey: MERCHANT_KEY,
      amount: amountStr,
      currency: CURRENCY,
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/vegaah/callback`;

    // Build the request body dynamically using data from the frontend
    const payRequestBody = {
      terminalId: TERMINAL_ID,
      password: PASSWORD,
      signature,
      paymentType: "1",
      amount: amountStr,
      currency: CURRENCY,
      order: {
        orderId: trackId, 
        description: packageName || "Tour booking"
      },
      customer: {
        customerEmail: customerEmail || "",
        billingAddressStreet: billingAddress?.street || "R.B. Street",
        billingAddressCity: billingAddress?.city || "MUMBAI",
        billingAddressState: billingAddress?.state || "MAHARASHTRA",
        billingAddressPostalCode: billingAddress?.postalCode || "400075",
        billingAddressCountry: billingAddress?.country || "IN"
      },
      additionalDetails: {
        userData: JSON.stringify({
          customerName: customerName || "",
          customerMobile: customerMobile || "",
          packageName: packageName || "",
          receiptUrl: callbackUrl
        })
      }
    };
    
    const signatureInput = `${trackId}|${TERMINAL_ID}|${PASSWORD}|${MERCHANT_KEY}|${amountStr}|${CURRENCY}`;

    console.log("=== VegaaH Request Debug ===");
    console.log("Signature input:", signatureInput);
    console.log("Generated signature:", signature);
    console.log("Request body:", JSON.stringify(payRequestBody, null, 2));
    
    if (process.env.NODE_ENV !== "production") {
      // return NextResponse.json({
      //   debug: true,
      //   signatureInput,
      //   signature,
      //   payRequestBody,
      // });
    }

    const gatewayRes = await fetch(VEGAH_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payRequestBody),
    });

    const responseText = await gatewayRes.text();
    console.log("Raw gateway response:", responseText);
    console.log("Response status:", gatewayRes.status);

    let gatewayJson;
    try {
      gatewayJson = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse gateway response:", e);
      return NextResponse.json(
        { success: false, error: "Invalid JSON response from gateway", raw: responseText },
        { status: 502 }
      );
    }

    console.log("Parsed gateway response:", gatewayJson);

    const responseCode = gatewayJson.responseCode;
    const paymentLink = gatewayJson.paymentLink?.linkUrl;
    const transactionId = gatewayJson.transactionId;

    // Check for successful response codes from VegaaH
    if (responseCode !== "001" && responseCode !== "000") {
      console.error("Gateway error - Response code:", responseCode, gatewayJson.responseDescription);
      return NextResponse.json(
        {
          success: false,
          error: gatewayJson.responseDescription || "Payment initiation failed",
          responseCode: responseCode,
          raw: gatewayJson,
        },
        { status: 400 }
      );
    }

    if (!paymentLink) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment link not received from gateway",
          raw: gatewayJson,
        },
        { status: 500 }
      );
    }

    const redirectUrl = transactionId
      ? `${paymentLink}${transactionId}`
      : paymentLink;

    return NextResponse.json({
      success: true,
      paymentLink: redirectUrl,
      transactionId: transactionId,
      trackId: trackId,
      raw: gatewayJson,
    });
  } catch (err: any) {
    console.error("Vegaah route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

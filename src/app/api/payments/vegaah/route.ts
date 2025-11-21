
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

    // Use orderId as trackId - keep it simple like curl
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

    // EXACTLY match your working curl structure
    const payRequestBody = {
      terminalId: TERMINAL_ID,
      password: PASSWORD,
      signature,
      paymentType: "1",
      amount: amountStr,
      currency: CURRENCY,
      order: {
        orderId: trackId, // Use the same trackId
        description: "Purchase of product XYZ" // Static like curl for now
      },
      customer: {
        customerEmail: "", // Empty like working curl
        billingAddressStreet: "R.B. Street", // Static defaults like curl
        billingAddressCity: "MUMBAI",
        billingAddressState: "MAHARASHTRA",
        billingAddressPostalCode: "400075",
        billingAddressCountry: "IN"
      },
      additionalDetails: {
        // Exact format from working curl
        userData: JSON.stringify({
          entryone: "abc",
          entrytwo: "def",
          entrythree: "xyz",
          receiptUrl: callbackUrl
        })
      }
    };

    console.log("=== VegaaH Request Debug ===");
    console.log("Signature input:", `${trackId}|${TERMINAL_ID}|${PASSWORD}|${MERCHANT_KEY}|${amountStr}|${CURRENCY}`);
    console.log("Generated signature:", signature);
    console.log("Request body:", JSON.stringify(payRequestBody, null, 2));

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
        { success: false, error: "Invalid response from gateway", raw: responseText },
        { status: 502 }
      );
    }

    console.log("Parsed gateway response:", gatewayJson);

    const responseCode = gatewayJson.responseCode;
    const paymentLink = gatewayJson.paymentLink?.linkUrl;
    const transactionId = gatewayJson.transactionId;

    // Check for successful response codes
    if (responseCode !== "001" && responseCode !== "000") {
      console.error("Gateway error - Response code:", responseCode);
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
        { status: 400 }
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

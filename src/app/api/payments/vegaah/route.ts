
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

    // Use the original orderId from the client as the trackId for the signature,
    // just like in the successful curl test.
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

    // This payload structure now exactly matches the working curl request.
    // It does NOT contain a top-level trackId or referenceId.
    const payRequestBody = {
      terminalId: TERMINAL_ID,
      password: PASSWORD,
      signature,
      paymentType: "1", // "1" for Purchase Transaction
      amount: amountStr,
      currency: CURRENCY,
      order: {
        orderId: orderId, // Use the original orderId here
        description: packageName ?? "Tour booking",
      },
      customer: {
        customerEmail,
        billingAddressStreet: billingAddress?.street,
        billingAddressCity: billingAddress?.city,
        billingAddressState: billingAddress?.state,
        billingAddressPostalCode: billingAddress?.postalCode,
        billingAddressCountry: billingAddress?.country ?? "IN",
      },
      additionalDetails: {
        userData: JSON.stringify({
          customerName,
          customerMobile,
          packageName,
          receiptUrl: callbackUrl,
        }),
      },
    };

    console.log("VegaaH Request Body:", JSON.stringify(payRequestBody, null, 2));

    const gatewayRes = await fetch(VEGAH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payRequestBody),
    });

    if (!gatewayRes.ok) {
      const text = await gatewayRes.text();
      console.error("VegaaH HTTP error:", gatewayRes.status, text);
      return NextResponse.json(
        { success: false, error: `Gateway returned an error: ${gatewayRes.status}` },
        { status: 502 }
      );
    }

    const gatewayJson = await gatewayRes.json();
    console.log("VegaaH response:", gatewayJson);

    const responseCode = gatewayJson.responseCode;
    const paymentLink = gatewayJson.paymentLink?.linkUrl;
    const transactionId = gatewayJson.transactionId;

    if ((responseCode !== "001" && responseCode !== "000") || !paymentLink) {
      return NextResponse.json(
        {
          success: false,
          error:
            gatewayJson.responseDescription ||
            "Payment initiation failed at gateway",
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
      { success: false, error: err.message || "An internal server error occurred." },
      { status: 500 }
    );
  }
}

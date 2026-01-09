
// /app/api/payments/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

if (!KEY_SECRET) {
  throw new Error("Razorpay Key Secret is not configured.");
}

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment details." },
        { status: 400 }
      );
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log(`✅ Payment Verified Successfully for Order ID: ${razorpay_order_id}`);

      // TODO: Here you would typically update your database.
      // e.g., await db.collection('orders').doc(razorpay_order_id).update({ status: 'paid' });

      // Redirect to a success page
      const redirectUrl = new URL(
        `/payment-status?status=SUCCESS&txnId=${encodeURIComponent(razorpay_payment_id)}`,
        APP_URL
      );
      return NextResponse.redirect(redirectUrl);
    } else {
      console.warn(`⚠️ Invalid Signature for Order ID: ${razorpay_order_id}`);
       const redirectUrl = new URL(
        `/payment-status?status=FAILED&reason=InvalidSignature&txnId=${encodeURIComponent(razorpay_payment_id)}`,
        APP_URL
      );
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error: any) {
    console.error("🔥 Razorpay Verify Error:", error);
    const redirectUrl = new URL(
        `/payment-status?status=FAILED&reason=VerificationError`,
        APP_URL
      );
    return NextResponse.redirect(redirectUrl);
  }
}

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// This file previously contained incorrect logic.
// The code has been replaced with the master fix provided by the user.

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  throw new Error("Razorpay API keys are not configured in environment variables.");
}

const razorpayInstance = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount provided." },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    console.log("✅ Razorpay Order Created:", order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      key_id: KEY_ID,
    });
  } catch (error: any) {
    console.error("🔥 Razorpay Create Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}

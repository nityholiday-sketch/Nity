
"use server";

import { z } from "zod";
import { generatePersonalizedTravelTips } from "@/ai/flows/personalized-travel-tips";
import { ContactFormSchema } from "@/components/contact-form";
import { encrypt } from "@/lib/sabpaisa";

// Define the schema for the AI tips form input
const TravelTipsSchema = z.object({
  tourPackageName: z.string({
    required_error: "Please select a tour package.",
  }),
});


export async function getAITipsAction(values: z.infer<typeof TravelTipsSchema>) {
  try {
    const tips = await generatePersonalizedTravelTips(values);
    return { success: true, data: tips };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate tips. Please try again." };
  }
}


export async function contactAction(data: z.infer<typeof ContactFormSchema>) {
  // Here you would typically send an email or store the inquiry in a database.
  console.log("New contact inquiry:", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

const PaymentInitiationSchema = z.object({
  amount: z.number(),
  payerName: z.string(),
  payerEmail: z.string().email(),
  payerMobile: z.string(),
});

export async function initiatePaymentAction(values: z.infer<typeof PaymentInitiationSchema>) {
    const clientCode = process.env.SABPAISA_CLIENT_CODE!;
    const transUserName = process.env.SABPAISA_USERNAME!;
    const transUserPassword = process.env.SABPAISA_PASSWORD!;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-callback`;
    const channelId = "W";
    const mcc = process.env.SABPAISA_MCC!;
    const spURL = process.env.SABPAISA_URL!;

    const clientTxnId = `NITY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const transDate =
        now.getFullYear() + '-' +
        pad(now.getMonth() + 1) + '-' +
        pad(now.getDate()) + ' ' +
        pad(now.getHours()) + ':' +
        pad(now.getMinutes()) + ':' +
        pad(now.getSeconds());

    const requestString = `payerName=${values.payerName}&payerEmail=${values.payerEmail}&payerMobile=${values.payerMobile}&clientTxnId=${clientTxnId}&amount=${values.amount}&clientCode=${clientCode}&transUserName=${transUserName}&transUserPassword=${transUserPassword}&callbackUrl=${callbackUrl}&channelId=${channelId}&mcc=${mcc}&transDate=${transDate}`;

    console.log("Plaintext request string:", requestString);

    try {
        const encData = encrypt(requestString);

        return {
            success: true,
            data: {
                encData,
                clientCode,
                spURL
            }
        };

    } catch (error) {
        console.error("Payment Initiation Error:", error);
        return { success: false, error: "Failed to initiate payment." };
    }
}

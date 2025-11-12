
"use server";

import { z } from "zod";
import { generatePersonalizedTravelTips } from "@/ai/flows/personalized-travel-tips";
import { ContactFormSchema } from "@/components/contact-form";
import crypto from 'crypto';

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
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  productinfo: z.string(),
});

export async function initiatePaymentAction(values: z.infer<typeof PaymentInitiationSchema>) {
    const key = process.env.VEGAAH_MERCHANT_KEY!;
    const salt = process.env.VEGAAH_SALT!;
    const vegaahURL = process.env.VEGAAH_URL!;

    const txnid = `NITY-${Date.now()}`;
    const surl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-callback`;
    const furl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-callback`;

    const data = {
        key: key,
        txnid: txnid,
        amount: values.amount.toString(),
        productinfo: values.productinfo,
        firstname: values.name,
        email: values.email,
        phone: values.phone,
        surl: surl,
        furl: furl,
    };

    const hashString = `${key}|${txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
    
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return {
        success: true,
        data: {
            ...data,
            hash: hash,
            action: vegaahURL
        }
    };
}

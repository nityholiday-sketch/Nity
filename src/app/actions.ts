
"use server";

import { z } from "zod";
import crypto from 'crypto';
import axios from 'axios';
import { generatePersonalizedTravelTips } from "@/ai/flows/personalized-travel-tips";
import { ContactFormSchema } from "@/components/contact-form";

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
  currency: z.string().default('SAR'),
  orderId: z.string(),
  customer: z.object({
    email: z.string().email(),
    name: z.string(),
    phone: z.string(),
  }),
  packageName: z.string(),
});

export async function initiatePaymentAction(values: z.infer<typeof PaymentInitiationSchema>) {
    const { amount, currency, orderId, customer, packageName } = values;

    const merchantKey = process.env.VEGAAH_MERCHANT_KEY;
    const terminalId = process.env.VEGAAH_TERMINAL_ID;
    const password = process.env.VEGAAH_PASSWORD;
    const requestUrl = process.env.VEGAAH_REQUEST_URL;

    if (!merchantKey || !terminalId || !password || !requestUrl) {
      console.error("VegaaH gateway credentials are not configured in .env");
      return { success: false, error: "Payment service is not configured." };
    }

    try {
      // Hashing Logic
      const amountFormatted = amount.toFixed(2);
      const trackId = orderId;
      const hashString = `${trackId}|${terminalId}|${password}|${merchantKey}|${amountFormatted}|${currency}`;
      
      const signature = crypto.createHash('sha256').update(hashString).digest('hex');

      // API Request Payload
      const payload = {
        paymentType: "1", // 1 for purchase
        terminalId: terminalId,
        password: password,
        signature: signature,
        amount: amountFormatted,
        currency: currency,
        order: {
          orderId: orderId,
          description: `Booking for ${packageName}`
        },
        customer: {
          customerEmail: customer.email,
          customerName: customer.name,
          customerMobile: customer.phone,
          billingAddressStreet: "NA",
          billingAddressCity: "NA",
          billingAddressState: "NA",
          billingAddressPostalCode: "00000",
          billingAddressCountry: "IN"
        },
      };

      console.log("Sending payment request to VegaaH:", payload);

      // Send request to VegaaH
      const response = await axios.post(requestUrl, payload);
      const responseData = response.data;
      
      console.log("Received response from VegaaH:", responseData);

      if (responseData && responseData.paymentLink?.linkUrl) {
        return {
          success: true,
          data: {
            paymentUrl: responseData.paymentLink.linkUrl,
            transactionId: responseData.transactionId,
          }
        };
      } else {
        console.error("Failed to get payment link from VegaaH", responseData);
        return { success: false, error: "Could not initiate payment. Please try again." };
      }

    } catch (error) {
      console.error("Error during VegaaH payment initiation:", error);
      return { success: false, error: "An unexpected error occurred while initiating payment." };
    }
}

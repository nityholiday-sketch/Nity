
'use server';

import {z} from 'zod';
import crypto from 'crypto';
import axios from 'axios';
import {generatePersonalizedTravelTips} from '@/ai/flows/personalized-travel-tips';
import {ContactFormSchema} from '@/components/contact-form';

// Define the schema for the AI tips form input
const TravelTipsSchema = z.object({
  tourPackageName: z.string({
    required_error: 'Please select a tour package.',
  }),
});

export async function getAITipsAction(values: z.infer<typeof TravelTipsSchema>) {
  try {
    const tips = await generatePersonalizedTravelTips(values);
    return {success: true, data: tips};
  } catch (error) {
    console.error(error);
    return {success: false, error: 'Failed to generate tips. Please try again.'};
  }
}

export async function contactAction(data: z.infer<typeof ContactFormSchema>) {
  // Here you would typically send an email or store the inquiry in a database.
  console.log('New contact inquiry:', data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {success: true};
}

const PaymentInitiationSchema = z.object({
  amount: z.number(),
  orderId: z.string(),
  packageName: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});

export async function initiatePaymentAction(values: z.infer<typeof PaymentInitiationSchema>) {
  const {amount, orderId, customer, packageName} = values;

  const {
    VEGAAH_MERCHANT_KEY,
    VEGAAH_TERMINAL_ID,
    VEGAAH_PASSWORD,
    VEGAAH_REQUEST_URL,
    NEXT_PUBLIC_APP_URL,
  } = process.env;

  if (!VEGAAH_MERCHANT_KEY || !VEGAAH_TERMINAL_ID || !VEGAAH_PASSWORD || !VEGAAH_REQUEST_URL || !NEXT_PUBLIC_APP_URL) {
    console.error('Missing Payment Configuration');
    return {success: false, error: 'Payment service is not configured.'};
  }

  const currency = 'SAR';
  const formattedAmount = amount.toFixed(2);
  const trackId = `${orderId}_Track`;

  // 1. Generate Request Signature using SHA256
  // Format: trackId|terminalId|password|mechantkey|amount|currency
  const signatureString = `${trackId}|${VEGAAH_TERMINAL_ID}|${VEGAAH_PASSWORD}|${VEGAAH_MERCHANT_KEY}|${formattedAmount}|${currency}`;

  const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

  // 2. Prepare Payload (aligns with doc page 9)
  const payload = {
    terminalId: VEGAAH_TERMINAL_ID,
    password: VEGAAH_PASSWORD,
    signature: signature,
    amount: formattedAmount,
    currency: currency,
    paymentType: '1', // Purchase
    order: {
      orderId: orderId,
      description: `Booking for ${packageName}`,
    },
    customer: {
      customerEmail: customer.email,
      customerName: customer.name,
      customerMobile: customer.phone,
      billingAddressStreet: customer.street,
      billingAddressCity: customer.city,
      billingAddressState: customer.state,
      billingAddressPostalCode: customer.postalCode,
      billingAddressCountry: customer.country,
    },
    callbackUrl: `${NEXT_PUBLIC_APP_URL}/api/payment-callback`,
  };

  try {
    // 3. Send Request
    const response = await axios.post(VEGAAH_REQUEST_URL, payload);

    if (response.data && response.data.paymentLink && response.data.paymentLink.linkUrl) {
      // Return the URL to the client
      return {
        success: true,
        data: {
          paymentUrl: response.data.paymentLink.linkUrl,
          transactionId: response.data.transactionId,
        },
      };
    } else {
      console.error('VegaaH Error:', response.data);
      return {success: false, error: response.data.responseDescription || 'Payment initiation failed'};
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return {success: false, error: 'Connection to payment gateway failed.'};
  }
}

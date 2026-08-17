'use server';

import { z } from 'zod';
import { generatePersonalizedTravelTips } from '@/ai/flows/personalized-travel-tips';
import { ContactFormSchema } from '@/components/contact-form';

// Define the schema for the AI tips form input
const TravelTipsSchema = z.object({
  tourPackageName: z.string({
    required_error: 'Please select a tour package.',
  }),
});

export async function getAITipsAction(values: z.infer<typeof TravelTipsSchema>) {
  try {
    const tips = await generatePersonalizedTravelTips(values);
    return { success: true, data: tips };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate tips. Please try again.' };
  }
}

export async function contactAction(data: z.infer<typeof ContactFormSchema>) {
  // Here you would typically send an email or store the inquiry in a database.
  console.log('New contact inquiry:', data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

export const BookingInquirySchema = z.object({
  packageName: z.string(),
  amount: z.number().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  travelDate: z.string().optional(),
  guests: z.number().min(1).default(1),
  specialRequests: z.string().optional(),
});

export type BookingInquiryInput = z.infer<typeof BookingInquirySchema>;

export async function submitBookingInquiryAction(data: BookingInquiryInput) {
  try {
    const validated = BookingInquirySchema.parse(data);
    console.log('New Booking Inquiry Received:', validated);
    // Simulate brief network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: 'Your booking inquiry has been received successfully! Our travel team will contact you shortly.',
    };
  } catch (error: any) {
    console.error('Booking inquiry error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to submit inquiry. Please try again.',
    };
  }
}

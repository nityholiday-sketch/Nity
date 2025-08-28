"use server";

import { z } from "zod";
import { generatePersonalizedTravelTips } from "@/ai/flows/personalized-travel-tips";

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

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function contactAction(data: z.infer<typeof ContactFormSchema>) {
  // Here you would typically send an email or store the inquiry in a database.
  console.log("New contact inquiry:", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

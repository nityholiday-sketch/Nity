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

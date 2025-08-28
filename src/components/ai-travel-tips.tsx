"use client";

import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WandSparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { packages } from "@/lib/data";
import { PersonalizedTravelTipsOutput } from "@/ai/flows/personalized-travel-tips";
import { getAITipsAction } from "@/app/actions";

const TravelTipsSchema = z.object({
  tourPackageName: z.string({
    required_error: "Please select a tour package.",
  }),
});

export default function AITravelTips() {
  const [tips, setTips] = useState<PersonalizedTravelTipsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof TravelTipsSchema>>({
    resolver: zodResolver(TravelTipsSchema),
  });
  
  const { isSubmitting } = useFormState({ control: form.control });

  async function onSubmit(values: z.infer<typeof TravelTipsSchema>) {
    setError(null);
    setTips(null);
    
    const result = await getAITipsAction(values);

    if (result.success && result.data) {
      setTips(result.data);
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
  }

  return (
    <section className="bg-secondary py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Get AI-Powered Travel Tips
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Select one of our tour packages, and our AI will generate personalized travel tips just for you, ensuring you're fully prepared for your adventure.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="tourPackageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a Tour Package</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose your adventure" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packages.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.name}>
                              {pkg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <WandSparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Tips
                </Button>
              </form>
            </Form>
          </div>
          <Card className="min-h-[250px]">
            <CardHeader>
              <CardTitle>Your Personalized Tips</CardTitle>
              <CardDescription>Tips will appear here once generated.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitting && (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating your tips...</p>
                </div>
              )}
              {error && <p className="text-destructive">{error}</p>}
              {tips && (
                 <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {tips.travelTips}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

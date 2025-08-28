import { Users, Globe, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Expert Guides",
    description: "Our guides are the heart of our tours. We bring destinations to life with their passion and deep knowledge.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Tailor-Made Trips",
    description: "We craft personalized itineraries that match your interests, style, and budget perfectly.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Commitment to Safety",
    description: "Your safety is our top priority. We adhere to the highest standards of safety and comfort.",
  },
];

export function WhyTravelWithUs() {
  return (
    <section className="bg-secondary py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Why Travel With Us?
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-background shadow-lg border-border/60 py-6">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <CardDescription className="pt-2 text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

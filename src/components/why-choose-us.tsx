import { ShieldCheck, Sparkles, BadgePercent } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Verified Services",
    description: "We partner with trusted and verified providers to ensure your safety and satisfaction on every trip.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Personalized Experiences",
    description: "Our experts craft tailor-made itineraries that match your interests, preferences, and budget perfectly.",
  },
  {
    icon: <BadgePercent className="h-10 w-10 text-primary" />,
    title: "Competitive Pricing",
    description: "Get the best value for your money. We offer competitive prices without compromising on quality.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose NityHoliday?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We are dedicated to making your travel dreams a reality with our commitment to quality and service.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center transition-transform transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

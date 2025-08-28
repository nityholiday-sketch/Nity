import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { packages } from "@/lib/data";
import { Clock, DollarSign, Plane, Train, Bus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  params: { slug: string };
};

// Generate static pages for all packages at build time
export async function generateStaticParams() {
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

// Generate metadata for each package page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = packages.find((p) => p.slug === params.slug);

  if (!pkg) {
    return {
      title: "Package Not Found",
    };
  }

  return {
    title: pkg.name,
    description: pkg.description,
    openGraph: {
      title: pkg.name,
      description: pkg.description,
      images: [
        {
          url: pkg.image, // Using placeholder for now
          width: 600,
          height: 400,
          alt: pkg.name,
        },
      ],
    },
  };
}

const transportIcons = {
  Flight: <Plane className="h-5 w-5" />,
  Train: <Train className="h-5 w-5" />,
  Bus: <Bus className="h-5 w-5" />,
  Heli: <AlertCircle className="h-5 w-5" />, // Placeholder for Helicopter
};

export default function PackageDetailsPage({ params }: Props) {
  const pkg = packages.find((p) => p.slug === params.slug);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="relative mb-8 h-64 md:h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={pkg.image}
            alt={pkg.name}
            fill
            priority
            className="object-cover"
            data-ai-hint="travel landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-white">
              {pkg.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="font-headline text-2xl font-bold">About this tour</h2>
            <p className="mt-4 text-muted-foreground">{pkg.description}</p>

            <h2 className="font-headline text-2xl font-bold mt-8">Itinerary</h2>
            <Accordion type="single" collapsible className="w-full mt-4">
              {pkg.itinerary.map((item) => (
                 <AccordionItem value={`item-${item.day}`} key={item.day}>
                   <AccordionTrigger>
                     <span className="font-semibold">Day {item.day}: {item.title}</span>
                   </AccordionTrigger>
                   <AccordionContent>
                     {item.description}
                   </AccordionContent>
                 </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Tour Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-primary" />
                  <span className="font-bold text-xl">${pkg.price}</span>
                  <span className="text-muted-foreground ml-1">/ person</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{pkg.duration}</span>
                </div>
                 <div className="flex items-start">
                  <div className="flex items-center">
                     <Plane className="h-5 w-5 mr-3 text-primary" />
                     <span>Transport:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-2">
                    {pkg.transport.map((t) => (
                      <span key={t} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        {transportIcons[t]} {t}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Book This Tour</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                        </div>
                        <div>
                            <Label htmlFor="travelers">Number of Travelers</Label>
                            <Input id="travelers" type="number" min="1" defaultValue="1" />
                        </div>
                         <Button className="w-full">Send Inquiry</Button>
                         <p className="text-xs text-center text-muted-foreground">
                            This will send an inquiry. Our team will contact you to confirm the booking.
                         </p>
                    </form>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

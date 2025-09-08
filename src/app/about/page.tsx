import type { Metadata } from "next";
import Image from "next/image";
import { Globe, Users, Target, ShieldCheck, BadgePercent, Headset, CalendarCheck, FileText, Landmark, Phone, Mail, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nityholiday, our mission, our vision, and the team dedicated to crafting your perfect journey.",
};

export default function AboutPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            About Nityholiday
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Crafting unforgettable travel experiences with passion and expertise.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                <video
                    src="https://firebasestorage.googleapis.com/v0/b/nityholiday-adventures.firebasestorage.app/o/about%20us%20video.mp4?alt=media&token=2827218a-03f8-44b4-8390-007920813df9"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div className="space-y-4">
                <h2 className="font-headline text-3xl font-bold">Our Story</h2>
                <p className="text-muted-foreground">
                    Nity Holiday is a trusted name in affordable and premium travel experiences. Powered by NITYTRAVELTODREAM LLP, we specialize in creating personalized holiday plans to the most exciting destinations in the world—starting with the glamour and adventure of Dubai.
                </p>
                <p className="text-muted-foreground">
                    Founded with a passion for travel and a commitment to exceptional service, our team brings years of experience in the travel industry to every package we create. We understand that a vacation is more than just a trip—it's an experience that creates lasting memories.
                </p>
            </div>
        </div>

        <div className="mt-24">
             <Alert>
                <Ban className="h-4 w-4" />
                <AlertTitle className="font-headline">Our Business Focus</AlertTitle>
                <AlertDescription>
                   Nity Holiday is a domestic and international tour operator offering curated holiday packages. We are not a gaming, voucher, or utility/DMT service provider, nor do we operate as a travel aggregator for flight, bus, or train bookings. Our focus is solely on providing memorable and well-organized travel experiences.
                </AlertDescription>
            </Alert>
        </div>


        <div className="mt-24 text-center">
          <div className="flex flex-col items-center space-y-3 max-w-3xl mx-auto">
            <div className="p-4 bg-secondary rounded-full">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-headline text-2xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground">
              Our mission is to make luxury travel accessible to everyone by offering comprehensive packages that include everything you need for a perfect holiday. From visa processing to airport transfers, hotel accommodations to exciting sightseeing tours—we handle it all, so you can focus on enjoying your journey.
            </p>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
             <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                At Nity Holiday, we're guided by a set of core principles that define how we operate and serve our customers.
            </p>
          </div>
           <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <BadgePercent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Transparency in Pricing</CardTitle>
                  <CardDescription className="pt-2">We believe in clear, upfront pricing with no hidden charges or last-minute surprises.</CardDescription>
                </CardHeader>
              </Card>
               <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CalendarCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Hassle-Free Bookings</CardTitle>
                  <CardDescription className="pt-2">Our streamlined booking process makes planning your trip quick and easy.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                   <Headset className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Friendly Customer Support</CardTitle>
                  <CardDescription className="pt-2">24/7 assistance from our experienced travel experts throughout your journey.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">100% Verified Services</CardTitle>
                  <CardDescription className="pt-2">All our services are verified for quality and reliability.</CardDescription>
                </CardHeader>
              </Card>
            </div>
        </div>

        <div className="mt-24">
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Legal Information</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Nity Holiday is a brand operated by NITYTRAVELTODREAM LLP, a legally registered Limited Liability Partnership in India. We comply with all applicable travel and tourism regulations and maintain appropriate insurance coverage for our operations.
                </p>
            </div>
            <Card className="mt-10 max-w-4xl mx-auto">
                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-headline font-semibold text-lg mb-4">Company Details</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start">
                                <Landmark className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">Company Name:</span>
                                    <p>NITYTRAVELTODREAM LLP</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <FileText className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">LLP Identification Number:</span>
                                    <p>ACN-7153</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <FileText className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">PAN:</span>
                                    <p>AAYFN0923D</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <FileText className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">TAN:</span>
                                    <p>JPRN09925G</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-headline font-semibold text-lg mb-4">Registered Address</h3>
                        <ul className="space-y-3 text-muted-foreground">
                           <li className="flex items-start">
                                <Landmark className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">Address:</span>
                                    <p>Ajmeri Gate Extension, AGC R, Ansari Road - 110002</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <Phone className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">Contact:</span>
                                    <p>+91 81605 49415</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <Mail className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">Email:</span>
                                    <p>nity.holiday@gmail.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

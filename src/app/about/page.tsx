import type { Metadata } from "next";
import Image from "next/image";
import { Globe, Users, Target } from "lucide-react";

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
                <Image 
                    src="https://picsum.photos/800/600?random=10"
                    alt="Team of Nityholiday"
                    fill
                    className="object-cover"
                    data-ai-hint="happy people team"
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
      </div>
    </div>
  );
}

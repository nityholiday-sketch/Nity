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
                <h2 className="font-headline text-3xl font-bold">Who We Are</h2>
                <p className="text-muted-foreground">
                    Nityholiday was born from a shared love for exploration and a desire to make travel accessible, authentic, and memorable for everyone. We are a team of seasoned travel experts, local guides, and passionate adventurers dedicated to curating journeys that go beyond the ordinary.
                </p>
                <p className="text-muted-foreground">
                    We believe that travel is not just about visiting new places, but about creating lasting memories, forging new connections, and discovering yourself along the way.
                </p>
            </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-secondary rounded-full">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-headline text-2xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide exceptional, high-quality, and personalized travel services that exceed our clients' expectations and create unforgettable memories.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-secondary rounded-full">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-headline text-2xl font-semibold">Our Vision</h3>
            <p className="text-muted-foreground">
              To be the leading and most trusted travel agency known for our creativity, reliability, and commitment to sustainable tourism.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-secondary rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-headline text-2xl font-semibold">Our Team</h3>
            <p className="text-muted-foreground">
              Our team consists of experienced professionals who are passionate about travel and dedicated to ensuring every detail of your trip is perfect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

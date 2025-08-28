import Link from "next/link";
import { Button } from "@/components/ui/button";
import { packages } from "@/lib/data";
import { PackageCard } from "@/components/package-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function FeaturedPackages() {
  const featuredPackages = packages.filter((p) => p.featured);

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Featured Tour Packages
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Embark on a journey of a lifetime with our specially curated travel packages.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto mt-10"
        >
          <CarouselContent>
            {featuredPackages.map((pkg) => (
              <CarouselItem key={pkg.id} className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-2">
                    <PackageCard pkg={pkg} />
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

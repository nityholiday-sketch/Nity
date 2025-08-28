import Link from "next/link";
import { Button } from "@/components/ui/button";
import { packages } from "@/lib/data";
import { PackageCard } from "@/components/package-card";

export function FeaturedPackages() {
  const featuredPackages = packages.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="bg-secondary py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Tour Packages
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Handpicked journeys to the most breathtaking destinations.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/packages">View All Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

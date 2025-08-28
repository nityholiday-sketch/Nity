import type { Metadata } from "next";
import { packages } from "@/lib/data";
import { PackageCard } from "@/components/package-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Explore our wide range of tour packages. Find the perfect adventure, from Himalayan treks to coastal getaways.",
};

export default function PackagesPage() {
  // Filtering logic will be implemented here in a future step
  const allPackages = packages;

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Our Tour Packages
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find your next adventure from our collection of curated journeys.
          </p>
        </div>

        <div className="my-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-grow">
            <Input
              type="search"
              placeholder="Search by name, destination..."
              className="w-full pl-10"
            />
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <ListFilter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Duration</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Price Range</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Transport Type</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}

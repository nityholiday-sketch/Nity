import Image from "next/image";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Package } from "@/lib/data";

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={pkg.image}
            alt={`Image of ${pkg.name}`}
            fill
            className="object-cover"
            data-ai-hint="travel destination"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <CardTitle className="font-headline text-xl mb-2">{pkg.name}</CardTitle>
        <p className="flex-grow text-sm text-muted-foreground">
          {pkg.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-bold">${pkg.price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/packages/${pkg.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

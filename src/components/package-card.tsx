import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Package } from "@/lib/data";

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl border rounded-lg">
      <CardHeader className="p-0 relative">
        <div className="relative h-56 w-full">
          <Image
            src={pkg.image}
            alt={`Image of ${pkg.name}`}
            fill
            className="object-cover"
            data-ai-hint="travel destination"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
           <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-primary font-bold text-lg p-2 rounded-md">
             ₹{pkg.price.toLocaleString()}
           </div>
           {pkg.featured && (
             <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold p-1 px-2 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>FEATURED</span>
             </div>
           )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{pkg.location}</span>
        </div>
        <CardTitle className="font-headline text-xl mb-2">{pkg.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{pkg.duration}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/packages/${pkg.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

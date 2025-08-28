import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-[60vh] w-full min-h-[400px] md:h-[80vh]">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Breathtaking mountain landscape at sunrise"
        fill
        className="object-cover"
        priority
        data-ai-hint="mountain landscape"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your Journey Begins Here
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-200 md:text-xl">
            Discover curated travel experiences that you'll cherish for a lifetime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/packages">Explore Packages</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Inquire Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

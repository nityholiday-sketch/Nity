import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-[80vh] w-full min-h-[500px] md:h-[90vh]">
      <Image
        src="https://picsum.photos/1920/1080?random=100"
        alt="Breathtaking mountain landscape with temples"
        fill
        className="object-cover"
        priority
        data-ai-hint="mountain landscape temples"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6">
            <div className="mb-4">
                <div className="text-2xl md:text-4xl font-bold tracking-widest text-amber-400/90" style={{fontFamily: "'Times New Roman', serif"}}>BY BUS</div>
                <div className="mt-2 flex justify-center gap-4 md:gap-8 text-sm md:text-base font-light tracking-wider text-white/80">
                    <span>YAMUNOTRI</span>
                    <span>GANGOTRI</span>
                    <span>KEDARNATH</span>
                    <span>BADRINATH</span>
                </div>
            </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your Adventure Awaits
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-200 md:text-xl">
            Discover unforgettable travel experiences with KR Field Holiday.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/packages">Explore Packages</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-[80vh] w-full min-h-[500px] md:h-[90vh] overflow-hidden">
      <video
        src="https://firebasestorage.googleapis.com/v0/b/nityholiday-adventures.firebasestorage.app/o/cover.mp4?alt=media&token=aafeca95-eef9-40bf-a5c3-703b2f8b8aaa"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6">
            <div className="mb-4">
                <div className="text-2xl md:text-4xl font-bold tracking-widest text-amber-400/90" style={{fontFamily: "'Times New Roman', serif"}}>BY BUS</div>
            </div>
        </div>
      </div>
    </section>
  );
}

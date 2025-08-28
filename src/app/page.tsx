import { Hero } from "@/components/hero";
import { WhyChooseUs } from "@/components/why-choose-us";
import { FeaturedPackages } from "@/components/featured-packages";
import { Testimonials } from "@/components/testimonials";
import AITravelTips from "@/components/ai-travel-tips";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <FeaturedPackages />
      <Testimonials />
      <AITravelTips />
    </>
  );
}

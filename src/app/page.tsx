import { Hero } from "@/components/hero";
import { WhyTravelWithUs } from "@/components/why-travel-with-us";
import { FeaturedPackages } from "@/components/featured-packages";
import { Testimonials } from "@/components/testimonials";
import { WhatWeProvide } from "@/components/what-we-provide";


export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <WhatWeProvide />
      <Testimonials />
      <WhyTravelWithUs />
    </>
  );
}

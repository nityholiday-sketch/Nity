import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah L.",
    title: "Adventurer",
    avatar: "SL",
    image: "https://picsum.photos/100/100?random=1",
    quote:
      "The Himalayan Serenity trip was a life-changing experience. NityHoliday's team was professional, and everything was perfectly organized. I can't wait for my next adventure with them!",
  },
  {
    name: "John D.",
    title: "Family Traveler",
    avatar: "JD",
    image: "https://picsum.photos/100/100?random=2",
    quote:
      "Our Coastal Wonders vacation was fantastic. The kids loved the beaches, and the arrangements were seamless. Highly recommended for a hassle-free family holiday.",
  },
  {
    name: "Emily R.",
    title: "Solo Explorer",
    avatar: "ER",
    image: "https://picsum.photos/100/100?random=3",
    quote:
      "I did the Desert Odyssey tour, and it was magical. The camel safari under the stars is something I'll never forget. The guides were knowledgeable and friendly.",
  },
];

export function Testimonials() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Travelers Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Stories from those who've journeyed with us.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto mt-10"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-muted-foreground italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-4 flex items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint="person face" />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 text-left">
                          <p className="font-semibold font-headline">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

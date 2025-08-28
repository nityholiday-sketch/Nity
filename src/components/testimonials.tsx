import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Anika Mehta",
    location: "Mumbai, Maharashtra",
    avatar: "AM",
    image: "https://firebasestorage.googleapis.com/v0/b/nityholiday-adventures.firebasestorage.app/o/testi%20(1).png?alt=media&token=a1cb1e8c-2670-478d-bff5-2b8df8022515",
    quote:
      "An absolutely royal experience. The guide was incredibly knowledgeable and brought the history of Rajasthan to life. The sunset camel ride was unforgettable.",
  },
  {
    name: "Alok Nath",
    location: "Varanasi, UP",
    avatar: "AN",
    image: "https://firebasestorage.googleapis.com/v0/b/nityholiday-adventures.firebasestorage.app/o/testi%20(2).png?alt=media&token=6d4ce699-c6d8-45dc-b63e-097e3cc45ddc",
    quote:
      "Train se Char Dham Yatra ka anubhav bohot hi shaandar tha. Sab kuch acche se organized tha hume bohot accha laga.",
  },
  {
    name: "Kavita Iyer",
    location: "Chennai, Tamil Nadu",
    avatar: "KI",
    image: "https://picsum.photos/100/100?random=3",
    quote:
      "Gujarat has so much to offer! From the ancient temples of Dwarka and Somnath to the modern marvels of the Statue of Unity. A very diverse and amazing experience.",
  },
    {
    name: "Sneha Agarwal",
    location: "Gurgaon, Haryana",
    avatar: "SA",
    image: "https://picsum.photos/100/100?random=4",
    quote:
      "The Auli and Mussoorie trip was a fantastic winter getaway. The arrangements were top-notch and our guide was very friendly and helpful.",
  },
  {
    name: "Sahil Kumar",
    location: "Mumbai, Maharashtra",
    avatar: "SK",
    image: "https://picsum.photos/100/100?random=5",
    quote:
        "Rajasthan ka trip ek dum royal tha! Hawa mahal aur desert camp... sab kuch awesome. Paisa wasool!",
  },
  {
    name: "Naval Kumar",
    location: "Lucknow, Uttar Pradesh",
    avatar: "NK",
    image: "https://picsum.photos/100/100?random=6",
    quote:
        "The bus journey for the Char Dham Yatra was comfortable and scenic. The driver and guide were very professional and helpful throughout the trip. Great value for money!",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Adventurers Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real stories from real travellers. See why our adventurers trust us with their dream vacations.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/50 p-1">
                                <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint="person face" />
                                <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                            </Avatar>
                        </div>
                        <p className="text-muted-foreground italic text-center mb-4">
                            "{testimonial.quote}"
                        </p>
                        <div className="flex justify-center text-yellow-500 mb-2">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                        </div>
                        <div className="text-center">
                            <p className="font-semibold font-headline">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}

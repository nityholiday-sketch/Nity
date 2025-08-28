import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nityholiday. We're here to help you plan your next adventure.",
};

export default function ContactPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Get In Touch
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Have a question or ready to book your trip? Contact us!
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-12">
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="font-headline text-2xl font-bold mb-6">Send us a message</h2>
            <ContactForm />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-2xl font-bold mb-4">Contact Information</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start">
                  <MapPin className="h-6 w-6 mr-4 text-primary mt-1" />
                  <div>
                    <span className="font-semibold text-foreground">Address:</span><br/>
                    Ajmeri Gate Extension, AGC R, Ansari Road - 110002
                  </div>
                </li>
                <li className="flex items-center">
                  <Mail className="h-6 w-6 mr-4 text-primary" />
                  <div>
                    <span className="font-semibold text-foreground">Email:</span>
                    <a href="mailto:nity.holiday@gmail.com" className="block hover:text-primary">nity.holiday@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-center">
                  <Phone className="h-6 w-6 mr-4 text-primary" />
                  <div>
                     <span className="font-semibold text-foreground">Phone:</span>
                    <a href="tel:+918160549415" className="block hover:text-primary">+91 81605 49415</a>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-headline text-2xl font-bold mb-4">Our Location</h2>
              <div className="aspect-video w-full bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
                {/* 
                  To add a real Google Map, you'd use a library like @vis.gl/react-google-maps 
                  and replace this div with the Map component. This requires a Google Maps API key.
                */}
                <p>Google Map Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

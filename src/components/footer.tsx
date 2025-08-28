import Link from "next/link";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "./ui/button";
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm">
              Your gateway to unforgettable travel experiences.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Instagram className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Github className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="font-headline font-semibold">Quick Links</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
                  <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-headline font-semibold">Legal</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-headline font-semibold">Subscribe</h3>
                <p className="mt-4 text-sm">
                  Get the latest deals and travel tips straight to your inbox.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NityHoliday Adventures. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "./ui/button";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="space-y-4 md:col-span-2">
            <Link href="/">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your gateway to new adventures, discover the world with us.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Facebook className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Instagram className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About us</Link></li>
              <li><Link href="/packages" className="text-muted-foreground hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold">Contact us</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>nity.holiday@gmail.com</li>
                <li>Ajmeri Gate Extension, AGC R, Ansari Road - 110002</li>
                <li>+91 81605 49415</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NITYTRAVELTODREAM LLP. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

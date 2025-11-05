import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login page for Nityholiday.",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Please log in to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="https://login.nityholiday.com">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

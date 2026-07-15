
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const BookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
});

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  amount: number;
}

export function BookingModal({ isOpen, onClose, packageName, amount }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
    defaultValues: { name: "", mobile: "" },
  });

  async function onSubmit(values: z.infer<typeof BookingSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/payments/bharat/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          customer_name: values.name,
          customer_mobile: values.mobile,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        // Bharat4U typically returns the payment URL in data.url or data.payment_url
        const paymentUrl = result.data?.url || result.data?.payment_url;
        
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          toast({
            title: "Payment Error",
            description: "Payment URL not found in gateway response.",
            variant: "destructive",
          });
          console.error("Missing URL in response:", result);
        }
      } else {
        const errorMsg = result.error || result.msg || result.message || "Payment initiation failed.";
        toast({
          title: "Booking Error",
          description: errorMsg,
          variant: "destructive",
        });
        console.error("Payment API Error Details:", JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      console.error("Connection Error:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to the booking server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <CreditCard className="text-primary" /> Book Your Journey
          </DialogTitle>
          <DialogDescription>
            You are booking: <strong>{packageName}</strong> for ₹{amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="10-digit mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="bg-secondary/50 p-4 rounded-lg flex items-start gap-3 mt-4">
              <ShieldCheck className="h-5 w-5 text-green-600 mt-1" />
              <p className="text-xs text-muted-foreground">
                Your payment is processed securely via Bharat4U. Please ensure your mobile number is correct for confirmation.
              </p>
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay & Confirm Booking"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

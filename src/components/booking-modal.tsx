
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  IndianRupee,
  Wallet,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
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
  email: z.string().email("Please enter a valid email address"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
});

type PaymentStep = "details" | "payment-type" | "advance-amount";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  amount: number;
}

export function BookingModal({
  isOpen,
  onClose,
  packageName,
  amount,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<PaymentStep>("details");
  const [advanceAmount, setAdvanceAmount] = useState<string>("");
  const [advanceError, setAdvanceError] = useState<string>("");
  const [formValues, setFormValues] = useState<z.infer<typeof BookingSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
    defaultValues: { name: "", email: "", mobile: "" },
  });

  // Reset state when modal closes
  const handleClose = () => {
    setStep("details");
    setAdvanceAmount("");
    setAdvanceError("");
    setFormValues(null);
    form.reset();
    onClose();
  };

  // Step 1: validate details → go to payment type choice
  async function onDetailsSubmit(values: z.infer<typeof BookingSchema>) {
    setFormValues(values);
    setStep("payment-type");
  }

  // Initiate payment with the resolved amount
  async function initiatePayment(payAmount: number) {
    if (!formValues) return;
    setLoading(true);
    try {
      const response = await fetch("/api/payments/shaymavenue/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payAmount,
          customer_name: formValues.name,
          customer_mobile: formValues.mobile,
          customer_email: formValues.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        const paymentUrl =
          result.payment_url ||
          result.data?.payment_url ||
          result.data?.url ||
          result.url;

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          toast({
            title: "Payment URL Missing",
            description:
              "Transaction initiated but no payment URL was received.",
            variant: "destructive",
          });
        }
      } else {
        const errorMsg =
          result.details?.msg ||
          result.details?.message ||
          result.error ||
          result.msg ||
          result.message ||
          "Payment initiation failed. Please try again.";
        toast({
          title: "Booking Error",
          description: errorMsg,
          variant: "destructive",
        });
        console.error("Payment API Error Details:", JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to the booking server.",
        variant: "destructive",
      });
      console.error("Connection Error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle advance amount submission
  function handleAdvancePay() {
    const val = parseFloat(advanceAmount);
    if (!advanceAmount || isNaN(val) || val < 500) {
      setAdvanceError("Please enter a valid amount (minimum ₹500).");
      return;
    }
    if (val > amount) {
      setAdvanceError(`Amount cannot exceed the full package price of ₹${amount.toLocaleString()}.`);
      return;
    }
    setAdvanceError("");
    initiatePayment(val);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[460px]">

        {/* ── STEP 1: Customer Details ── */}
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                <CreditCard className="text-primary" /> Book Your Journey
              </DialogTitle>
              <DialogDescription>
                You are booking: <strong>{packageName}</strong> for ₹
                {amount.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onDetailsSubmit)}
                className="space-y-4 pt-4"
              >
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                        />
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
                        <Input
                          placeholder="10-digit mobile number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="bg-secondary/50 p-4 rounded-lg flex items-start gap-3 mt-2">
                  <ShieldCheck className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Your payment is processed securely via Shaymavenue. Ensure
                    your details are correct for confirmation.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                >
                  Continue to Payment →
                </Button>
              </form>
            </Form>
          </>
        )}

        {/* ── STEP 2: Choose Full or Advance ── */}
        {step === "payment-type" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                <Wallet className="text-primary" /> Choose Payment Option
              </DialogTitle>
              <DialogDescription>
                How would you like to pay for <strong>{packageName}</strong>?
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4 space-y-4">
              {/* Full Payment Card */}
              <button
                onClick={() => initiatePayment(amount)}
                disabled={loading}
                className="w-full text-left rounded-xl border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 p-5 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 group-hover:bg-primary/20 p-2 transition-colors">
                    <IndianRupee className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Full Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Pay the complete amount now
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-lg text-primary">
                      ₹{amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Instant booking confirmation</span>
                </div>
              </button>

              {/* Advance Payment Card */}
              <button
                onClick={() => setStep("advance-amount")}
                disabled={loading}
                className="w-full text-left rounded-xl border-2 border-orange-300/50 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 p-5 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 p-2 transition-colors">
                    <Wallet className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Advance Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Pay a partial amount (booking token)
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium text-orange-500">
                      Custom
                    </p>
                    <p className="text-xs text-muted-foreground">Min ₹500</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />
                  <span>Pay remaining balance before trip date</span>
                </div>
              </button>

              <button
                onClick={() => setStep("details")}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Edit details
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Enter Advance Amount ── */}
        {step === "advance-amount" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                <Wallet className="text-orange-500" /> Advance Payment
              </DialogTitle>
              <DialogDescription>
                Enter the amount you'd like to pay now for{" "}
                <strong>{packageName}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4 space-y-5">
              {/* Package total reference */}
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Total package price</span>
                <span className="font-semibold">₹{amount.toLocaleString()}</span>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Advance Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min={500}
                    max={amount}
                    placeholder={`e.g. ${Math.min(5000, amount)}`}
                    value={advanceAmount}
                    onChange={(e) => {
                      setAdvanceAmount(e.target.value);
                      setAdvanceError("");
                    }}
                    className="pl-7 h-12 text-lg"
                  />
                </div>
                {advanceError && (
                  <p className="text-sm text-destructive">{advanceError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum ₹500 · Maximum ₹{amount.toLocaleString()}
                </p>
              </div>

              {/* Quick select chips */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Quick select
                </p>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000, 5000]
                    .filter((v) => v <= amount)
                    .map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setAdvanceAmount(String(v));
                          setAdvanceError("");
                        }}
                        className="rounded-full border border-border px-3 py-1 text-sm hover:bg-secondary transition-colors"
                      >
                        ₹{v.toLocaleString()}
                      </button>
                    ))}
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  This advance payment secures your booking. The remaining
                  balance of{" "}
                  <strong>
                    ₹
                    {(amount - (parseFloat(advanceAmount) || 0)).toLocaleString()}
                  </strong>{" "}
                  must be paid before your trip date.
                </p>
              </div>

              <Button
                onClick={handleAdvancePay}
                disabled={loading}
                className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{advanceAmount ? parseFloat(advanceAmount).toLocaleString() : "—"} as Advance
                  </>
                )}
              </Button>

              <button
                onClick={() => setStep("payment-type")}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to payment options
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

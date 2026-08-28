"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  CalendarCheck,
  Phone,
  Mail,
  User,
  Calendar as CalendarIcon,
  Users,
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
import { useCurrency } from "@/context/currency-context";
import { CurrencySegmentedToggle } from "@/components/currency-switcher";

const BookingDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z
    .string()
    .min(7, "Please enter a valid mobile number"),
  travelDate: z.string().optional(),
  guests: z.coerce.number().min(1, "Minimum 1 guest").max(50).default(1),
});

type BookingDetails = z.infer<typeof BookingDetailsSchema>;
type BookingStep = "details" | "payment-type" | "advance-amount";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  amount: number; // Base amount in INR
}

export function BookingModal({
  isOpen,
  onClose,
  packageName,
  amount,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<BookingStep>("details");
  const [advanceAmount, setAdvanceAmount] = useState<string>("");
  const [advanceError, setAdvanceError] = useState<string>("");
  const [formValues, setFormValues] = useState<BookingDetails | null>(null);
  const { toast } = useToast();
  const { currency, currencyConfig, convertPrice, formatAmount } = useCurrency();

  const form = useForm<BookingDetails>({
    resolver: zodResolver(BookingDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      travelDate: "",
      guests: 1,
    },
  });

  // Calculate prices converted to current selected currency
  const perPersonPriceInCurrency = convertPrice(amount);
  const totalPackagePriceInCurrency = (formValues?.guests || 1) * perPersonPriceInCurrency;

  const minAdvanceAmount = currency === "USD" ? 10 : 500;
  const quickSelectValues =
    currency === "USD"
      ? [20, 50, 100, 250]
      : [1000, 2000, 5000, 10000];

  const handleClose = () => {
    setStep("details");
    setAdvanceAmount("");
    setAdvanceError("");
    setFormValues(null);
    form.reset();
    onClose();
  };

  async function onDetailsSubmit(values: BookingDetails) {
    setFormValues(values);
    setStep("payment-type");
  }

  // Redirects to PayGlocal secure checkout
  async function initiatePayGlocalPayment(payAmount: number) {
    if (!formValues) return;
    setLoading(true);
    try {
      const response = await fetch("/api/payments/payglocal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName,
          amount: payAmount,
          currency,
          customer_name: formValues.name,
          customer_email: formValues.email,
          customer_mobile: formValues.mobile,
          travelDate: formValues.travelDate,
          guests: formValues.guests,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.redirectUrl) {
        // Step 5 of PayGlocal guide: Browser redirects to PayGlocal's URL using GET method
        window.location.href = result.redirectUrl;
      } else {
        const errorMsg =
          result.error ||
          result.message ||
          "Payment initiation failed. Please verify your PayGlocal credentials or try again.";
        toast({
          title: "Payment Error",
          description: errorMsg,
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to the payment server.",
        variant: "destructive",
      });
      console.error("PayGlocal Connection Error:", error);
      setLoading(false);
    }
  }

  function handleAdvancePay() {
    const val = parseFloat(advanceAmount);
    if (!advanceAmount || isNaN(val) || val < minAdvanceAmount) {
      setAdvanceError(`Please enter a valid amount (minimum ${currencyConfig.symbol}${minAdvanceAmount}).`);
      return;
    }
    if (val > totalPackagePriceInCurrency) {
      setAdvanceError(`Amount cannot exceed the total amount of ${currencyConfig.symbol}${totalPackagePriceInCurrency.toLocaleString()}.`);
      return;
    }
    setAdvanceError("");
    initiatePayGlocalPayment(val);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[490px] max-h-[90vh] overflow-y-auto">
        {/* ── STEP 1: Traveler Details ── */}
        {step === "details" && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
                  <CalendarCheck className="h-6 w-6" /> Book Your Journey
                </DialogTitle>
                <CurrencySegmentedToggle />
              </div>
              <DialogDescription>
                You are booking: <strong>{packageName}</strong> at {formatAmount(perPersonPriceInCurrency)} / person
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4 pt-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" /> Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-muted-foreground" /> Mobile / WhatsApp
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Mobile with country code" {...field} />
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
                        <FormLabel className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="travelDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" /> Travel Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-muted-foreground" /> Travelers
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={50} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-secondary/60 p-3.5 rounded-lg flex items-start gap-2.5 mt-2">
                  <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Payments are encrypted &amp; processed securely via <strong>PayGlocal</strong> (Global &amp; Domestic Cards, UPI, NetBanking).
                  </p>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold">
                  Continue to Payment Options →
                </Button>
              </form>
            </Form>
          </>
        )}

        {/* ── STEP 2: Payment Option Choice ── */}
        {step === "payment-type" && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                  <CreditCard className="text-primary" /> Select Payment Mode
                </DialogTitle>
                <CurrencySegmentedToggle />
              </div>
              <DialogDescription>
                Booking for <strong>{packageName}</strong> ({formValues?.guests} traveler{formValues?.guests && formValues.guests > 1 ? "s" : ""})
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4 space-y-4">
              {/* Full Payment */}
              <button
                onClick={() => initiatePayGlocalPayment(totalPackagePriceInCurrency)}
                disabled={loading}
                className="w-full text-left rounded-xl border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 p-4 sm:p-5 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 group-hover:bg-primary/20 p-2.5 transition-colors font-bold text-lg text-primary min-w-[40px] text-center">
                    {currencyConfig.symbol}
                  </div>
                  <div>
                    <p className="font-semibold text-base">Full Payment</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Pay complete tour package amount in {currency}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-lg text-primary">
                      {formatAmount(totalPackagePriceInCurrency)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Instant confirmed voucher &amp; receipts</span>
                </div>
              </button>

              {/* Advance Booking Payment */}
              <button
                onClick={() => setStep("advance-amount")}
                disabled={loading}
                className="w-full text-left rounded-xl border-2 border-orange-300/50 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 p-4 sm:p-5 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 p-2.5 transition-colors">
                    <Wallet className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Advance Token Payment</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Pay a partial amount now to reserve
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-semibold text-orange-500">Custom</p>
                    <p className="text-xs text-muted-foreground">Min {currencyConfig.symbol}{minAdvanceAmount}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />
                  <span>Balance payable before trip departure</span>
                </div>
              </button>

              {loading && (
                <div className="p-4 bg-primary/10 rounded-lg flex items-center justify-center gap-3 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Redirecting to PayGlocal secure checkout...</span>
                </div>
              )}

              <button
                onClick={() => setStep("details")}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto pt-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Edit traveler details
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Enter Advance Amount ── */}
        {step === "advance-amount" && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                  <Wallet className="text-orange-500" /> Advance Booking Amount
                </DialogTitle>
                <CurrencySegmentedToggle />
              </div>
              <DialogDescription>
                Enter the amount you wish to pay now for <strong>{packageName}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="pt-3 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Total package cost ({formValues?.guests} traveler{formValues?.guests && formValues.guests > 1 ? "s" : ""})</span>
                <span className="font-bold">{formatAmount(totalPackagePriceInCurrency)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Advance Amount ({currencyConfig.symbol} {currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    {currencyConfig.symbol}
                  </span>
                  <Input
                    type="number"
                    min={minAdvanceAmount}
                    max={totalPackagePriceInCurrency}
                    placeholder={`e.g. ${Math.min(quickSelectValues[1] || 50, totalPackagePriceInCurrency)}`}
                    value={advanceAmount}
                    onChange={(e) => {
                      setAdvanceAmount(e.target.value);
                      setAdvanceError("");
                    }}
                    className="pl-8 h-12 text-lg font-medium"
                  />
                </div>
                {advanceError && (
                  <p className="text-sm text-destructive font-medium">{advanceError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum {currencyConfig.symbol}{minAdvanceAmount} · Maximum {formatAmount(totalPackagePriceInCurrency)}
                </p>
              </div>

              {/* Quick select buttons */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Quick select
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSelectValues
                    .filter((v) => v <= totalPackagePriceInCurrency)
                    .map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setAdvanceAmount(String(v));
                          setAdvanceError("");
                        }}
                        className="rounded-full border border-border px-3 py-1 text-xs sm:text-sm hover:bg-secondary font-medium transition-colors"
                      >
                        {currencyConfig.symbol}{v.toLocaleString()}
                      </button>
                    ))}
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  This advance payment secures your seat and dates. Remaining balance of{" "}
                  <strong>
                    {formatAmount(Math.max(
                      0,
                      totalPackagePriceInCurrency - (parseFloat(advanceAmount) || 0)
                    ))}
                  </strong>{" "}
                  is due prior to tour commencement.
                </p>
              </div>

              <Button
                onClick={handleAdvancePay}
                disabled={loading}
                className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting to PayGlocal...
                  </>
                ) : (
                  `Pay ${advanceAmount ? `${currencyConfig.symbol}${parseFloat(advanceAmount).toLocaleString()}` : "—"} via PayGlocal`
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

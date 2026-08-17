"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  MessageCircle,
  Download,
  Calendar,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"SUCCESS" | "FAILURE" | "PENDING">("PENDING");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get("status");
    const oid = searchParams.get("order_id");
    const tid = searchParams.get("tracking_id");
    const amt = searchParams.get("amount");
    const pkg = searchParams.get("package");
    const msg = searchParams.get("msg");

    setOrderId(oid);
    setTrackingId(tid);
    setAmount(amt);
    setPackageName(pkg);
    setErrorMessage(msg);

    if (s === "SUCCESS") {
      setStatus("SUCCESS");
    } else if (s === "FAILURE") {
      setStatus("FAILURE");
    } else {
      setStatus("PENDING");
    }
  }, [searchParams]);

  const whatsappMessage = encodeURIComponent(
    `Hello Nityholiday! My CCAvenue payment of ₹${amount || ""} for ${
      packageName || "Holiday Package"
    } was successful. (Order ID: ${orderId || ""}, Tracking ID: ${trackingId || ""}). Please share the confirmation voucher.`
  );

  return (
    <Card className="w-full max-w-lg border-2 shadow-2xl overflow-hidden rounded-2xl">
      <div
        className={`h-2.5 w-full ${
          status === "SUCCESS"
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : status === "FAILURE"
            ? "bg-gradient-to-r from-red-500 to-rose-600"
            : "bg-gradient-to-r from-primary to-orange-500"
        }`}
      />

      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3">
          {status === "SUCCESS" && (
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in-50">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          )}
          {status === "FAILURE" && (
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-in zoom-in-50">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
          )}
          {status === "PENDING" && (
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}
        </div>

        <CardTitle className="text-2xl sm:text-3xl font-headline">
          {status === "SUCCESS" && "Booking & Payment Confirmed!"}
          {status === "FAILURE" && "Payment Not Completed"}
          {status === "PENDING" && "Verifying Payment..."}
        </CardTitle>

        <CardDescription className="text-base pt-1">
          {status === "SUCCESS" &&
            "Thank you! Your payment was processed securely via CCAvenue."}
          {status === "FAILURE" &&
            (errorMessage ||
              "The transaction was declined or cancelled. If your account was debited, the amount will be automatically reversed.")}
          {status === "PENDING" &&
            "Please wait while we confirm your payment details with the bank."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {status === "SUCCESS" && (
          <div className="bg-secondary/60 rounded-xl p-5 border border-border/80 space-y-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-foreground pb-2 border-b border-border">
              <Receipt className="h-4 w-4 text-primary" />
              <span>Payment Receipt Details</span>
            </div>

            {packageName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package:</span>
                <span className="font-semibold text-right max-w-[240px] truncate">{packageName}</span>
              </div>
            )}

            {amount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-primary text-base">₹{parseFloat(amount).toLocaleString()}</span>
              </div>
            )}

            {orderId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-medium text-xs sm:text-sm">{orderId}</span>
              </div>
            )}

            {trackingId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">CCAvenue Ref / Tracking:</span>
                <span className="font-mono font-medium text-xs sm:text-sm">{trackingId}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 pt-2 text-xs text-green-600 font-medium">
              <ShieldCheck className="h-4 w-4 flex-shrink-0" />
              <span>Verified 100% Secure Transaction by CCAvenue</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {status === "SUCCESS" && (
            <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold">
              <a
                href={`https://wa.me/918460549415?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Confirm Itinerary on WhatsApp
              </a>
            </Button>
          )}

          <Button asChild variant={status === "SUCCESS" ? "outline" : "default"} className="w-full h-11">
            <Link href="/packages">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore All Packages
            </Link>
          </Button>

          {status === "FAILURE" && (
            <Button asChild variant="outline" className="w-full h-11">
              <Link href="/contact">
                Contact Customer Support
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentStatusPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 py-12">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading payment status...</p>
          </div>
        }
      >
        <PaymentStatusContent />
      </Suspense>
    </div>
  );
}

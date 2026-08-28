"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Building2,
  QrCode,
  ArrowRight,
  XCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

function PayGlocalSandboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = searchParams.get("amount") || "1000";
  const currency = (searchParams.get("currency") || "INR").toUpperCase();
  const merchantTxnId = searchParams.get("merchantTxnId") || `NH_${Date.now()}`;
  const gid = searchParams.get("gid") || `gl_${Math.random().toString(36).substring(2, 15)}`;
  const packageName = searchParams.get("packageName") || "Tour Package";
  const callbackUrl = searchParams.get("callbackUrl") || "/api/payments/payglocal/callback";

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  const currencySymbol = currency === "USD" ? "$" : "₹";

  const handleSimulatePayment = (status: "SUCCESS" | "FAILURE" | "CANCELLED") => {
    setLoading(true);

    // Create a form to simulate PayGlocal POST callback
    const form = document.createElement("form");
    form.method = "POST";
    form.action = callbackUrl;

    const addField = (name: string, val: string) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = val;
      form.appendChild(input);
    };

    if (status === "SUCCESS") {
      addField("status", "SENT_FOR_CAPTURE");
      addField("gid", gid);
      addField("merchantTxnId", merchantTxnId);
      addField("merchantUniqueId", merchantTxnId);
      addField("amount", amount);
      addField("currency", currency);
      addField("package", packageName);
      addField("message", "Transaction Processed Successfully");
    } else if (status === "CANCELLED") {
      addField("status", "CUSTOMER_CANCELLED");
      addField("gid", gid);
      addField("merchantTxnId", merchantTxnId);
      addField("message", "Payment was cancelled by the customer.");
    } else {
      addField("status", "ISSUER_DECLINE");
      addField("gid", gid);
      addField("merchantTxnId", merchantTxnId);
      addField("message", "Payment declined by issuing bank (Simulated Decline).");
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col items-center justify-center p-4 py-10">
      {/* Dev notification banner */}
      <div className="w-full max-w-lg mb-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block">PayGlocal Sandbox Mode</strong>
          <span>
            You are in local developer simulation mode because <code>PAYGLOCAL_PRIVATE_KEY</code> and <code>PAYGLOCAL_KEY_ID</code> are pending in <code>.env.local</code>. You can test complete payment flows below!
          </span>
        </div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-2 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                PG
              </div>
              <span className="font-bold text-lg tracking-tight">PayGlocal Checkout</span>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Lock className="h-3 w-3" /> 256-bit Encrypted
            </span>
          </div>

          <div className="flex justify-between items-end pt-2 border-t border-white/20">
            <div>
              <p className="text-xs text-primary-foreground/80">Paying to Nityholiday for:</p>
              <p className="font-semibold text-sm max-w-[240px] truncate">{packageName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-foreground/80">Total Amount</p>
              <p className="font-headline text-2xl font-bold">
                {currencySymbol}{parseFloat(amount).toLocaleString()} {currency}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Payment Method Tabs */}
          <Tabs defaultValue="card" className="w-full" onValueChange={setSelectedMethod}>
            <TabsList className="grid grid-cols-3 w-full h-11">
              <TabsTrigger value="card" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <CreditCard className="h-4 w-4" /> Card
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <QrCode className="h-4 w-4" /> UPI / QR
              </TabsTrigger>
              <TabsTrigger value="netbanking" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Building2 className="h-4 w-4" /> NetBanking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Card Number</label>
                <Input defaultValue="4111 •••• •••• 1111" readOnly className="font-mono text-sm bg-secondary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Expiry Date</label>
                  <Input defaultValue="12 / 28" readOnly className="font-mono text-sm bg-secondary/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">CVV</label>
                  <Input defaultValue="•••" readOnly className="font-mono text-sm bg-secondary/50" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upi" className="space-y-3 pt-4 text-center">
              <div className="p-6 bg-secondary/50 rounded-xl border flex flex-col items-center justify-center gap-2">
                <QrCode className="h-24 w-24 text-primary" />
                <p className="text-xs text-muted-foreground">Scan with Google Pay, PhonePe, Paytm, or BHIM UPI</p>
              </div>
            </TabsContent>

            <TabsContent value="netbanking" className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Citibank"].map((bank) => (
                  <div key={bank} className="p-3 border rounded-lg hover:border-primary cursor-pointer transition-colors bg-secondary/30 font-medium text-center">
                    {bank}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Simulation Buttons */}
          <div className="space-y-2.5 pt-2 border-t">
            <p className="text-xs text-center text-muted-foreground font-medium">
              Simulate Test Payment Action:
            </p>

            <Button
              onClick={() => handleSimulatePayment("SUCCESS")}
              disabled={loading}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base shadow-md transition-all"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              )}
              Complete Test Payment ({currencySymbol}{parseFloat(amount).toLocaleString()} {currency})
            </Button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => handleSimulatePayment("FAILURE")}
                disabled={loading}
                className="h-10 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Simulate Decline
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSimulatePayment("CANCELLED")}
                disabled={loading}
                className="h-10 text-xs text-muted-foreground"
              >
                Cancel &amp; Return
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>PayGlocal Global Payment Processing Gateway</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PayGlocalSandboxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      }
    >
      <PayGlocalSandboxContent />
    </Suspense>
  );
}

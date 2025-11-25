"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

// Tell Next.js this page is dynamic (no static prerender at build time)
export const dynamic = "force-dynamic";

function PaymentStatusContent() {
  const searchParams = useSearchParams();

  const status = searchParams?.get("status") || "";
  const rawReason = searchParams?.get("reason") || "";
  const txnId = searchParams?.get("txnId") || "";

  const isSuccess = useMemo(
    () => status.toUpperCase() === "SUCCESS",
    [status]
  );

  // Safely decode reason (avoid crashing if encoded weirdly)
  let reason = "";
  if (rawReason) {
    try {
      reason = decodeURIComponent(rawReason);
    } catch {
      reason = rawReason;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSuccess ? "Payment Successful 🎉" : "Payment Status"}
        </h1>

        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className={isSuccess ? "text-green-600" : "text-red-600"}>
              {status || "UNKNOWN"}
            </span>
          </p>

          {txnId && (
            <p>
              <span className="font-semibold">Transaction ID:</span> {txnId}
            </p>
          )}

          {reason && (
            <p>
              <span className="font-semibold">Reason:</span> {reason}</p>
          )}
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 w-full h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
            <h1 className="text-xl font-semibold mb-2">Loading payment status…</h1>
            <p className="text-sm text-slate-600">
              Please wait while we confirm your transaction.
            </p>
          </div>
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}

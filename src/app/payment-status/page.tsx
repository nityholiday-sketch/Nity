
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'SUCCESS' | 'FAILURE' | 'PENDING'>('PENDING');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get('status');
    const oid = searchParams.get('order_id');
    
    setOrderId(oid);
    if (s === 'SUCCESS') setStatus('SUCCESS');
    else if (s === 'FAILURE') setStatus('FAILURE');
    else setStatus('PENDING');
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === 'SUCCESS' && <CheckCircle className="h-16 w-16 text-green-500" />}
            {status === 'FAILURE' && <XCircle className="h-16 w-16 text-destructive" />}
            {status === 'PENDING' && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
          </div>
          <CardTitle className="text-2xl font-headline">
            {status === 'SUCCESS' && "Booking Successful!"}
            {status === 'FAILURE' && "Payment Failed"}
            {status === 'PENDING' && "Processing Payment..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            {status === 'SUCCESS' && "Your journey has been successfully booked. We've sent the details to your contact info."}
            {status === 'FAILURE' && "Unfortunately, the transaction could not be completed. Please try again or contact support."}
            {status === 'PENDING' && "We are waiting for confirmation from the bank. Please do not refresh the page."}
          </p>

          {orderId && (
            <div className="bg-secondary p-3 rounded text-sm font-mono">
              Order ID: {orderId}
            </div>
          )}

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

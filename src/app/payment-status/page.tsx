'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { Suspense } from 'react';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const txnId = searchParams.get('txnId');

  const renderStatus = () => {
    switch (status) {
      case 'SUCCESS':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful!',
          description: 'Thank you for your booking. Our team will contact you shortly to confirm the details.',
          color: 'text-green-500',
        };
      case 'ABORTED':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
          title: 'Payment Aborted',
          description: 'The payment process was cancelled. You can try booking again.',
           color: 'text-yellow-500',
        };
      case 'FAILED':
         return {
          icon: <XCircle className="h-16 w-16 text-destructive" />,
          title: 'Payment Failed',
          description: 'Unfortunately, your payment could not be processed. Please try again or use a different payment method.',
          color: 'text-destructive',
        };
      default:
        return {
          icon: <AlertTriangle className="h-16 w-16 text-muted-foreground" />,
          title: 'Unknown Status',
          description: 'An unexpected error occurred, or the payment status is unknown. Please contact support.',
           color: 'text-muted-foreground',
        };
    }
  };

  const { icon, title, description, color } = renderStatus();

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="items-center">
          {icon}
          <CardTitle className={`text-2xl font-bold ${color}`}>{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {txnId && (
            <div className="mb-6 rounded-md bg-secondary p-3 text-sm">
              <p className="text-muted-foreground">Your Transaction ID:</p>
              <p className="font-mono font-semibold">{txnId}</p>
            </div>
          )}
          <Button asChild>
            <Link href="/packages">Back to Packages</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div className="container mx-auto flex min-h-[60vh] items-center justify-center py-12">Loading payment status...</div>}>
            <PaymentStatusContent />
        </Suspense>
    )
}

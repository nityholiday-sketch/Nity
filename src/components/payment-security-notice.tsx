'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

export function PaymentSecurityNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open the modal automatically when the component mounts
    setIsOpen(true);
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Important Payment Security Notice
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-muted-foreground pt-2">
            Please do not attempt any fraudulent transactions. Note that all transaction amounts are non-refundable. For security purposes, please strictly use a Debit or Credit Card registered in your own name.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => setIsOpen(false)}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

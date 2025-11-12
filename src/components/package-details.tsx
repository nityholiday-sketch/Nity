
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Clock, Plane, Train, Bus, AlertCircle, CheckCircle, XCircle, CreditCard, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Package } from "@/lib/data";
import { initiatePaymentAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const transportIcons: { [key: string]: React.ReactNode } = {
  Flight: <Plane className="h-5 w-5" />,
  Train: <Train className="h-5 w-5" />,
  Bus: <Bus className="h-5 w-5" />,
  Heli: <AlertCircle className="h-5 w-5" />, // Placeholder for Helicopter
};

interface PackageDetailsClientProps {
  pkg: Package;
}

const PaymentFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "Must be a 10-digit mobile number." }),
  paymentOption: z.enum(["full", "custom"]),
  customAmount: z.string().optional(),
}).refine(data => {
    if (data.paymentOption === 'custom') {
        const amount = Number(data.customAmount);
        return !isNaN(amount) && amount > 0;
    }
    return true;
}, {
    message: "Please enter a valid custom amount.",
    path: ["customAmount"],
});

type VegaahPaymentData = {
    action: string;
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
}

export function PackageDetailsClient({ pkg }: PackageDetailsClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentData, setPaymentData] = useState<VegaahPaymentData | null>(null);

  const form = useForm<z.infer<typeof PaymentFormSchema>>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      paymentOption: "full",
      customAmount: ""
    }
  });

  const paymentOption = form.watch("paymentOption");
  const customAmount = form.watch("customAmount");

  const amountToPay = paymentOption === 'full' ? pkg.price : Number(customAmount);

  useEffect(() => {
    if (paymentData) {
      formRef.current?.submit();
    }
  }, [paymentData]);

  async function handlePayment(values: z.infer<typeof PaymentFormSchema>) {
    setIsProcessing(true);
    try {
      const result = await initiatePaymentAction({
        amount: values.paymentOption === 'full' ? pkg.price : Number(values.customAmount),
        name: values.name,
        email: values.email,
        phone: values.phone,
        productinfo: pkg.name
      });

      if (result.success && result.data) {
        setPaymentData(result.data as VegaahPaymentData);
      } else {
        toast({
          title: "Payment Error",
          description: "Could not initiate payment.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An Unexpected Error Occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }


  return (
    <>
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="relative mb-8 h-64 md:h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={pkg.image}
            alt={pkg.name}
            fill
            priority
            className="object-cover"
            data-ai-hint="travel landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-white">
              {pkg.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="font-headline text-2xl font-bold">About this tour</h2>
            <p className="mt-4 text-muted-foreground">{pkg.description}</p>

            <h2 className="font-headline text-2xl font-bold mt-8">Itinerary</h2>
            <Accordion type="single" collapsible className="w-full mt-4">
              {pkg.itinerary.map((item, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                   <AccordionTrigger>
                     <span className="font-semibold">Day {item.day}: {item.title}</span>
                   </AccordionTrigger>
                   <AccordionContent>
                     {item.description}
                   </AccordionContent>
                 </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-headline text-xl font-bold mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {pkg.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold mb-4">What's Excluded</h3>
                 <ul className="space-y-2">
                  {pkg.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Tour Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <span className="font-bold text-xl mr-1">₹</span>
                  <span className="font-bold text-xl">{pkg.price.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">/ person</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{pkg.duration}</span>
                </div>
                 <div className="flex items-start">
                  <div className="flex items-center">
                     <Plane className="h-5 w-5 mr-3 text-primary" />
                     <span>Transport:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-2">
                    {pkg.transport.map((t) => (
                      <span key={t} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        {transportIcons[t]} {t}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Book This Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                       <Button className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Proceed to Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Complete Your Booking</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="flex items-center gap-4 border-b pb-4 mb-4">
                           <Image src={pkg.image} alt={pkg.name} width={120} height={80} className="rounded-md object-cover" data-ai-hint="travel landscape"/>
                           <div>
                              <h3 className="font-semibold text-lg">{pkg.name}</h3>
                              <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                              <p className="font-bold text-lg mt-1">₹{pkg.price.toLocaleString()}</p>
                           </div>
                        </div>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField
                              control={form.control}
                              name="paymentOption"
                              render={({ field }) => (
                                <FormItem className="space-y-3 pt-4">
                                  <FormLabel>Payment Option</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="space-y-2"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="full" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Pay Full Amount: ₹{pkg.price.toLocaleString()}
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="custom" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Pay a Custom Amount
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {paymentOption === 'custom' && (
                              <FormField
                                control={form.control}
                                name="customAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Custom Amount</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter advance amount"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            <div className="mt-6">
                              <Button type="submit" className="w-full h-12 text-lg" disabled={isProcessing}>
                                 {isProcessing ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                                 {isProcessing ? 'Processing...' : `Pay Now: ₹${amountToPay > 0 ? amountToPay.toLocaleString() : ''}`}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                      Our team will contact you to confirm the booking after payment.
                  </p>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
    {paymentData && (
        <form ref={formRef} action={paymentData.action} method="POST" style={{ display: 'none' }}>
            {Object.entries(paymentData).map(([key, value]) =>
                <input type="hidden" name={key} value={value} key={key}/>
            )}
        </form>
    )}
    </>
  );
}


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
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Package } from "@/lib/data";
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
    phone: z.string().regex(/^[0-9]{10,15}$/, { message: "Must be a valid mobile number." }),
    street: z.string().min(5, { message: "Street address is required." }),
    city: z.string().min(2, { message: "City is required." }),
    state: z.string().min(2, { message: "State is required." }),
    postalCode: z.string().min(5, { message: "Postal code is required." }),
    country: z.string().length(2, { message: "Must be a 2-letter country code (e.g., IN)." }),
    paymentOption: z.enum(["full", "custom"]),
    customAmount: z.string().optional(),
}).refine(data => {
    if (data.paymentOption === 'custom') {
        const amount = parseFloat(data.customAmount || '0');
        return amount > 0;
    }
    return true;
}, {
    message: "Please enter a valid custom amount.",
    path: ["customAmount"],
});


export function PackageDetailsClient({ pkg }: PackageDetailsClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof PaymentFormSchema>>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "IN",
      paymentOption: "full",
      customAmount: "0",
    }
  });

  const paymentOption = form.watch("paymentOption");

  async function handlePayment(values: z.infer<typeof PaymentFormSchema>) {
    setIsProcessing(true);
    setError(null);

    const amount = values.paymentOption === 'full' ? pkg.price : parseFloat(values.customAmount || '0');
    const orderId = `NITY_${Date.now()}`;

    try {
        const paymentData = {
            orderId: orderId,
            amount: amount,
            currency: 'SAR',
            customerName: values.name,
            customerEmail: values.email,
            customerMobile: values.phone,
            packageName: pkg.name,
            billingAddress: {
                street: values.street,
                city: values.city,
                state: values.state,
                postalCode: values.postalCode,
                country: values.country
            }
        };

        console.log('Initiating payment with data:', paymentData);
        
        const response = await fetch('/api/payments/vegaah', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        console.log('API Response status:', response.status);

        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error('Failed to parse API response:', parseError);
          throw new Error('Invalid response from server');
        }

        console.log('API Response data:', result);

        if (!result) {
          throw new Error('No response received from payment gateway');
        }

        if (!result.success) {
            throw new Error(result.error || 'Payment initiation failed');
        }

        if (result.paymentLink) {
            console.log('Redirecting to payment link:', result.paymentLink);
            window.location.href = result.paymentLink;
        } else {
            throw new Error('Payment link not received from gateway');
        }

    } catch (error: any) {
        console.error('Payment Error:', error);
        setError(error.message || 'Failed to initiate payment. Please try again.');
        setIsProcessing(false);
    }
  }

  const getAmountToPay = () => {
    const option = form.getValues("paymentOption");
    if (option === 'full') {
        return pkg.price;
    }
    const customAmount = parseFloat(form.getValues("customAmount") || '0');
    return customAmount > 0 ? customAmount : 0;
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
                  <Dialog onOpenChange={() => setError(null)}>
                    <DialogTrigger asChild>
                       <Button className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Proceed to Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Complete Your Booking</DialogTitle>
                         <DialogDescription>
                            Enter your details and payment information to finalize your booking. Our team will contact you to confirm the booking after payment.
                        </DialogDescription>
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

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
                                    <p className="mt-1 text-sm text-red-700">{error}</p>
                                </div>
                                </div>
                            </div>
                        )}

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                )}/>
                            </div>
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            <h4 className="text-sm font-medium pt-2">Billing Address</h4>
                            <FormField control={form.control} name="street" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street</FormLabel>
                                    <FormControl><Input placeholder="King Fahd Road" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="city" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl><Input placeholder="Riyadh" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="state" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl><Input placeholder="Riyadh" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="postalCode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="country" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country Code</FormLabel>
                                        <FormControl><Input placeholder="IN" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

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
                                 {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                      Processing...
                                    </span>
                                  ) : (
                                    `Pay Now: ₹${getAmountToPay() > 0 ? getAmountToPay().toLocaleString() : ''}`
                                  )}
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
    
    </>
  );
}

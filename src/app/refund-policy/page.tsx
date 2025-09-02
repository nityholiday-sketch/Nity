import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Read the Refund & Cancellation Policy of NityHoliday Adventures.",
};

export default function RefundPolicyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1 className="font-headline">Refund & Cancellation Policy</h1>
          <p><em>Last updated: August 27, 2025</em></p>

          <h2 className="font-headline">Booking and Payments</h2>
          <p>
            All bookings made through the NityHoliday platform are considered final upon confirmation of payment. By completing a transaction, you acknowledge and agree to the terms outlined in this policy.
          </p>

          <h2 className="font-headline">Cancellation Policy</h2>
          <p>
            <strong>There is no cancellation option available for any bookings.</strong> Once a tour package or any related service is booked and payment is made, it cannot be cancelled by the user under any circumstances. We advise all customers to be certain of their travel plans before making a booking.
          </p>
          
          <h2 className="font-headline">Refund Policy</h2>
          <p>
            <strong>All payments made are strictly non-refundable.</strong> We do not provide refunds for any bookings, regardless of the reason for cancellation or non-utilization of services. This includes, but is not limited to, cancellations due to personal reasons, medical emergencies, flight cancellations, or any other unforeseen events.
          </p>
          <p>
            Payments are also non-transferable to other individuals or other tour packages.
          </p>
          
          <h2 className="font-headline">Contact Us</h2>
          <p>
            If you have any questions about this policy before making a booking, please feel free to contact us through the details provided on our <a href="/contact">Contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

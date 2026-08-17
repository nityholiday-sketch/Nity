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
          <h1 className="font-headline">Refund &amp; Cancellation Policy</h1>
          <p><em>Last updated: August 27, 2025</em></p>

          <h2 className="font-headline">Tour Bookings &amp; Confirmations</h2>
          <p>
            All tour package bookings made with NITYTRAVELTODREAM LLP are confirmed after direct consultation and alignment with our travel planning team. By confirming your booking inquiry and itinerary, you acknowledge and agree to the terms outlined in this policy.
          </p>

          <h2 className="font-headline">Cancellation Policy</h2>
          <p>
            Once a tour package or travel service is confirmed and scheduled, arrangements with hotels, transport providers, and guides are made in advance. As such, cancellations are subject to the specific supplier and operational terms agreed upon during reservation. We advise all travelers to be certain of their travel dates and preferences before confirming.
          </p>
          
          <h2 className="font-headline">Refund Policy</h2>
          <p>
            Confirmed reservations are strictly non-refundable and non-transferable unless explicitly specified in writing by our management due to extraordinary operational circumstances. We do not provide refunds for personal cancellations, missed connections, or non-utilization of scheduled services.
          </p>
          
          <h2 className="font-headline">Contact Us</h2>
          <p>
            If you have questions regarding customized package terms or cancellation policies, please feel free to reach out directly via our <a href="/contact">Contact page</a> or via WhatsApp/Phone at +918460549415.
          </p>
        </div>
      </div>
    </div>
  );
}

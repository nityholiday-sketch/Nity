import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for NityHoliday Adventures.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1 className="font-headline">Terms of Service</h1>
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the NityHoliday Adventures website (the "Service") operated by NityHoliday Adventures ("us", "we", or "our").
          </p>
          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2 className="font-headline">1. Bookings and Payments</h2>
          <p>
            All bookings are subject to availability. Prices are subject to change without prior notice. A deposit is required to confirm your booking, with the full balance due before the date of travel as specified.
          </p>

          <h2 className="font-headline">2. Cancellations and Refunds</h2>
          <p>
            Cancellation policies vary depending on the package booked. Please refer to the specific cancellation terms provided at the time of booking. We reserve the right to cancel tours due to unforeseen circumstances, in which case a full refund will be provided.
          </p>
          
          <h2 className="font-headline">3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of NityHoliday Adventures and its licensors.
          </p>

          <h2 className="font-headline">4. Limitation of Liability</h2>
          <p>
            In no event shall NityHoliday Adventures, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          
          <h2 className="font-headline">5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of our jurisdiction, without regard to its conflict of law provisions.
          </p>

          <h2 className="font-headline">Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className="font-headline">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}

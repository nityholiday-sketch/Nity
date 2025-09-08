import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Policies",
  description: "Read the Terms and Policies for NityHoliday Adventures.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1 className="font-headline">Terms & Policies</h1>
          <p><em>Last updated: August 27, 2025</em></p>

          <h2 className="font-headline">Terms of Use</h2>
          
          <h3>1. Introduction</h3>
          <p>
            This document is an electronic record in accordance with the Information Technology Act, 2000 and the rules made thereunder. It does not require any physical or digital signature.
          </p>
          <p>
            Published as per Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011, this document outlines the Terms of Use, Privacy Policy, and other applicable rules for the usage of our website: <a href="https://nityholiday.com">https://nityholiday.com</a> (hereinafter referred to as the "Platform"), including its mobile site and mobile app.
          </p>
          <p>
            The Platform is owned and operated by NITYTRAVELTODREAM LLP, a company incorporated under the Companies Act, 1956 and having its registered office at: Ajmeri Gate Extension, AGC R, Ansari Road - 110002.
          </p>

          <h3>2. General Terms of Use</h3>
          <p>
            By accessing, browsing, or using the Platform, you agree to be bound by the following terms and conditions:
          </p>
          <ul>
            <li>You must provide accurate and complete information during registration and are responsible for all activities under your account.</li>
            <li>The Platform content, including design and graphics, is proprietary. You may not claim rights over it.</li>
            <li>We do not guarantee the accuracy, completeness, or timeliness of content or services. Usage is at your own risk.</li>
            <li>Any unauthorized use of the Platform may lead to legal action.</li>
            <li>You agree to pay applicable service charges, where applicable.</li>
            <li>Do not use the Platform or its Services for unlawful or unauthorized purposes.</li>
            <li>Links to third-party websites are provided for convenience. We are not responsible for their content or policies.</li>
            <li>You acknowledge that initiating a transaction constitutes a binding contract with the Platform Owner.</li>
          </ul>

          <h3>3. Prohibited Use</h3>
          <p>
            You agree not to use the Platform for any of the following prohibited activities:
          </p>
          <ul>
            <li>Engaging in or promoting any form of gaming, gambling, or betting.</li>
            <li>Selling or distributing vouchers, gift cards, or any form of stored value.</li>
            <li>Providing or facilitating utility bill payments, Direct-to-Home (DTH) recharges, or Direct Money Transfer (DMT) services.</li>
            <li>Operating as a travel aggregator or using third-party APIs for flight, bus, or train bookings. Our services are limited to the packages we curate and provide directly.</li>
            <li>Any other activity that is illegal, fraudulent, or violates these Terms of Service.</li>
          </ul>


          <h3>4. Limitation of Liability</h3>
          <p>We are not liable for:</p>
          <ul>
            <li>Inaccuracies or errors in content</li>
            <li>Failure to meet your expectations</li>
            <li>Service disruptions or delays beyond our control</li>
          </ul>

          <h3>5. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless NITYTRAVELTODREAM LLP and its affiliates from any losses, claims, or legal costs arising from:
          </p>
          <ul>
            <li>Your use of the Platform</li>
            <li>Violation of these Terms</li>
            <li>Infringement of third-party rights</li>
          </ul>

          <h3>6. Force Majeure</h3>
          <p>
            Neither party shall be held liable for failure to fulfill obligations due to unforeseen events such as natural disasters, legal restrictions, or other force majeure conditions.
          </p>

          <h3>7. Governing Law & Jurisdiction</h3>
          <ul>
            <li>These Terms are governed by the laws of India.</li>
            <li>All disputes shall fall under the exclusive jurisdiction of the courts in Bhinmal, Rajasthan.</li>
          </ul>

          <h3>8. Contact Information</h3>
          <p>
            For queries or concerns related to these Terms, please reach out via email at <a href="mailto:nity.holiday@gmail.com">nity.holiday@gmail.com</a> or through the other contact details provided on our website.
          </p>
          
          <h2 className="font-headline mt-8">Refund & Cancellation Policy</h2>
          <p>
            There is no cancellation and no refund provided for any bookings. All payments made are final.
          </p>
        </div>
      </div>
    </div>
  );
}

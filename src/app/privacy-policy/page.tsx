import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of NityHoliday Adventures.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1 className="font-headline">Privacy Policy</h1>
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <p>
            NityHoliday Adventures ("us", "we", or "our") operates the NityHoliday Adventures website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <h2 className="font-headline">Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>

          <h3 className="font-headline">Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally, identifiable information may include, but is not limited to:
          </p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Usage Data</li>
          </ul>

          <h2 className="font-headline">Use of Data</h2>
          <p>NityHoliday Adventures uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information</li>
          </ul>

          <h2 className="font-headline">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us by visiting the contact page on our website.</p>
        </div>
      </div>
    </div>
  );
}

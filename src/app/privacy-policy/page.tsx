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
          <p><em>Effective Date: August 27, 2025</em></p>

          <p>
            This Privacy Policy outlines how NITYTRAVELTODREAM LLP and its affiliates ("we", "us", "our") collect, use, disclose, and protect your personal information through our website: https://nityholiday.com/ (hereinafter referred to as the "Platform").
          </p>
          <p>
            By accessing or using the Platform, you agree to be bound by this Privacy Policy, our Terms of Use, and all applicable laws governing privacy and data protection in India. If you do not agree, please do not use or access the Platform.
          </p>

          <h2 className="font-headline">1. Introduction</h2>
          <p>
            This Privacy Policy applies to all users of the Platform in India. We do not offer services outside India. You may browse some sections of the Platform without registering. Your personal data will be stored and processed in India. By using the Platform, you consent to data processing as per this policy.
          </p>

          <h2 className="font-headline">2. Data Collection</h2>
          <p>
            We collect your personal and sensitive data when you interact with our Platform, services, or third-party partners. This includes:
          </p>
          <h3>Personal Information:</h3>
          <ul>
            <li>Full Name</li>
            <li>Date of Birth</li>
            <li>Address</li>
            <li>Contact Numbers</li>
            <li>Email ID</li>
            <li>Identity/Address Proof (when required)</li>
          </ul>
          <h3>Sensitive Personal Information (with consent):</h3>
          <ul>
            <li>Bank account details, credit/debit card information</li>
            <li>Biometric data (e.g., facial features, physiological traits)</li>
            <li>Payment information</li>
          </ul>
          <h3>Other Information:</h3>
          <ul>
            <li>Transaction data</li>
            <li>Behavioral data (clicks, preferences, usage patterns)</li>
            <li>Data shared during customer support interactions</li>
            <li>Data collected through third-party platforms</li>
          </ul>
          <p>
            <strong>⚠️ If you receive fraudulent communication asking for sensitive data (PIN, passwords), do not respond. Report to relevant law enforcement immediately.</strong>
          </p>

          <h2 className="font-headline">3. Usage of Collected Information</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Deliver requested services and process transactions</li>
            <li>Improve customer experience and personalize services</li>
            <li>Resolve disputes, troubleshoot, and enforce policies</li>
            <li>Inform you of offers, updates, or service changes</li>
            <li>Conduct research and internal analysis</li>
            <li>Prevent fraud and monitor compliance</li>
          </ul>
          <p>You may choose to opt-out of promotional communications.</p>

          <h2 className="font-headline">4. Booking, Payment, and Cancellation Policy</h2>
          <p>
            All bookings made through the Platform are final. By completing a transaction, you agree to the following terms:
          </p>
          <ul>
            <li><strong>No Cancellation:</strong> Once a booking is confirmed, it cannot be cancelled.</li>
            <li><strong>No Refund:</strong> We do not provide refunds for any bookings under any circumstances.</li>
            <li><strong>Final Payments:</strong> All payments made are non-refundable and non-transferable.</li>
          </ul>

          <h2 className="font-headline">5. Data Sharing & Disclosure</h2>
          <p>
            We may share your data with our affiliates, business partners, or legal authorities for the following purposes:
          </p>
          <ul>
            <li>To provide and improve our services</li>
            <li>To comply with our legal obligations</li>
            <li>To investigate and prevent fraudulent or illegal activities</li>
            <li>For marketing and promotional purposes, from which you can opt-out</li>
          </ul>

          <h2 className="font-headline">6. Security Measures</h2>
          <p>
            We adopt reasonable security practices to protect your data from unauthorized access, loss, misuse, or alteration. Data is transmitted via secure servers. However, transmission over the internet can never be completely secure. Users are advised to:
          </p>
          <ul>
            <li>Maintain confidentiality of login credentials</li>
            <li>Regularly update passwords</li>
          </ul>

          <h2 className="font-headline">7. Data Retention & Deletion</h2>
          <p>
            You may delete your account from your profile settings or by contacting us. We may retain data if:
          </p>
          <ul>
            <li>There are pending services or disputes</li>
            <li>Required for legal, fraud prevention, or legitimate purposes</li>
            <li>Deleted accounts result in loss of all user data</li>
          </ul>
          <p>Anonymized data may be retained for analysis and research</p>

          <h2 className="font-headline">8. User Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Rectify any inaccuracies</li>
            <li>Request deletion of your account and data</li>
          </ul>

          <h2 className="font-headline">9. Consent</h2>
          <p>
            By using our Platform or providing your data:
          </p>
          <ul>
            <li>You consent to data processing as described in this policy</li>
            <li>You confirm you have the authority to provide data for others (if applicable)</li>
            <li>You consent to being contacted via SMS, email, or call for service-related communication</li>
          </ul>
          <h3>Withdrawal of Consent:</h3>
          <p>To withdraw consent, contact our Grievance Officer (details below) with the subject: “Withdrawal of consent for processing personal data”</p>
          <p>
            <strong>⚠️ Withdrawal of consent may result in limited or no access to some services.</strong>
          </p>
          
          <h2 className="font-headline">10. Changes to the Privacy Policy</h2>
          <p>
            We may periodically update this Privacy Policy to reflect changes in practices, laws, or services. Please check this page regularly for updates. If required by law, we will notify you of significant changes.
          </p>

          <h2 className="font-headline">11. Grievance Redressal</h2>
          <p>
            If you have any questions, complaints, or requests related to your personal data or this Privacy Policy, please contact:
          </p>
          <p>
            <strong>Grievance Officer</strong><br/>
            Name: Bhupesh Bohara<br/>
            Designation: CEO<br/>
            Company: NITYTRAVELTODREAM LLP<br/>
            Address: Nitytravletodream llp 34 opp bank of baroda BHINMAL<br/>
            Contact Number: +91 9785798008<br/>
            Timings: Monday to Friday (9:00 AM – 6:00 PM)<br/>
            Email ID: info@nityholiday.com
          </p>
        </div>
      </div>
    </div>
  );
}

    
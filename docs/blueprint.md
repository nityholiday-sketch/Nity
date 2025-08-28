# **App Name**: NityHoliday Adventures

## Core Features:

- Hero Banner: Display a Hero Banner with a captivating title, subtitle, and prominent call-to-action buttons that direct users to explore tour packages or inquire about services.
- Why Choose Us Section: Present a 'Why Choose Us' section highlighting key differentiators with concise descriptions and icons, emphasizing verification, personalization, and competitive pricing.
- Featured Packages Display: Showcase top tour packages in an engaging format, displaying images, titles, brief descriptions, prices, and direct CTAs for inquiry or further exploration.
- Contact and Support: Provide a comprehensive contact page with a submission form and a floating WhatsApp chat button for seamless inquiries and communication, plus an embedded Google Maps.
- Internal Pages & Routes: Implement internal pages with working routes: Homepage (/), Tour Packages (/packages), About Us (/about), Contact (/contact), Privacy Policy (/privacy-policy), Terms of Service (/terms-of-service).
- Newsletter: Incorporate a newsletter subscription form, ensuring a simple user experience, and clearly stating that entered emails will be stored for communications.
- AI Travel Tips: Implement a generative AI tool that curates personalized travel tips, tailoring recommendations based on the selected tour package.
- SEO Optimization: Add meta tags (title, description, OG tags for social sharing). Auto-generate sitemap.xml and robots.txt. Each package page should have unique SEO-friendly titles
- Performance: Compress & lazy-load images (especially package images). Add a CDN (Firebase Hosting supports this automatically).
- Scalability: Instead of hardcoding only 6 packages, make Firestore support unlimited. Add a “Featured = true/false” field in Firestore so only selected packages show on homepage.
- UI/UX Enhancements: Add a search bar in /packages to filter by name/price/duration. Add filters (Duration, Price Range, Transport Type: Train/Flight/Heli/Bus). Add customer testimonials section on homepage.
- Booking Flow: Customer selects package → fills details → stored in Firestore → you confirm manually.
- Newsletter Improvements: Suggest storing name + email (better for future email marketing).
- Admin Dashboard: Simple Firebase Auth + Admin Page → Add/Edit/Delete packages without touching Firestore directly.

## Style Guidelines:

- Primary color: Dark Green (#013220) to convey a sense of nature, trustworthiness, and sophistication, in alignment with NityHoliday's brand. It evokes feelings of exploration and relaxation.
- Background color: Very light green (#E0EEDE), almost white, which maintains the visual connection to nature through its close hue to the primary color. It allows the content to take center stage by being unobtrusive and providing high readability via good contrast.
- Accent color: White (#FFFFFF) is strategically used to create visual contrast, ensure the site does not have an oppressive or monotonous appearance, and keep readability and legibility as high as possible.
- Font pairing: 'Poppins' (sans-serif) for headlines and 'PT Sans' (sans-serif) for body text, for a balance of modern clarity and readability.
- Utilize a consistent style of outlined icons, with a touch of orange to enhance visual appeal. The goal is a modern, easily recognizable iconography.
- Employ a grid-based layout to maintain consistency and responsiveness across devices.
- Implement subtle transitions and animations on interactive elements, like button hovers and content loading, to provide gentle feedback to user interactions and enhance the user experience. The animations should not be distracting or overly complex.
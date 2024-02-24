import React from "react";

export default function Page() {
  const lastUpdated = new Date(2024, 1, 24);

  return (
    <main className="min-h-full dark:bg-slate-900">
      <article className="prose dark:prose-invert mx-auto py-8">
        <h1>Terms & Conditions for Discjakt</h1>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Discjakt. By using our website and submitting your email,
          you agree to these Terms & Conditions and our Privacy Policy.
        </p>
        <h2>2. Services Offered</h2>
        <p>
          Discjakt provides a comprehensive database for Disc Golf discs,
          including price comparisons from various e-commerce stores in Norway,
          and tools for enthusiasts such as pro-bags, bag-builder, and disc
          comparison.
        </p>
        <h2>3. Personal Data Collection</h2>
        <p>
          We collect your email address only for the purpose of sending
          notifications about the launch of our app.
        </p>
        <h2>4. Use of Personal Data</h2>
        <p>
          Your email will be used exclusively for app launch notifications. All
          emails will be deleted 30 days post-launch.
        </p>
        <h2>5. Data Sharing</h2>
        <p>We do not share your personal data with any third parties.</p>
        <h2>6. Consent</h2>
        <p>
          By entering and submitting your email on our website, you consent to
          receive email notifications regarding the launch of our app.
        </p>
        <h2>7. User Rights</h2>
        <p>
          If you wish to exercise your right to access, correct, or delete your
          data, please contact us at{" "}
          <a href="mailto:post@discjakt.no">post@discjakt.no</a>.
        </p>
        <h2>8. Data Protection</h2>
        <p>
          Your personal data is stored securely in a database within the
          European Union and is not accessible by the public.
        </p>
        <h2>9. International Data Transfers</h2>
        <p>
          Your data is stored on AWS databases located in the European Union and
          is managed in accordance with GDPR regulations.
        </p>
        <h2>10. Cookies Policy</h2>
        <p>Our website does not use cookies at this time.</p>
        <h2>11. Amendments</h2>
        <p>
          We reserve the right to modify these terms. We will notify users of
          any changes by updating the date at the top of this policy.
        </p>
        <h2>12. Governing Law</h2>
        <p>These terms are governed by Norwegian law.</p>
        <h2>13. Contact Us</h2>
        <p>
          For any questions regarding these terms, please contact us at{" "}
          <a href="mailto:post@discjakt.no">post@discjakt.no</a>.
        </p>
      </article>
    </main>
  );
}


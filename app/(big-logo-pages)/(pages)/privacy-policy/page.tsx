import { Bebas_Neue } from 'next/font/google';

const displayFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function PrivacyPolicy() {
  return (
    <>
      <p className={`font-bold text-4xl text-inherit ${displayFont.className} text-zinc-800`}>
        Privacy policy
      </p>
      <p className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
        Last updated: 2024-09-19
      </p>
      <p>
        At FetchBook, your privacy is important to us. This Privacy Policy outlines what data we
        collect and how we handle it.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          1. Cookies and Data Collection
        </div>
        We only use cookies to support the login functionality of our website via next-auth. These
        cookies are essential to keeping you logged in during your session and expire once you log
        out or after a set period of inactivity. We do not use any other cookies, tracking tools, or
        collect any additional data about your activity on the site.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          2. Data You Provide
        </div>
        To use FetchBook, you may provide certain personal data, such as your email address, when
        registering an account. This information is strictly used to manage your account and allow
        you to log in securely. We do not share, sell, or use your data for any other purpose.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          3. External Links
        </div>
        When adding decks or other content, you may include links to external websites (such as
        Moxfield or MTGGoldfish). FetchBook is not responsible for the privacy practices of these
        third-party sites. We recommend reviewing their privacy policies separately.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          4. Security
        </div>
        We take reasonable measures to protect your personal information, ensuring it remains
        confidential and secure. However, please be aware that no method of transmitting or storing
        data is completely secure, and we cannot guarantee absolute security.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          5. Changes to This Policy
        </div>
        We may update this Privacy Policy from time to time. Any changes will be posted here, with
        the updated date at the top. We encourage you to review this page periodically.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          6. Contact Us
        </div>
        If you have any questions about this Privacy Policy, feel free to reach out to us at
        [info@fetchbook.net]
      </p>
    </>
  );
}

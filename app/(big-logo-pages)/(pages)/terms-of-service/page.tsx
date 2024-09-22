import { Bebas_Neue } from 'next/font/google';

const displayFont = Bebas_Neue({
  weight: '400',
});

export default function TermsOfService() {
  return (
    <>
      <p className={`font-bold text-4xl text-inherit ${displayFont.className} text-zinc-800`}>
        Terms of Service
      </p>
      <p className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
        Last updated: 2024-09-19
      </p>
      <p>
        Welcome to FetchBook! By using our website, you agree to the following terms. Please read
        them carefully before using our services.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          1. Acceptance of Terms
        </div>
        By accessing or using FetchBook, you agree to comply with these Terms of Service. If you do
        not agree with any part of these terms, you may not use the service.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          2. User Responsibilities
        </div>
        When using FetchBook, you agree to:
        <ul className="list-disc ml-6">
          <li>Provide accurate information when creating decks, events, and matches.</li>
          <li>Avoid uploading or linking to harmful, misleading, or inappropriate content.</li>
          <li>Refrain from using FetchBook for any illegal or unauthorized purposes.</li>
        </ul>
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          3. Content Ownership
        </div>
        You retain ownership of any content (such as deck names, event details, etc.) that you
        submit to FetchBook. By submitting content, you grant FetchBook a non-exclusive,
        royalty-free, worldwide license to display your content within the platform for the purpose
        of providing the service.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          4. Third-Party Links
        </div>
        FetchBook allows you to include links to third-party websites (e.g., MTGGoldfish, Moxfield).
        We do not control or endorse these external sites and are not responsible for their content,
        privacy policies, or practices. Use of third-party sites is at your own risk.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          5. Prohibited Conduct
        </div>
        You agree not to:
        <ul className="list-disc ml-6">
          <li>Disrupt or interfere with the functioning of FetchBook.</li>
          <li>Attempt to gain unauthorized access to any part of the site.</li>
          <li>Use the service to harass or harm others.</li>
        </ul>
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          6. Service Modifications and Termination
        </div>
        We reserve the right to modify or discontinue any aspect of FetchBook at any time without
        prior notice. We may also suspend or terminate your account if you violate these terms.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          7. Limitation of Liability
        </div>
        FetchBook is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We make no
        warranties, either express or implied, regarding the service’s functionality or
        availability. To the fullest extent permitted by law, we are not liable for any damages
        resulting from your use of FetchBook.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          8. Changes to Terms
        </div>
        We may revise these Terms of Service from time to time. Any changes will be posted here,
        with the updated date at the top. Your continued use of the service after changes are posted
        signifies your acceptance of the new terms.
      </p>
      <p>
        <div className={`font-bold text-xl text-inherit ${displayFont.className} text-zinc-800`}>
          9. Contact Us
        </div>
        If you have any questions about these Terms of Service, feel free to reach out to us at
        [info@fetchbook.net]
      </p>
    </>
  );
}

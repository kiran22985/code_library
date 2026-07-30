import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What data CodeLibrary collects, why, and how to remove it. Covers accounts, cookies and advertising.",
};

/**
 * Required by Google AdSense: a site running ads must disclose cookie and data
 * use. The content below describes what this application genuinely does — if
 * you add analytics, email, or another ad network, update it to match.
 *
 * Replace CONTACT_EMAIL with a real address before publishing.
 */
const CONTACT_EMAIL = "hello@codelibrary.com.np";
const LAST_UPDATED = "30 July 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-16 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="mt-10 space-y-8">
        <Section title="The short version">
          <p>
            CodeLibrary is a free tutorial site. You can read every lesson
            without an account and without giving us anything. If you choose to
            create an account, we store a username, a hashed password and the
            lessons you have marked complete — nothing else. We show ads from
            Google, which use cookies.
          </p>
        </Section>

        <Section title="What we collect">
          <h3 className="mt-4 font-medium text-fg">If you do not sign up</h3>
          <p>
            Nothing is stored on our servers. Your theme preference and lesson
            progress are kept in your browser&rsquo;s local storage, on your
            device only.
          </p>

          <h3 className="mt-5 font-medium text-fg">If you create an account</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-fg">Username</strong> — chosen by you. It
              does not have to identify you, and we never ask for your real
              name.
            </li>
            <li>
              <strong className="text-fg">Password</strong> — stored only as a
              scrypt hash. We cannot read it, recover it, or tell you what it
              is.
            </li>
            <li>
              <strong className="text-fg">Lesson progress</strong> — which
              lessons you marked complete, and when.
            </li>
            <li>
              <strong className="text-fg">Session records</strong> — a hashed
              token and its expiry, so you stay signed in.
            </li>
          </ul>
          <p className="mt-3">
            We do not ask for an email address, and we do not collect names,
            phone numbers, addresses or payment details.
          </p>
        </Section>

        <Section title="Cookies">
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-fg">Session cookie</strong> (
              <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">
                codelibrary_session
              </code>
              ) — set only when you sign in, so the site knows it is you. It is
              essential; without it accounts cannot work. Removing it signs you
              out.
            </li>
            <li>
              <strong className="text-fg">Advertising cookies</strong> — set by
              Google, described below.
            </li>
          </ul>
          <p className="mt-3">
            We use no analytics or tracking cookies of our own.
          </p>
        </Section>

        <Section title="Advertising">
          <p>
            This site displays ads served by Google AdSense. Google and its
            partners use cookies and similar technologies to serve ads based on
            your prior visits to this and other websites.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              Google&rsquo;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visit to this and other
              sites.
            </li>
            <li>
              You can opt out of personalised advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent underline underline-offset-4"
              >
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              You can opt out of some third-party vendors&rsquo; use of cookies
              at{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent underline underline-offset-4"
              >
                aboutads.info/choices
              </a>
              .
            </li>
            <li>
              More detail is in{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent underline underline-offset-4"
              >
                Google&rsquo;s privacy &amp; terms
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="Who else sees your data">
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-fg">Render</strong> hosts the site and its
              database, and processes server logs including IP addresses.
            </li>
            <li>
              <strong className="text-fg">Google</strong> serves the ads
              described above.
            </li>
          </ul>
          <p className="mt-3">
            We do not sell your data, and we do not share it with anyone else.
          </p>
        </Section>

        <Section title="Keeping data secure">
          <p>
            Passwords are hashed with scrypt and never stored in readable form.
            Session tokens are stored only as hashes, so even a database leak
            would not hand over working sessions. All traffic is served over
            HTTPS, and the session cookie is marked{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">
              HttpOnly
            </code>{" "}
            so it cannot be read by JavaScript.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Read every lesson without an account.</li>
            <li>Clear your browser storage to erase local progress.</li>
            <li>Sign out to revoke your session immediately.</li>
            <li>
              Ask us to delete your account and all associated data by emailing{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              . Deletion removes your account, sessions and progress permanently.
            </li>
          </ul>
        </Section>

        <Section title="Children">
          <p>
            This site is not directed at children under 13, and we do not
            knowingly collect data from them.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes we will update the date at the top of this
            page.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or your data:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </div>

      <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
        Back to the{" "}
        <Link href="/" className="text-accent underline underline-offset-4">
          homepage
        </Link>{" "}
        or the{" "}
        <Link href="/python" className="text-accent underline underline-offset-4">
          Python course
        </Link>
        .
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-fg-soft">
        {children}
      </div>
    </section>
  );
}

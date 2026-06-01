import { COMPANY } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the ${COMPANY.name} privacy policy. Learn how we collect, use, and protect your personal data.`,
};

const PrivacyPolicy = () => {
  return (
    <div>
      <section className="pt-36 md:pt-44 pb-12 md:pb-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p
            className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold"
            style={{ animationDelay: "0s" }}
          >
            Legal
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Privacy Policy
          </h1>

          <div
            className="hero-animate mt-8 space-y-8 text-foreground/70 text-sm lg:text-base leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            <p>
              {COMPANY.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, and safeguard your
              personal information when you visit our website at {COMPANY.url} or
              use our services.
            </p>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Information We Collect
              </h2>
              <p className="mb-3">
                We may collect the following personal information:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Your name, email address, phone number, and business name when
                  you submit an enquiry form
                </li>
                <li>
                  Your IP address, browser type, and device information when you
                  visit our website
                </li>
                <li>
                  Usage data such as pages visited, time spent on the site, and
                  referring URLs
                </li>
                <li>
                  Information provided during phone calls or email
                  correspondence with our team
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                How We Use Your Information
              </h2>
              <p className="mb-3">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Respond to your enquiries and provide our services</li>
                <li>
                  Contact you regarding your lead generation campaign or account
                </li>
                <li>
                  Improve our website, services, and customer experience
                </li>
                <li>
                  Send you relevant marketing communications (with your consent)
                </li>
                <li>
                  Analyse website usage and optimise our advertising campaigns
                </li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Legal Basis for Processing
              </h2>
              <p className="mb-3">
                We process your personal data on the following legal bases:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">Consent:</span>{" "}
                  When you submit an enquiry form or opt in to marketing
                  communications
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Contractual necessity:
                  </span>{" "}
                  When processing is needed to fulfil our services to you
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Legitimate interest:
                  </span>{" "}
                  For improving our services and website performance
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Data Sharing
              </h2>
              <p className="mb-3">
                We do not sell your personal data. We may share your information
                with:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Google (for analytics and advertising purposes)
                </li>
                <li>
                  Zapier (for processing form submissions)
                </li>
                <li>
                  Trustpilot (for displaying reviews)
                </li>
                <li>
                  Our team members who need access to provide our services
                </li>
                <li>
                  Legal authorities if required by law
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Data Retention
              </h2>
              <p>
                We retain your personal data for as long as necessary to provide
                our services and fulfil the purposes described in this policy. If
                you are a client, we retain your data for the duration of our
                business relationship and for a reasonable period thereafter. You
                can request deletion of your data at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Your Rights
              </h2>
              <p className="mb-3">
                Under UK data protection law (UK GDPR), you have the right to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:info@leadseveryday.co.uk"
                  className="text-primary hover:underline"
                >
                  info@leadseveryday.co.uk
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Cookies
              </h2>
              <p>
                We use cookies to improve your experience on our website. For
                full details about the cookies we use, please see our{" "}
                <a href="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Security
              </h2>
              <p>
                We take appropriate technical and organisational measures to
                protect your personal data against unauthorised access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date. We
                encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or how we
                handle your data, please contact us at{" "}
                <a
                  href="mailto:info@leadseveryday.co.uk"
                  className="text-primary hover:underline"
                >
                  info@leadseveryday.co.uk
                </a>
                .
              </p>
            </div>

            <p className="text-foreground/50 text-xs">
              Last updated: May 2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

import { COMPANY } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie policy for ${COMPANY.name}. Learn about the cookies we use and how to manage your preferences.`,
};

const CookiePolicy = () => {
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
            Cookie Policy
          </h1>

          <div
            className="hero-animate mt-8 space-y-8 text-foreground/70 text-sm lg:text-base leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            <p>
              This Cookie Policy explains how {COMPANY.name} (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar
              technologies on our website at {COMPANY.url}.
            </p>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are placed on your device when
                you visit a website. They are widely used to make websites work
                more efficiently, provide information to website owners, and
                improve the user experience.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                How We Use Cookies
              </h2>
              <p className="mb-3">We use the following types of cookies:</p>
              <ul className="space-y-3 list-disc list-inside">
                <li>
                  <span className="font-medium text-foreground">
                    Essential Cookies:
                  </span>{" "}
                  These are necessary for the website to function properly. They
                  enable core features like page navigation and access to secure
                  areas.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Analytics Cookies:
                  </span>{" "}
                  We use Google Analytics to understand how visitors interact
                  with our website. These cookies collect information
                  anonymously, including the number of visitors, where visitors
                  come from, and the pages they visit.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Advertising Cookies:
                  </span>{" "}
                  We use Google Ads conversion tracking and remarketing cookies
                  to measure the effectiveness of our advertising campaigns and
                  to show relevant ads to people who have previously visited our
                  website.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Third-Party Cookies:
                  </span>{" "}
                  Our website may include features from third-party services such
                  as Trustpilot, which may set their own cookies. We do not
                  control these cookies.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Cookies We Use
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 pr-4 text-foreground font-medium">
                        Cookie
                      </th>
                      <th className="text-left py-2 pr-4 text-foreground font-medium">
                        Provider
                      </th>
                      <th className="text-left py-2 pr-4 text-foreground font-medium">
                        Purpose
                      </th>
                      <th className="text-left py-2 text-foreground font-medium">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/70">
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">_ga</td>
                      <td className="py-2 pr-4">Google</td>
                      <td className="py-2 pr-4">
                        Distinguishes unique users
                      </td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">_gid</td>
                      <td className="py-2 pr-4">Google</td>
                      <td className="py-2 pr-4">
                        Distinguishes unique users
                      </td>
                      <td className="py-2">24 hours</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">_gcl_au</td>
                      <td className="py-2 pr-4">Google Ads</td>
                      <td className="py-2 pr-4">Conversion tracking</td>
                      <td className="py-2">90 days</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">_fbp</td>
                      <td className="py-2 pr-4">Facebook</td>
                      <td className="py-2 pr-4">Ad delivery and measurement</td>
                      <td className="py-2">90 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Managing Cookies
              </h2>
              <p>
                You can control and manage cookies through your browser settings.
                Most browsers allow you to refuse or delete cookies. The methods
                for doing so vary from browser to browser. Please note that
                blocking certain cookies may impact the functionality of our
                website.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We encourage you to review this page
                periodically.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about our use of cookies, please
                contact us at{" "}
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

export default CookiePolicy;

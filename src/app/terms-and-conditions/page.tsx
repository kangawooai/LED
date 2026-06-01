import { COMPANY } from "@/constants";

const TermsAndConditions = () => {
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
            Terms &amp; Conditions
          </h1>

          <div
            className="hero-animate mt-8 space-y-8 text-foreground/70 text-sm lg:text-base leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            <p>
              These Terms and Conditions govern your use of the {COMPANY.name}{" "}
              website at {COMPANY.url} and the services we provide. By using our
              website or engaging our services, you agree to be bound by these
              terms.
            </p>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                1. About Us
              </h2>
              <p>
                {COMPANY.name} is a lead generation company based in the United
                Kingdom. We provide digital marketing services including landing
                page creation, Google Ads management, and lead generation for
                trade and service businesses.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                2. Our Services
              </h2>
              <p className="mb-3">Our services include but are not limited to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Building bespoke, mobile-optimised landing pages for your trade
                </li>
                <li>Setting up and managing Google Ads campaigns</li>
                <li>
                  Delivering exclusive leads directly to your business
                </li>
                <li>
                  Ongoing campaign monitoring, reporting, and optimisation
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                3. Payment Terms
              </h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  All services are charged at a flat monthly fee as agreed during
                  your consultation
                </li>
                <li>
                  We do not charge commission on any leads or jobs generated
                  through our services
                </li>
                <li>
                  Payment is due monthly in advance via direct debit or card
                  payment
                </li>
                <li>
                  Google Ads spend is separate from our management fee and is
                  paid directly to Google
                </li>
                <li>
                  Late payments may result in suspension of your campaign
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                4. No Minimum Contract
              </h2>
              <p>
                We operate on a pay-as-you-go basis. There are no long-term
                contracts or minimum terms. You may cancel your service at any
                time by giving us written notice. Cancellation will take effect
                at the end of the current billing period.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                5. Lead Ownership
              </h2>
              <p>
                All leads generated through our services are 100% yours. We do
                not share, resell, or distribute your leads to any third party.
                Each lead is exclusive to your business.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                6. Lead Forecasts
              </h2>
              <p>
                During your consultation, we may provide an estimate of the
                number of leads you can expect. These forecasts are based on our
                experience and data from similar campaigns but are not
                guaranteed. Actual results may vary depending on factors
                including location, competition, budget, and seasonal demand.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                7. Your Responsibilities
              </h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Responding to leads promptly -- we recommend within 30 minutes
                  for the best conversion rates
                </li>
                <li>
                  Providing accurate business information for your landing page
                  and campaign
                </li>
                <li>
                  Notifying us of any changes to your services, contact details,
                  or service area
                </li>
                <li>
                  Ensuring your business holds all necessary licences,
                  certifications, and insurance
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                8. Intellectual Property
              </h2>
              <p>
                All landing pages, ad copy, and creative assets produced by{" "}
                {COMPANY.name} remain our intellectual property. While your
                campaign is active, you are granted a licence to use these
                materials. Upon termination, landing pages may be taken offline.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                {COMPANY.name} shall not be liable for any indirect, incidental,
                or consequential damages arising from the use of our services.
                Our total liability shall not exceed the fees paid by you in the
                three months preceding the claim. We are not responsible for the
                actions, quality of work, or conduct of our clients when dealing
                with the leads we provide.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                10. Website Use
              </h2>
              <p>
                The content on our website is provided for general information
                purposes. While we make reasonable efforts to ensure accuracy, we
                do not guarantee that the information is complete or up-to-date.
                You must not use our website for any unlawful purpose or in any
                way that could damage or impair the website.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                11. Governing Law
              </h2>
              <p>
                These Terms and Conditions are governed by and construed in
                accordance with the laws of England and Wales. Any disputes
                arising from these terms shall be subject to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                12. Changes to These Terms
              </h2>
              <p>
                We reserve the right to update these Terms and Conditions at any
                time. Changes will be posted on this page with an updated
                revision date. Continued use of our services after changes are
                posted constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl tracking-tight text-foreground mb-3">
                13. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms and Conditions,
                please contact us at{" "}
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

export default TermsAndConditions;

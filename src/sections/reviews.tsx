"use client";

import { motion, useInView } from "motion/react";
import { useCallback, useRef } from "react";

const Reviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const trustpilotRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  const trustpilotDesktopRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <section id="reviews-section" ref={ref} className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
        >
          What Our Clients Say
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
        >
          Real Results. Real Feedback.
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-8 md:mt-12"
        >
          {/* Mobile: Mini Carousel */}
          <div
            ref={trustpilotRef}
            className="trustpilot-widget md:hidden"
            data-locale="en-US"
            data-template-id="539ad0ffdec7e10e686debd7"
            data-businessunit-id="606ea5a74e740b0001398b05"
            data-style-height="350px"
            data-style-width="100%"
            data-theme="dark"
            data-token="0c4b27aa-ddb5-49a6-9f25-9facd86690fd"
            data-stars="4,5"
            data-review-languages="en"
          >
            <a
              href="https://www.trustpilot.com/review/leadseveryday.co.uk"
              target="_blank"
              rel="noopener"
            >
              Trustpilot
            </a>
          </div>
          {/* Desktop: Carousel */}
          <div
            ref={trustpilotDesktopRef}
            className="trustpilot-widget hidden md:block"
            data-locale="en-US"
            data-template-id="53aa8912dec7e10d38f59f36"
            data-businessunit-id="606ea5a74e740b0001398b05"
            data-style-height="140px"
            data-style-width="100%"
            data-theme="dark"
            data-token="cf2bd426-bc84-4c7b-b20a-42491efbf7c6"
            data-stars="4,5"
            data-review-languages="en"
          >
            <a
              href="https://www.trustpilot.com/review/leadseveryday.co.uk"
              target="_blank"
              rel="noopener"
            >
              Trustpilot
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;

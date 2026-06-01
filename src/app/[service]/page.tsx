"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/forms/contact-form";
import { HOW_IT_WORKS, STATS } from "@/constants";
import { faqs } from "@/data/faqs";
import { services } from "@/data/services";
import {
  IconPhone,
  IconCheck,
  IconSearch,
  IconTargetArrow,
  IconRocket,
} from "@tabler/icons-react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const processIcons = [IconSearch, IconTargetArrow, IconRocket];

const ServicePage = () => {
  const params = useParams();
  const slug = params.service as string;
  const service = services.find((s) => s.slug === slug);

  const benefitsRef = useRef(null);
  const processRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef(null);
  const faqsRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 });
  const reviewsInView = useInView(reviewsRef, { once: true, amount: 0.2 });
  const faqsInView = useInView(faqsRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: processRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const trustpilotRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  const trustpilotReviewsRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  const trustpilotReviewsDesktopRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  if (!service) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-svh md:min-h-0">
        {/* Mobile: centered background image with top/left/bottom fade */}
        <div
          className="absolute top-[10%] bottom-1/4 left-[10%] -right-1/4 md:hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, white 20%, white 50%, transparent 90%), linear-gradient(to right, transparent 30%, white 60%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, white 20%, white 50%, transparent 90%), linear-gradient(to right, transparent 30%, white 60%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in" as unknown as string,
          }}
        >
          <Image
            src={`/${slug}.webp`}
            alt={service.name}
            fill
            className="object-cover"
            style={{ objectPosition: service.mobileImagePosition || "75% center" }}
            priority
          />
        </div>

        {/* Desktop: background image clipped to container area with fades */}
        <div
          className="absolute inset-y-0 left-0 hidden md:block"
          style={{
            right: "max(0px, calc(50% - 40rem))",
            maskImage: "linear-gradient(to bottom, white 60%, transparent 100%), linear-gradient(to left, transparent 0rem, white 12rem)",
            WebkitMaskImage: "linear-gradient(to bottom, white 60%, transparent 100%), linear-gradient(to left, transparent 0rem, white 12rem)",
            maskComposite: "intersect",
            WebkitMaskComposite: "destination-in",
          }}
        >
          <Image
            src={`/${slug}.webp`}
            alt={service.name}
            fill
            className="object-cover object-right-top"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--background) 40%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0 pt-20 md:pt-44 pb-12 md:pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.1 },
              },
            }}
            className="flex flex-col items-start"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-sm uppercase tracking-widest text-primary font-semibold"
            >
              {service.name} Lead Generation
            </motion.p>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-4 text-3xl leading-9 md:text-5xl lg:text-6xl tracking-tight lg:leading-14 w-[70%] md:w-1/2"
            >
              {service.headline}
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-4 text-foreground/70 text-sm lg:text-base w-[70%] md:w-1/2"
            >
              {service.description}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-row items-center gap-4 mt-8"
            >
              {/* Mobile: Call Now + Enquire Now */}
              <a href="tel:+443330424424" className="md:hidden">
                <Button size="default">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
              <Link href="/book-a-call" className="md:hidden">
                <Button variant="muted" size="default">
                  Enquire Now
                </Button>
              </Link>

              {/* Desktop: Enquire Now + or call text */}
              <Link href="/book-a-call" className="hidden md:block">
                <Button size="default">
                  Enquire Now
                </Button>
              </Link>
              <span className="hidden md:inline text-sm text-foreground/60">
                or call{" "}
                <a href="tel:+443330424424" className="text-primary hover:text-primary/80 font-medium">
                  0333 0 424 424
                </a>
              </span>
            </motion.div>

            {/* Mobile stats */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid grid-cols-2 gap-4 mt-8 md:hidden"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                </div>
              ))}
            </motion.div>

            {mounted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden md:block"
              >
                <div
                  ref={trustpilotRef}
                  className="trustpilot-widget md:![transform:scale(0.7425)] md:![margin-left:-1rem] md:![margin-top:0]"
                  data-locale="en-US"
                  data-template-id="53aa8807dec7e10d38f59f32"
                  data-businessunit-id="606ea5a74e740b0001398b05"
                  data-style-height="150px"
                  data-style-width="100%"
                  data-theme="dark"
                  data-token="769c3dbc-db9a-4da4-b5a9-9c18f42feece"
                  style={{ transformOrigin: "left", transform: "scale(0.635)", marginLeft: "-1rem", marginTop: "-1rem" }}
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
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="hidden md:block w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-left md:text-center"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              benefitsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={
              benefitsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            What You Get With Our {service.name} Leads
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
            className="grid md:grid-cols-2 gap-4 mt-8 md:mt-12"
          >
            {service.benefits.map((benefit) => (
              <motion.div
                key={benefit}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-5 py-4"
              >
                <div className="size-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <IconCheck className="size-3.5 text-primary" />
                </div>
                <span className="text-foreground/90 text-sm lg:text-[15px]">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Testimonials */}
      {service.youtubePlaylistId && (
        <section className="w-full py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold text-center">
              Video Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3">
              Hear From Our {service.name} Clients
            </h2>

            <VideoEmbed
              src={`https://www.youtube.com/embed/videoseries?list=${service.youtubePlaylistId}&rel=0`}
              title={`${service.name} video testimonials`}
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="w-full py-12 md:py-16 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Ready to Get More {service.name} Leads?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Book a free call and we&apos;ll tell you exactly how many{" "}
              {service.name.toLowerCase()} leads we can deliver in your area.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              {/* Mobile: Call Now */}
              <a href="tel:+443330424424" className="md:hidden">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>

              {/* Desktop: Enquire Now + or call text */}
              <Link href="/book-a-call" className="hidden md:block">
                <Button size="lg">
                  Enquire Now
                </Button>
              </Link>
              <span className="hidden md:inline text-sm text-foreground/60">
                or call{" "}
                <a href="tel:+443330424424" className="text-primary hover:text-primary/80 font-medium">
                  0333 0 424 424
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={processRef} id="process" className="relative w-full h-[350vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-start pt-24 md:justify-center md:pt-0 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 lg:px-20 2xl:px-0 w-full">
            <div className="text-center mb-6 md:mb-16">
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">
                Our Process
              </p>
              <h2 className="text-4xl md:text-5xl tracking-tight text-foreground mt-3">
                Three Simple Steps to More {service.name} Jobs
              </h2>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Dashed line track */}
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 -translate-x-px">
                <div className="w-0 h-full border-l-2 border-dashed border-border/30" />
                <motion.div
                  className="absolute top-0 left-0 w-0 border-l-2 border-dashed border-primary"
                  style={{ height: useTransform(scrollYProgress, [0.05, 0.85], ["0%", "100%"]) }}
                />
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-4 md:gap-6">
                {HOW_IT_WORKS.map((item, index) => {
                  const Icon = processIcons[index];
                  return (
                    <TimelineStep
                      key={item.step}
                      item={item}
                      Icon={Icon}
                      index={index}
                      scrollYProgress={scrollYProgress}
                      total={HOW_IT_WORKS.length}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section ref={reviewsRef} className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              reviewsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            What Our Clients Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={
              reviewsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            Real Results. Real Feedback.
          </motion.h2>

          {/* Trustpilot Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="mt-8 md:mt-12"
          >
            {/* Mobile: Mini Carousel */}
            <div
              ref={trustpilotReviewsRef}
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
              ref={trustpilotReviewsDesktopRef}
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

      {/* FAQs */}
      <section ref={faqsRef} className="w-full py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              faqsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            FAQs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={
              faqsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            Common Questions
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              faqsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="mt-8 md:mt-12"
          >
            <Accordion className="w-full">
              {faqs.slice(0, 5).map((faq, index) => (
                <AccordionItem key={index} value={index}>
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full mb-28 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">
                Get In Touch
              </p>
              <h2 className="text-4xl md:text-5xl tracking-tight text-foreground mt-3">
                Start Getting {service.name} Leads Today
              </h2>
              <p className="mt-4 text-foreground/70 text-sm lg:text-base">
                Fill in the form and one of our team will get back to you within
                24 hours to discuss how we can generate {service.name.toLowerCase()} leads
                in your area. No obligations, no hard sell — just a straightforward
                conversation about growing your business.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8 mt-4 md:mt-6">
              <ContactForm serviceName={service.name} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function TimelineStep({
  item,
  Icon,
  index,
  scrollYProgress,
  total,
}: {
  item: (typeof HOW_IT_WORKS)[number];
  Icon: (typeof processIcons)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  total: number;
}) {
  const segmentSize = 0.8 / total;
  const start = 0.05 + index * segmentSize;
  const mid = start + segmentSize * 0.7;

  const opacity = useTransform(scrollYProgress, [start, mid], [0.15, 1]);
  const y = useTransform(scrollYProgress, [start, mid], [12, 0]);
  const nodeScale = useTransform(scrollYProgress, [start, mid], [0.8, 1]);

  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      {/* Mobile layout */}
      <div className="flex items-start gap-5 md:hidden">
        <motion.div
          style={{ scale: nodeScale, opacity }}
          className="relative z-10 size-10 shrink-0 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center"
        >
          <Icon className="size-4 text-primary" />
        </motion.div>
        <motion.div style={{ opacity, y }} className="pt-0.5 pb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Step {item.step}
          </span>
          <h3 className="text-lg tracking-tight mt-0.5">{item.title}</h3>
          <p className="text-foreground/70 mt-1 text-sm">{item.description}</p>
        </motion.div>
      </div>

      {/* Desktop layout - alternating sides */}
      <div className="hidden md:grid grid-cols-[1fr_40px_1fr] items-start">
        {isEven ? (
          <motion.div style={{ opacity, y }} className="text-right pr-6 pt-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step {item.step}
            </span>
            <h3 className="text-xl tracking-tight mt-1">{item.title}</h3>
            <p className="text-foreground/70 mt-1 text-sm">
              {item.description}
            </p>
          </motion.div>
        ) : (
          <div />
        )}

        <motion.div
          style={{ scale: nodeScale, opacity }}
          className="relative z-10 size-10 mx-auto rounded-full bg-background border-2 border-primary/30 flex items-center justify-center"
        >
          <Icon className="size-5 text-primary" />
        </motion.div>

        {!isEven ? (
          <motion.div style={{ opacity, y }} className="text-left pl-6 pt-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step {item.step}
            </span>
            <h3 className="text-xl tracking-tight mt-1">{item.title}</h3>
            <p className="text-foreground/70 mt-1 text-sm">
              {item.description}
            </p>
          </motion.div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function VideoEmbed({ src, title }: { src: string; title: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="max-w-3xl mx-auto mt-8 md:mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: active ? "auto" : "none" }}
          src={active ? `${src}&autoplay=1` : src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {!active && (
          <button
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => setActive(true)}
            aria-label="Play video"
          />
        )}
      </div>
    </div>
  );
}

export default ServicePage;

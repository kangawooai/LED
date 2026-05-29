"use client";

import { testimonials } from "@/data/testimonials";
import { IconStar } from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ReviewCard = ({ testimonial }: { testimonial: (typeof testimonials)[number] }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-8 flex flex-col min-w-[85vw] md:min-w-0 snap-center">
    <div className="flex gap-0.5 text-primary mb-4">
      <IconStar className="size-4 fill-primary" />
      <IconStar className="size-4 fill-primary" />
      <IconStar className="size-4 fill-primary" />
      <IconStar className="size-4 fill-primary" />
      <IconStar className="size-4 fill-primary" />
    </div>
    <p className="text-foreground/90 text-balance leading-relaxed flex-1">
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className="flex flex-col mt-6 pt-4 border-t border-border">
      <span className="text-sm font-medium text-foreground">
        {testimonial.name}
      </span>
      <span className="text-xs text-foreground/70">
        {testimonial.industry}
      </span>
    </div>
  </div>
);

const Reviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

        {/* Mobile: horizontal scroll carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex gap-4 mt-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:hidden"
        >
          {testimonials.map((testimonial) => (
            <ReviewCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </motion.div>

        {/* Desktop: grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
          className="hidden md:grid md:grid-cols-3 gap-4 mt-12"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-8 flex flex-col"
            >
              <div className="flex gap-0.5 text-primary mb-4">
                <IconStar className="size-4 fill-primary" />
                <IconStar className="size-4 fill-primary" />
                <IconStar className="size-4 fill-primary" />
                <IconStar className="size-4 fill-primary" />
                <IconStar className="size-4 fill-primary" />
              </div>
              <p className="text-foreground/90 text-balance leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex flex-col mt-6 pt-4 border-t border-border">
                <span className="text-sm font-medium text-foreground">
                  {testimonial.name}
                </span>
                <span className="text-xs text-foreground/70">
                  {testimonial.industry}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;

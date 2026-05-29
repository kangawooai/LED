"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/data/faqs";
import { motion } from "motion/react";
import { useState } from "react";

const FaqsSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="faqs" className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0 flex flex-col items-center">
        <h3 className="text-4xl md:text-5xl tracking-tight bg-gradient-to-b from-secondary to-primary bg-clip-text text-transparent w-full text-start">
          Frequently asked questions
        </h3>
        <motion.div
          initial={false}
          animate={open ? "open" : "closed"}
          style={{ overflow: "hidden" }}
          variants={{
            open: { height: "fit-content" },
            closed: { height: 380 },
          }}
          className="relative w-full h-fit mt-12"
        >
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={index}>
                <AccordionTrigger className="text-left text-base md:text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 text-sm md:text-base leading-relaxed text-balance">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <motion.div
            variants={{
              open: { bottom: "0%", zIndex: -10 },
              closed: { bottom: "0%" },
            }}
            className="absolute inset-x-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-background h-1/2"
          />
        </motion.div>
        <Button
          variant="muted"
          onClick={() => setOpen((pv) => !pv)}
          className="mt-4 w-fit"
        >
          {open ? "Show less" : "Show all FAQs"}
        </Button>
      </div>
    </section>
  );
};

export default FaqsSection;

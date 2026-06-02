"use client";

import { HOW_IT_WORKS } from "@/constants";
import {
  IconSearch,
  IconTargetArrow,
  IconRocket,
} from "@tabler/icons-react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

const processIcons = [IconSearch, IconTargetArrow, IconRocket];

const Process = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lineHeight = useTransform(
    scrollYProgress,
    [0.05, 0.85],
    ["0%", "100%"]
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full h-[200vh] md:h-[350vh]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 lg:px-20 2xl:px-0 w-full">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">
              Our Process
            </p>
            <h2 className="text-4xl md:text-5xl tracking-tight text-foreground mt-3">
              A Simple Process That Works
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Dashed line track */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 -translate-x-px">
              <div className="w-0 h-full border-l-2 border-dashed border-border/30" />
              <motion.div
                className="absolute top-0 left-0 w-0 border-l-2 border-dashed border-primary"
                style={{ height: lineHeight }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-8 md:gap-6">
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

  const opacity = useTransform(scrollYProgress, [start, mid, 1], [0.15, 1, 1]);
  const y = useTransform(scrollYProgress, [start, mid, 1], [12, 0, 0]);
  const nodeScale = useTransform(scrollYProgress, [start, mid, 1], [0.8, 1, 1]);
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

export default Process;

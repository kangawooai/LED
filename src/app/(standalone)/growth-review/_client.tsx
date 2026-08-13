"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconDeviceMobile,
  IconRocket,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TENURE = [
  "Less than 3 months",
  "3–6 months",
  "6–12 months",
  "1–2 years",
  "2+ years",
] as const;

const GROWTH: { name: string; label: string }[] = [
  { name: "g_revenue", label: "Increased monthly revenue" },
  { name: "g_prices", label: "Increased your prices" },
  { name: "g_staff", label: "Hired more staff" },
  { name: "g_branch", label: "Opened another branch" },
  { name: "g_vans", label: "Added more vans" },
  { name: "g_quiet", label: "Reduced quiet periods" },
  { name: "g_areas", label: "Expanded into new areas" },
  { name: "g_biggerjobs", label: "Won bigger jobs" },
  { name: "g_fullybooked", label: "Become fully booked" },
  { name: "g_profit", label: "Improved profitability" },
  { name: "g_newservice", label: "Started a new service" },
];

const BEFORE_NOW: { label: string; key: string; money?: boolean }[] = [
  { label: "Monthly turnover (£)", key: "turnover", money: true },
  { label: "Number of employees", key: "employees" },
  { label: "Vans / vehicles", key: "vans" },
  { label: "Jobs per month", key: "jobs" },
  { label: "Avg job value (£)", key: "jobvalue", money: true },
  { label: "Avg cost per lead (£)", key: "cpl", money: true },
];

const RATINGS: { name: string; label: string; hints?: [string, string] }[] = [
  { name: "r_quality", label: "Quality of leads" },
  { name: "r_quantity", label: "Quantity of leads" },
  { name: "r_conversion", label: "Lead conversion" },
  { name: "r_service", label: "Customer service" },
  { name: "r_satisfaction", label: "Overall satisfaction" },
];

const PCT_WORK = ["Under 10%", "10–25%", "25–50%", "50–75%", "75%+"];
const JOBS_GENERATED = ["Under 25", "25–50", "50–100", "100–250", "250+"];

const HELPED: { name: string; label: string }[] = [
  { name: "h_leftprovider", label: "Left another lead provider" },
  { name: "h_boughtvehicle", label: "Bought another work vehicle" },
  { name: "h_reducedads", label: "Reduced Google Ads spend" },
  { name: "h_apprentice", label: "Hired an apprentice" },
  { name: "h_reducedreferrals", label: "Reduced reliance on referrals" },
  { name: "h_fulltimestaff", label: "Hired more full-time staff" },
  { name: "h_gonefulltime", label: "Gone full-time" },
  { name: "h_worklife", label: "Improved work-life balance" },
];

const CONSENTS: { name: string; label: string }[] = [
  {
    name: "c_testimonial",
    label:
      "Can we use your feedback as a testimonial on our website and social media?",
  },
  {
    name: "c_video",
    label: "Would you be happy to record a short video testimonial?",
  },
  {
    name: "c_visit",
    label: "Would you be happy for our team to visit and film your business?",
  },
  {
    name: "c_logo",
    label: "Can we use your company logo and photos in our marketing?",
  },
];

const STEP_LABELS = [
  "About your business",
  "Your business growth",
  "Before vs now",
  "Your experience",
  "The leads",
  "Tell us your story",
  "Share your success",
] as const;

const TOTAL_INPUT_STEPS = STEP_LABELS.length; // 7
const SUCCESS_STEP = TOTAL_INPUT_STEPS + 1; // 8 (welcome = 0)

/* ------------------------------------------------------------------ */
/*  Reusable field pieces                                              */
/* ------------------------------------------------------------------ */

function Eyebrow({ num, label }: { num: number; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        {num}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
        {label}
      </span>
    </div>
  );
}

function Chip({
  type,
  name,
  checked,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border bg-transparent px-3.5 py-3 text-sm font-medium transition-colors select-none",
        checked
          ? "border-primary bg-primary/10 text-foreground"
          : "border-input text-foreground hover:border-primary/50"
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "grid size-5 flex-none place-items-center border transition-colors",
          type === "radio" ? "rounded-full" : "rounded-[6px]",
          checked ? "border-primary bg-primary" : "border-input"
        )}
      >
        <IconCheck
          className={cn(
            "size-3 text-primary-foreground transition-opacity",
            checked ? "opacity-100" : "opacity-0"
          )}
          stroke={3.5}
        />
      </span>
      {children}
    </label>
  );
}

function RatingScale({
  value,
  onChange,
  hints,
}: {
  value?: string;
  onChange: (v: string) => void;
  hints?: [string, string];
}) {
  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, idx) => {
          const n = idx + 1;
          const on = value === String(n);
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(String(n))}
              className={cn(
                "aspect-square min-h-8 rounded-md border text-sm font-bold transition-all",
                on
                  ? "-translate-y-px border-primary bg-primary text-primary-foreground"
                  : "border-input text-muted-foreground hover:border-primary"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      {hints && (
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>{hints[0]}</span>
          <span>{hints[1]}</span>
        </div>
      )}
    </div>
  );
}

const slideVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
};

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

type FormData = Record<string, string>;

export default function GrowthReviewClient() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const set = (name: string, value: string) =>
    setData((d) => ({ ...d, [name]: value }));

  const toggle = (name: string) =>
    setData((d) => {
      const next = { ...d };
      if (next[name]) delete next[name];
      else next[name] = "Yes";
      return next;
    });

  const val = (name: string) => data[name] ?? "";

  const progress = useMemo(() => {
    if (step === 0) return 0;
    if (step >= SUCCESS_STEP) return 100;
    return Math.min(step, TOTAL_INPUT_STEPS) * (100 / TOTAL_INPUT_STEPS);
  }, [step]);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const validateAbout = () => {
    const ok =
      val("name").trim().length > 0 &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val("email").trim());
    setError(
      ok
        ? null
        : "Please add your name and a valid email so we can get back to you."
    );
    return ok;
  };

  const handleNext = () => {
    if (step === 1 && !validateAbout()) return;
    if (step === TOTAL_INPUT_STEPS) {
      submit();
      return;
    }
    go(step + 1);
  };

  const submit = async () => {
    if (submitting) return;
    if (honeypot) {
      go(SUCCESS_STEP);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/growth-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      go(SUCCESS_STEP);
    } catch {
      setError("Sorry — we couldn't send that. Please try again.");
      setSubmitting(false);
    }
  };

  const isSuccess = step === SUCCESS_STEP;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col px-5 pb-40 pt-6">
      {/* Progress */}
      {!isSuccess && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="uppercase tracking-wide">Customer Growth Review</span>
            {step > 0 && (
              <span>
                {step} / {TOTAL_INPUT_STEPS}
              </span>
            )}
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-input">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-1">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* STEP 0 — WELCOME */}
            {step === 0 && (
              <div className="pt-4">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Customer Growth Review
                </p>
                <h1 className="mb-3.5 text-4xl font-extrabold leading-tight tracking-tight">
                  Let&apos;s celebrate how far your business has come.
                </h1>
                <p className="mb-3.5 text-[15px] font-semibold italic text-primary">
                  Let us chase the customers, so you can make the money.
                </p>
                <p className="mb-2 max-w-[42ch] text-muted-foreground">
                  Your story helps us prove what&apos;s possible — and helps
                  other trades decide to grow too.
                </p>
                <p className="max-w-[42ch] text-muted-foreground">
                  Answer what you can; skip anything you&apos;re unsure of.
                  Nothing here is compulsory beyond your name and email.
                </p>
                <div className="mt-6 flex flex-wrap gap-5 border-t border-border pt-5 text-sm font-semibold text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <IconClock className="size-4 text-primary" /> About 3–4
                    minutes
                  </span>
                  <span className="flex items-center gap-2">
                    <IconDeviceMobile className="size-4 text-primary" /> Works on
                    your phone
                  </span>
                </div>
              </div>
            )}

            {/* STEP 1 — ABOUT */}
            {step === 1 && (
              <div>
                <Eyebrow num={1} label="About your business" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  The basics
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  So we know who&apos;s smashing it.
                </p>
                <div className="space-y-4">
                  <Field label="Your name">
                    <Input
                      value={val("name")}
                      autoComplete="name"
                      placeholder="First and last name"
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Company name">
                    <Input
                      value={val("company")}
                      autoComplete="organization"
                      placeholder="Your business name"
                      onChange={(e) => set("company", e.target.value)}
                    />
                  </Field>
                  <Field label="Email address">
                    <Input
                      type="email"
                      value={val("email")}
                      autoComplete="email"
                      placeholder="you@business.co.uk"
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Trade / industry">
                    <Input
                      value={val("trade")}
                      placeholder="e.g. Plumbing, Roofing, Electrical"
                      onChange={(e) => set("trade", e.target.value)}
                    />
                  </Field>
                  <div>
                    <Label className="mb-2 block">
                      How long have you worked with Leads Every Day?
                    </Label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {TENURE.map((t) => (
                        <Chip
                          key={t}
                          type="radio"
                          name="tenure"
                          checked={val("tenure") === t}
                          onChange={() => set("tenure", t)}
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — GROWTH */}
            {step === 2 && (
              <div>
                <Eyebrow num={2} label="Your business growth" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  What have you achieved?
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  Since joining Leads Every Day — tick everything that applies.
                </p>
                <div className="space-y-2.5">
                  {GROWTH.map((g) => (
                    <Chip
                      key={g.name}
                      type="checkbox"
                      name={g.name}
                      checked={!!data[g.name]}
                      onChange={() => toggle(g.name)}
                    >
                      {g.label}
                    </Chip>
                  ))}
                </div>
                <div className="mt-4">
                  <Field label="Anything else?" optional>
                    <Input
                      value={val("g_other")}
                      placeholder="Tell us in your own words"
                      onChange={(e) => set("g_other", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 3 — BEFORE VS NOW */}
            {step === 3 && (
              <div>
                <Eyebrow num={3} label="Before vs now" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  Show us the leap
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  Rough figures are perfect. Leave any row blank if you&apos;d
                  rather not say.
                </p>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-[1.1fr_1fr_1fr] text-xs font-extrabold uppercase tracking-wide">
                    <div className="bg-card px-3 py-2.5" />
                    <div className="bg-secondary px-3 py-2.5 text-center text-secondary-foreground">
                      Before
                    </div>
                    <div className="bg-primary px-3 py-2.5 text-center text-primary-foreground">
                      Now
                    </div>
                  </div>
                  {BEFORE_NOW.map((row) => (
                    <div
                      key={row.key}
                      className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-border"
                    >
                      <div className="flex items-center px-3 py-2.5 text-[13px] font-semibold">
                        {row.label}
                      </div>
                      <div className="border-l border-border">
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="—"
                          value={val(`${row.key}_before`)}
                          onChange={(e) =>
                            set(`${row.key}_before`, e.target.value)
                          }
                          className="w-full bg-transparent px-2 py-3 text-center text-[15px] outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        />
                      </div>
                      <div className="border-l border-border">
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="—"
                          value={val(`${row.key}_now`)}
                          onChange={(e) =>
                            set(`${row.key}_now`, e.target.value)
                          }
                          className="w-full bg-transparent px-2 py-3 text-center text-[15px] outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 — EXPERIENCE */}
            {step === 4 && (
              <div>
                <Eyebrow num={4} label="Your experience" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  Rate us honestly
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  1 = poor, 10 = excellent. Tap a number.
                </p>
                <div className="space-y-5">
                  {RATINGS.map((r) => (
                    <div key={r.name}>
                      <p className="mb-2 text-sm font-semibold">{r.label}</p>
                      <RatingScale
                        value={data[r.name]}
                        onChange={(v) => set(r.name, v)}
                      />
                    </div>
                  ))}
                  <div className="h-px bg-border" />
                  <div>
                    <p className="mb-2 text-sm font-semibold">
                      How likely are you to recommend Leads Every Day?
                    </p>
                    <RatingScale
                      value={data.nps}
                      onChange={(v) => set("nps", v)}
                      hints={["Not likely", "Very likely"]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 — THE LEADS */}
            {step === 5 && (
              <div>
                <Eyebrow num={5} label="The leads" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  The impact
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  How much of your work now runs on us.
                </p>

                <div className="mb-5">
                  <Label className="mb-2 block">
                    What percentage of your work now comes from Leads Every Day?
                  </Label>
                  <div className="flex flex-wrap gap-2.5">
                    {PCT_WORK.map((p) => (
                      <Chip
                        key={p}
                        type="radio"
                        name="pct_work"
                        checked={val("pct_work") === p}
                        onChange={() => set("pct_work", p)}
                      >
                        {p}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <Label className="mb-2 block">
                    Roughly how many jobs has Leads Every Day generated for you?
                  </Label>
                  <div className="flex flex-wrap gap-2.5">
                    {JOBS_GENERATED.map((j) => (
                      <Chip
                        key={j}
                        type="radio"
                        name="jobs_generated"
                        checked={val("jobs_generated") === j}
                        onChange={() => set("jobs_generated", j)}
                      >
                        {j}
                      </Chip>
                    ))}
                  </div>
                </div>

                <Field
                  label="Biggest job value you've won through us?"
                  optional
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      £
                    </span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      className="pl-7"
                      placeholder="0"
                      value={val("biggest_job_value")}
                      onChange={(e) => set("biggest_job_value", e.target.value)}
                    />
                  </div>
                </Field>

                <div className="my-5 h-px bg-border" />
                <Label className="mb-2 block">
                  Has Leads Every Day helped you do any of these?{" "}
                  <span className="font-normal text-muted-foreground">
                    (tick all that apply)
                  </span>
                </Label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {HELPED.map((h) => (
                    <Chip
                      key={h.name}
                      type="checkbox"
                      name={h.name}
                      checked={!!data[h.name]}
                      onChange={() => toggle(h.name)}
                    >
                      {h.label}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6 — STORY */}
            {step === 6 && (
              <div>
                <Eyebrow num={6} label="Tell us your story" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  In your own words
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  This is the bit that inspires other trades. No pressure to be
                  polished.
                </p>
                <div className="space-y-4">
                  <Field label="The one thing you're most proud of since joining">
                    <Textarea
                      rows={4}
                      value={val("biggest_achievement")}
                      placeholder="e.g. Went from working evenings alone to running a team of four…"
                      onChange={(e) =>
                        set("biggest_achievement", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Your growth story" optional>
                    <Textarea
                      rows={4}
                      value={val("story")}
                      placeholder="What's changed for your business — and for you?"
                      onChange={(e) => set("story", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 7 — SHARE */}
            {step === 7 && (
              <div>
                <Eyebrow num={7} label="Share your success" />
                <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight">
                  Help us shout about it
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  We&apos;d love to feature your win. Tick what you&apos;re happy
                  with — if you say yes to any, someone from the team will be in
                  touch to arrange it.
                </p>
                <div className="space-y-5">
                  {CONSENTS.map((c, idx) => (
                    <div key={c.name}>
                      {idx > 0 && <div className="mb-5 h-px bg-border" />}
                      <p className="mb-2.5 text-sm font-semibold">{c.label}</p>
                      <div className="flex gap-2.5">
                        {["Yes", "No"].map((opt) => (
                          <Chip
                            key={opt}
                            type="radio"
                            name={c.name}
                            checked={val(c.name) === opt}
                            onChange={() => set(c.name, opt)}
                          >
                            {opt}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label>
                    Leave this empty
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 8 — SUCCESS */}
            {isSuccess && (
              <div className="pt-10 text-center">
                <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-primary/10">
                  <IconCheck className="size-10 text-primary" stroke={2.4} />
                </div>
                <h1 className="mb-2.5 text-3xl font-extrabold tracking-tight">
                  Thank you — that&apos;s brilliant.
                </h1>
                <p className="mx-auto max-w-[40ch] text-muted-foreground">
                  Your growth review is in. If you said yes to featuring your
                  story, we&apos;ll be in touch soon to arrange the next steps.
                </p>
                <p className="mt-4 flex items-center justify-center gap-1.5 font-semibold text-foreground">
                  Keep growing <IconRocket className="size-5 text-primary" />
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>
        )}
      </div>

      {/* Footer nav */}
      {!isSuccess && (
        <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background from-70% to-transparent px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={() => go(step - 1)}
                disabled={submitting}
              >
                <IconArrowLeft className="size-4" /> Back
              </Button>
            )}
            <Button
              size="lg"
              type="button"
              className="flex-1"
              onClick={handleNext}
              disabled={submitting}
            >
              {step === 0
                ? "Start"
                : submitting
                  ? "Sending…"
                  : step === TOTAL_INPUT_STEPS
                    ? "Submit review"
                    : "Continue"}
              {step !== TOTAL_INPUT_STEPS && !submitting && (
                <IconArrowRight className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small labelled field wrapper                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

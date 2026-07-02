// Billing schedule calculation utilities

export interface BillingChangeResult {
  nextBillingDate: string; // ISO date string
  shouldPauseCampaign: boolean;
  pauseDate?: string; // ISO date string
  resumeDate?: string; // ISO date string
  proRataDays?: number;
  proRataAmount?: number;
  reason: string;
}

/**
 * Calculate next billing date when customer changes their billing day
 *
 * Rules:
 * 1. Moving forward (earlier in month): Complete current cycle, start new day next month
 * 2. Moving backward (later in month): Pause at old day, bill at new day same month
 * 3. Already billed + moving earlier: Next billing is new day next month
 * 4. Gap > 1 month: Calculate pro-rata daily cost for extra days instead of pausing
 */
export function calculateBillingChange(
  currentDate: Date,
  currentBillingDay: number,
  newBillingDay: number,
  lastBilledDate: Date,
  monthlyFee?: number
): BillingChangeResult {
  const today = new Date(currentDate);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const lastBilled = new Date(lastBilledDate);
  const billedThisMonth =
    lastBilled.getMonth() === currentMonth &&
    lastBilled.getFullYear() === currentYear;

  const candidateNextBilling = getNextBillingDate(
    today,
    newBillingDay,
    lastBilled
  );

  // Check if gap > 1 month from last billed — pro-rata instead of pausing
  const oneMonthAfterLastBilled = new Date(lastBilled);
  oneMonthAfterLastBilled.setMonth(oneMonthAfterLastBilled.getMonth() + 1);

  const diffMs = candidateNextBilling.getTime() - lastBilled.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 31) {
    const extraDaysMs =
      candidateNextBilling.getTime() - oneMonthAfterLastBilled.getTime();
    const extraDays = Math.round(extraDaysMs / (1000 * 60 * 60 * 24));

    const billingPeriodMs =
      oneMonthAfterLastBilled.getTime() - lastBilled.getTime();
    const billingPeriodDays = Math.round(
      billingPeriodMs / (1000 * 60 * 60 * 24)
    );
    const dailyRate = monthlyFee ? monthlyFee / billingPeriodDays : 0;
    const proRataAmount = monthlyFee
      ? Math.round(dailyRate * extraDays * 100) / 100
      : 0;

    return {
      nextBillingDate: candidateNextBilling.toISOString(),
      shouldPauseCampaign: false,
      proRataDays: extraDays,
      proRataAmount,
      reason: monthlyFee
        ? `Billing gap of ${extraDays} extra days. A pro-rata charge of ${formatCurrency(proRataAmount)} will be applied (${formatCurrency(dailyRate)}/day x ${extraDays} days). Next full billing on ${formatDate(candidateNextBilling)}.`
        : `Billing gap of ${extraDays} extra days beyond 1 month. A pro-rata charge will apply. Next billing on ${formatDate(candidateNextBilling)}.`,
    };
  }

  // Case 1: Already billed this month
  if (billedThisMonth) {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    if (newBillingDay > currentBillingDay) {
      const pauseDate = new Date(nextYear, nextMonth, currentBillingDay);
      const resumeDate = new Date(nextYear, nextMonth, newBillingDay);

      return {
        nextBillingDate: resumeDate.toISOString(),
        shouldPauseCampaign: true,
        pauseDate: pauseDate.toISOString(),
        resumeDate: resumeDate.toISOString(),
        reason: `Already billed this month. Will pause on ${formatDate(pauseDate)}, bill and resume on ${formatDate(resumeDate)}`,
      };
    }

    const nextBillingDate = new Date(nextYear, nextMonth, newBillingDay);

    return {
      nextBillingDate: nextBillingDate.toISOString(),
      shouldPauseCampaign: false,
      reason: `Already billed this month. Next billing: ${formatDate(nextBillingDate)}`,
    };
  }

  // Case 2: Moving forward (earlier in month)
  if (newBillingDay < currentBillingDay) {
    const thisBillingDate = new Date(
      currentYear,
      currentMonth,
      currentBillingDay
    );
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextBillingDate = new Date(nextYear, nextMonth, newBillingDay);

    return {
      nextBillingDate: thisBillingDate.toISOString(),
      shouldPauseCampaign: false,
      reason: `Billing on ${formatDate(thisBillingDate)} (current cycle), then ${formatDate(nextBillingDate)}`,
    };
  }

  // Case 3: Moving backward (later in month)
  if (newBillingDay > currentBillingDay) {
    const pauseDate = new Date(
      currentYear,
      currentMonth,
      currentBillingDay
    );
    const resumeDate = new Date(currentYear, currentMonth, newBillingDay);

    return {
      nextBillingDate: resumeDate.toISOString(),
      shouldPauseCampaign: true,
      pauseDate: pauseDate.toISOString(),
      resumeDate: resumeDate.toISOString(),
      reason: `Pausing on ${formatDate(pauseDate)}, billing and resuming on ${formatDate(resumeDate)}`,
    };
  }

  // No change
  const nextBillingDate = new Date(
    currentYear,
    currentMonth,
    currentBillingDay
  );
  return {
    nextBillingDate: nextBillingDate.toISOString(),
    shouldPauseCampaign: false,
    reason: "No change to billing day",
  };
}

/**
 * Get next billing date for a given billing day
 */
export function getNextBillingDate(
  currentDate: Date,
  billingDay: number,
  lastBilledDate?: Date
): Date {
  const today = new Date(currentDate);
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (lastBilledDate) {
    const lastBilled = new Date(lastBilledDate);
    const billedThisMonth =
      lastBilled.getMonth() === currentMonth &&
      lastBilled.getFullYear() === currentYear;

    if (billedThisMonth) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      return new Date(nextYear, nextMonth, billingDay);
    }
  }

  if (currentDay < billingDay) {
    return new Date(currentYear, currentMonth, billingDay);
  }

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  return new Date(nextYear, nextMonth, billingDay);
}

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ── Calendar API Client ── */

/**
 * Fire-and-forget calendar sync. Sends a POST to the server-side sync endpoint
 * and does not wait for or throw on failure.
 */
export function syncCalendarEvent(
  customerId: string,
  type: "job" | "lead_visit"
): void {
  fetch("/api/calendar/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, type }),
  }).catch(() => {
    // Fire-and-forget: silently ignore errors
  });
}

/* ── iCal Feed ── */

export async function getICalFeedUrl(): Promise<string> {
  const response = await fetch("/api/calendar/feed/setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to get iCal feed URL"
    );
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export async function regenerateICalFeedUrl(): Promise<string> {
  const response = await fetch("/api/calendar/feed/setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ regenerate: true }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to regenerate iCal feed URL"
    );
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

/* ── Google Calendar ── */

export async function checkGoogleConnection(): Promise<boolean> {
  try {
    const response = await fetch("/api/calendar/google/calendars", {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getGoogleCalendars(): Promise<
  Array<{ id: string; name: string; primary: boolean }>
> {
  const response = await fetch("/api/calendar/google/calendars", {
    method: "GET",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to fetch Google calendars"
    );
  }

  const data = (await response.json()) as {
    calendars: Array<{ id: string; name: string; primary: boolean }>;
  };
  return data.calendars;
}

export async function selectGoogleCalendar(
  calendarId: string
): Promise<void> {
  const response = await fetch("/api/calendar/google/calendars", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ calendarId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to select Google calendar"
    );
  }
}

export async function disconnectGoogle(): Promise<void> {
  const response = await fetch("/api/calendar/google/disconnect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to disconnect Google calendar"
    );
  }
}

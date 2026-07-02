import { useQuery } from "@tanstack/react-query";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function fetchAccountEmail(): Promise<string | null> {
  const res = await fetch("/api/account");
  if (!res.ok) return null;
  const data = await res.json();
  return data.email || null;
}

export function useIsAdmin() {
  const { data: email } = useQuery({
    queryKey: ["accountEmail"],
    queryFn: fetchAccountEmail,
  });

  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

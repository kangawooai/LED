import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Providers } from "./providers";
import { SetPasswordModal } from "@/components/set-password-modal";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Proposals", href: "/proposals" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Leads", href: "/leads" },
  { label: "Jobs", href: "/jobs" },
  { label: "Account", href: "/account" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <Providers>
      <div className="flex min-h-screen">
        <aside className="w-60 shrink-0 border-r border-white/10 bg-white/[0.02] flex flex-col">
          <div className="p-5 border-b border-white/10">
            <Link href="/dashboard">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/leads-everyday-neg.webp"
                alt="Leads Everyday"
                className="max-w-[140px]"
              />
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-foreground/40 truncate">{user.email}</p>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
          <SetPasswordModal />
        </main>
      </div>
    </Providers>
  );
}

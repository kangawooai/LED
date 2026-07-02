import Image from "next/image";
import Link from "next/link";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-6 flex items-center h-16">
          <Link href="/" className="relative h-7.5 w-[150px]">
            <Image
              src="/leads-everyday-neg.webp"
              alt="Leads Everyday"
              width={150}
              height={38}
              className="absolute inset-0 h-full w-auto object-contain opacity-0 dark:opacity-100 transition-opacity duration-600"
              priority
            />
            <Image
              src="/leads-everyday-pos.webp"
              alt="Leads Everyday"
              width={150}
              height={38}
              className="absolute inset-0 h-full w-auto object-contain opacity-100 dark:opacity-0 transition-opacity duration-600"
              priority
            />
          </Link>
        </div>
      </header>
      <main className="relative min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}

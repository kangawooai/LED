import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <Link href="/" className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/leads-everyday-neg.webp"
          alt="Leads Everyday"
          className="w-[160px] sm:w-[200px]"
        />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

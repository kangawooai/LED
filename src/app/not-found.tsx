import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-lg text-foreground/70">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg">Go Home</Button>
      </Link>
    </div>
  );
}

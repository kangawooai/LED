"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6">
      <h1 className="text-xl font-semibold text-center mb-1">Sign In</h1>
      <p className="text-sm text-foreground/60 text-center mb-6">
        Enter your email to receive a verification code.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending code..." : "Send Verification Code"}
        </Button>
      </form>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <a href="/api/auth/dev-login">
            <Button variant="outline" className="w-full" type="button">
              Dev Login (bypass OTP)
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

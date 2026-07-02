"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyOtpForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    // Ensure profile exists
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email || email,
          first_name: "",
          last_name: "",
          company_name: "",
          phone: "",
        });
      }
    }

    const redirectTo = searchParams.get("redirectedFrom") || "/dashboard";
    router.push(redirectTo);
  };

  if (!email) {
    router.push("/login");
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6">
      <h1 className="text-xl font-semibold text-center mb-1">
        Check Your Email
      </h1>
      <p className="text-sm text-foreground/60 text-center mb-6">
        We sent a verification code to{" "}
        <span className="text-foreground font-medium">{email}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="text-center text-lg tracking-[0.3em]"
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full"
          disabled={loading || code.length !== 6}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Button>
      </form>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6">
          <p className="text-center text-foreground/60">Loading...</p>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}

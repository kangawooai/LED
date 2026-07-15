"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TermsCompleted() {
  const router = useRouter();

  useEffect(() => {
    const leadId = sessionStorage.getItem("pandadoc_return_lead");
    if (leadId) {
      sessionStorage.removeItem("pandadoc_return_lead");
      router.replace(`/proposal/${leadId}`);
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-foreground/50">Redirecting...</p>
    </div>
  );
}

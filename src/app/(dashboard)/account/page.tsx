"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface AccountData {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  company_address: string | null;
  street_address: string | null;
  city: string | null;
  country: string | null;
  post_code: string | null;
  company_number: string | null;
}

async function fetchAccount(): Promise<AccountData> {
  const res = await fetch("/api/account");
  if (!res.ok) throw new Error("Failed to fetch account");
  return res.json();
}

async function saveAccount(data: Record<string, string>): Promise<AccountData> {
  const res = await fetch("/api/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update account");
  return res.json();
}

export default function AccountPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: account, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    business_name: "",
    company_address: "",
    street_address: "",
    city: "",
    country: "",
    post_code: "",
    company_number: "",
  });

  const [googleReady, setGoogleReady] = useState(false);
  const addressAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const addressCallbackRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (!node) {
        if (addressAutocompleteRef.current) {
          google.maps.event.clearInstanceListeners(addressAutocompleteRef.current);
          addressAutocompleteRef.current = null;
        }
        return;
      }

      if (addressAutocompleteRef.current) return;
      if (!window.google?.maps?.places) return;

      const ac = new google.maps.places.Autocomplete(node, {
        types: ["address"],
        componentRestrictions: { country: "gb" },
        fields: ["formatted_address", "address_components"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place.formatted_address) {
          const parts = place.address_components || [];
          const get = (type: string) =>
            parts.find((c) => c.types.includes(type))?.long_name || "";

          const streetNumber = get("street_number");
          const route = get("route");
          const street = [streetNumber, route].filter(Boolean).join(" ");

          setForm((prev) => ({
            ...prev,
            company_address: place.formatted_address!,
            street_address: street,
            city: get("postal_town") || get("locality"),
            country: get("country"),
            post_code: get("postal_code"),
          }));
        }
      });

      addressAutocompleteRef.current = ac;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [googleReady]
  );

  useEffect(() => {
    if (account) {
      setForm({
        first_name: account.first_name || "",
        last_name: account.last_name || "",
        email: account.email || "",
        phone: (account.phone || "").replace(/^44/, "0"),
        business_name: account.business_name || "",
        company_address: account.company_address || "",
        street_address: account.street_address || "",
        city: account.city || "",
        country: account.country || "",
        post_code: account.post_code || "",
        company_number: account.company_number || "",
      });
    }
  }, [account]);

  const updateMutation = useMutation({
    mutationFn: () => saveAccount(form),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account"] }),
  });

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (isLoading) {
    return <div className="text-foreground/40">Loading...</div>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Account</h1>

      <div className="bg-white/5 border border-white/10 rounded-md p-5">
        <h3 className="text-sm font-semibold mb-3">Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={form.first_name}
              onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={form.last_name}
              onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-md p-5">
        <h3 className="text-sm font-semibold mb-3">Business</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={form.business_name}
              onChange={(e) => setForm((p) => ({ ...p, business_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Business Address</Label>
            <Input
              placeholder="Start typing your address..."
              value={form.company_address}
              onChange={(e) => setForm((p) => ({ ...p, company_address: e.target.value }))}
              ref={addressCallbackRef}
            />
          </div>

          {form.street_address && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input
                  value={form.street_address}
                  onChange={(e) => setForm((p) => ({ ...p, street_address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Post Code</Label>
                <Input
                  value={form.post_code}
                  onChange={(e) => setForm((p) => ({ ...p, post_code: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Company Number</Label>
            <Input
              value={form.company_number}
              onChange={(e) => setForm((p) => ({ ...p, company_number: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() => updateMutation.mutate()}
        disabled={updateMutation.isPending}
        className="w-full"
      >
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>

      <div className="bg-white/5 border border-white/10 rounded-md p-5">
        <h3 className="text-sm font-semibold mb-3">Session</h3>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setGoogleReady(true)}
      />
      <style jsx global>{`
        .pac-container {
          background-color: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          margin-top: 4px;
          font-family: inherit;
          z-index: 9999;
        }
        .pac-item {
          padding: 8px 12px;
          color: rgba(255, 255, 255, 0.7);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }
        .pac-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .pac-item-selected {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .pac-item-query {
          color: #fff;
          font-size: 0.875rem;
        }
        .pac-matched {
          color: hsl(var(--primary));
        }
        .pac-icon {
          display: none;
        }
      `}</style>
    </div>
  );
}

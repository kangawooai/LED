import { supabase } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * DEV ONLY — bypass OTP login by generating a magic link server-side,
 * verifying it immediately, and setting session cookies on the response.
 */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const email = "pete@leadseveryday.co.uk";

  // Ensure user exists
  const { data: users } = await supabase.auth.admin.listUsers();
  const existing = users?.users?.find((u) => u.email === email);

  if (!existing) {
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
  }

  // Generate a magic link token without sending an email
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error || !data?.properties?.hashed_token) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate link" },
      { status: 500 }
    );
  }

  // Create a response that redirects to dashboard
  const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL);
  const response = NextResponse.redirect(redirectUrl);

  // Create a Supabase client that writes session cookies onto the response
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verify the token server-side — this sets session cookies on the response
  const { error: verifyError } = await authClient.auth.verifyOtp({
    token_hash: data.properties.hashed_token,
    type: "magiclink",
  });

  if (verifyError) {
    return NextResponse.json(
      { error: verifyError.message },
      { status: 500 }
    );
  }

  return response;
}

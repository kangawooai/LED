import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("lead_id");
  if (!leadId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: proposal } = await supabase
    .from("proposal_progress")
    .select("email, first_name, last_name, auto_login_used")
    .eq("lead_id", leadId)
    .single();

  if (!proposal?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (proposal.auto_login_used) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const tempPassword = crypto.randomBytes(24).toString("base64url");
  let userId: string;

  // Try to create user — if they already exist, update their password
  const { data: newUser, error: createError } =
    await supabase.auth.admin.createUser({
      email: proposal.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: proposal.first_name,
        last_name: proposal.last_name,
        lead_id: leadId,
        needs_password: true,
      },
    });

  if (createError) {
    // User already exists — find them and update password
    const { data: users } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    const existing = users?.users?.find((u) => u.email === proposal.email);
    if (!existing) {
      console.error("[auto-login] user not found after create failed:", createError);
      return NextResponse.redirect(new URL("/login", req.url));
    }
    userId = existing.id;
    await supabase.auth.admin.updateUserById(userId, { password: tempPassword });
  } else {
    userId = newUser.user!.id;
  }

  // Sign in with the temp password using server client to set cookies
  const cookieStore = await cookies();
  const response = NextResponse.redirect(
    new URL(`/campaigns/${leadId}?setup=true`, req.url)
  );

  const serverSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error: signInError } = await serverSupabase.auth.signInWithPassword({
    email: proposal.email,
    password: tempPassword,
  });

  if (signInError) {
    console.error("[auto-login] sign in failed:", signInError);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Mark auto-login as used
  await supabase
    .from("proposal_progress")
    .update({ auto_login_used: true })
    .eq("lead_id", leadId);

  // Set needs_password flag
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { needs_password: true },
  });

  return response;
}

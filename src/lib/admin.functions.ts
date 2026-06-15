import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * One-time bootstrap: if there are zero admins in the system, the calling user
 * becomes the first admin. Safe because once an admin exists, the function refuses.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      throw new Error("An admin already exists. Ask an existing admin to grant you a role.");
    }
    const { error } = await supabaseAdmin.from("user_roles").insert({
      user_id: context.userId,
      role: "admin",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

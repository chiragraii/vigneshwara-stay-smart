import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Hotel Vigneshwara Lodge" }, { name: "description", content: "Sign in or create your guest account to manage your bookings." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const target = redirect ?? "/my-bookings";
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: target });
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: String(fd.get("full_name")), phone: String(fd.get("phone")) },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You're signed in.");
    navigate({ to: target });
  }

  async function signInGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/my-bookings" });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-8">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to home</Link>
          <h1 className="mt-4 font-display text-3xl">Guest account</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to track and manage your bookings.</p>

          <Button variant="outline" className="w-full mt-6" onClick={signInGoogle} type="button">
            Continue with Google
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="flex-1 h-px bg-border" />or<div className="flex-1 h-px bg-border" /></div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 mt-4">
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
                <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={6} /></div>
                <Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 mt-4">
                <div><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" required maxLength={120} /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" required maxLength={20} /></div>
                <div><Label htmlFor="email2">Email</Label><Input id="email2" name="email" type="email" required /></div>
                <div><Label htmlFor="password2">Password</Label><Input id="password2" name="password" type="password" required minLength={6} /></div>
                <Button className="w-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

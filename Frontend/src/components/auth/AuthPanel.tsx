import { useState } from "react";
import { LogIn, LogOut, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/hooks/Api";
import { useAuth } from "./AuthContext";

export const AuthPanel = () => {
  const { user, login, logout } = useAuth();

  const [open, setOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // ── HANDLERS ──────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      const result = await api.login(loginEmail.trim(), loginPassword);
      login(result.user, result.token);
      setOpen(false);
      // Reset form
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    setSignupError(null);

    // Basic client-side validation
    if (signupName.trim().length < 2) {
      setSignupError("Name must be at least 2 characters.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    setSignupLoading(true);
    try {
      const result = await api.register(signupName.trim(), signupEmail.trim(), signupPassword);
      login(result.user, result.token);
      setOpen(false);
      // Reset form
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err: unknown) {
      setSignupError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setSignupLoading(false);
    }
  };

  // Allow Enter key to submit
  const onLoginKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };
  const onSignupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed right-6 top-6 z-50 flex items-center gap-4">
      {/* Status Badge (Guest/Signed In) */}
      <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${user ? 'bg-primary animate-pulse' : 'bg-emerald-500/50'}`} />
        <span className="text-sm font-bold tracking-wide text-emerald-50">
          {user ? `Signed in as ${user.name}` : "Guest Mode"}
        </span>
      </div>

      {!user ? (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); setLoginError(null); setSignupError(null); }}>
          <DialogTrigger asChild>
            {/* Styled "Sign In" Trigger Button */}
            <Button className="gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-500/30 backdrop-blur-md rounded-full px-6 py-5 shadow-lg transition-all hover:scale-105">
              <LogIn className="h-4 w-4" />
              <span className="font-bold">Sign in</span>
            </Button>
          </DialogTrigger>

          {/* THE MODAL CONTENT */}
          <DialogContent className="sm:max-w-[420px] bg-emerald-950/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-3xl font-black text-white tracking-tight">Welcome back</DialogTitle>
              <DialogDescription className="text-emerald-100/70 font-medium text-base">
                Sign in or create an account to save your progress.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="login" className="w-full" onValueChange={() => { setLoginError(null); setSignupError(null); }}>

              {/* Styled Tabs Header */}
              <TabsList className="flex h-auto w-full justify-start gap-8 rounded-none border-b border-white/10 bg-transparent p-0 mb-8">
                <TabsTrigger
                  value="login"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-bold text-lg text-emerald-100/50 transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  Log in
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-bold text-lg text-emerald-100/50 transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              {/* ── LOGIN TAB ─────────────────────────────────────── */}
              <TabsContent value="login" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={onLoginKeyDown}
                    disabled={loginLoading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 shadow-inner transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={onLoginKeyDown}
                    disabled={loginLoading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 shadow-inner transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>

                {/* Error message */}
                {loginError && (
                  <p className="text-sm font-medium text-rose-300 bg-rose-950/50 border border-rose-900/50 rounded-xl px-4 py-3">
                    {loginError}
                  </p>
                )}

                {/* Styled Submit Button */}
                <Button
                  className="mt-4 h-14 w-full rounded-2xl bg-primary text-lg font-bold text-emerald-950 shadow-[0_4px_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:bg-emerald-400 disabled:opacity-50 disabled:hover:scale-100 gap-2"
                  onClick={handleLogin}
                  disabled={loginLoading || !loginEmail || !loginPassword}
                >
                  {loginLoading
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</>
                    : <><LogIn className="h-5 w-5" /> Log in</>
                  }
                </Button>
              </TabsContent>

              {/* ── SIGNUP TAB ────────────────────────────────────── */}
              <TabsContent value="signup" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest">Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    onKeyDown={onSignupKeyDown}
                    disabled={signupLoading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 shadow-inner transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    onKeyDown={onSignupKeyDown}
                    disabled={signupLoading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 shadow-inner transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min. 6 chars)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    onKeyDown={onSignupKeyDown}
                    disabled={signupLoading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 shadow-inner transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>

                {/* Error message */}
                {signupError && (
                  <p className="text-sm font-medium text-rose-300 bg-rose-950/50 border border-rose-900/50 rounded-xl px-4 py-3">
                    {signupError}
                  </p>
                )}

                {/* Styled Submit Button */}
                <Button
                  className="mt-4 h-14 w-full rounded-2xl bg-primary text-lg font-bold text-emerald-950 shadow-[0_4px_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:bg-emerald-400 disabled:opacity-50 disabled:hover:scale-100 gap-2"
                  onClick={handleSignup}
                  disabled={signupLoading || !signupName || !signupEmail || !signupPassword}
                >
                  {signupLoading
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating account...</>
                    : <><UserPlus className="h-5 w-5" /> Create account</>
                  }
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      ) : (
        /* Styled Logout Button */
        <Button
          className="gap-2 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-500/30 backdrop-blur-md rounded-full px-5 shadow-lg transition-all hover:scale-105"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span className="font-bold">Log out</span>
        </Button>
      )}
    </div>
  );
};
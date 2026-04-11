import { useState } from "react";
import { Coins, Loader2, LogIn, LogOut, UserPlus } from "lucide-react";
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

const toSafeAuthMessage = (err: unknown, fallback: string) => {
  const message = err instanceof Error ? err.message : fallback;
  if (!message || message.trim().length === 0) return fallback;
  if (message.trim().startsWith("{") || message.length > 180) return fallback;
  return message;
};

export const AuthPanel = () => {
  const { user, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async () => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      const result = await api.login(loginEmail.trim(), loginPassword);
      login(result.user, result.token);
      setOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: unknown) {
      setLoginError(toSafeAuthMessage(err, "Could not sign in. Please check your email and password."));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    setSignupError(null);
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
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err: unknown) {
      setSignupError(toSafeAuthMessage(err, "Could not create account. Please try again."));
    } finally {
      setSignupLoading(false);
    }
  };

  const onLoginKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const onSignupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-2 sm:right-6 sm:top-6 sm:gap-4">
      {user && (
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-900/90 px-3 py-1.5 shadow-lg backdrop-blur-md sm:px-4">
          <Coins className="h-3.5 w-3.5 shrink-0 text-yellow-400 sm:h-4 sm:w-4" />
          <span className="text-xs font-bold tracking-wide text-emerald-50 sm:text-sm">
            ${Math.round(user.stats?.money ?? 0).toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/40 px-3 py-1.5 shadow-lg backdrop-blur-md sm:px-4">
        <div className={`h-2 w-2 shrink-0 rounded-full ${user ? "bg-primary animate-pulse" : "bg-emerald-500/50"}`} />
        <span className="text-xs font-bold tracking-wide text-emerald-50 sm:text-sm">
          {user ? user.name : "Guest"}
        </span>
      </div>

      {!user ? (
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            setLoginError(null);
            setSignupError(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-900/80 px-4 py-4 text-white backdrop-blur-md hover:bg-emerald-800 sm:gap-2 sm:px-6 sm:py-5">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">Welcome Back</DialogTitle>
              <DialogDescription className="text-base font-medium text-emerald-100/70">
                Sign in or create an account to save your progress.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="login" className="w-full" onValueChange={() => { setLoginError(null); setSignupError(null); }}>
              <TabsList className="mb-8 flex h-auto w-full justify-start gap-8 rounded-none border-b border-white/10 bg-transparent p-0">
                <TabsTrigger value="login" className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-bold text-lg text-emerald-100/50 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">
                  Log in
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-bold text-lg text-emerald-100/50 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">
                  Sign up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs font-bold uppercase tracking-widest text-emerald-200/80">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={onLoginKeyDown}
                    disabled={loginLoading}
                    className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs font-bold uppercase tracking-widest text-emerald-200/80">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={onLoginKeyDown}
                    disabled={loginLoading}
                    className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                {loginError && <p className="rounded-xl border border-rose-900/50 bg-rose-950/50 px-4 py-3 text-sm font-medium text-rose-300">{loginError}</p>}
                <Button
                  className="mt-4 h-14 w-full gap-2 rounded-2xl bg-primary text-lg font-bold text-emerald-950 shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:bg-emerald-400 disabled:opacity-50"
                  onClick={handleLogin}
                  disabled={loginLoading || !loginEmail || !loginPassword}
                >
                  {loginLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : <><LogIn className="h-5 w-5" /> Log in</>}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-widest text-emerald-200/80">Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    onKeyDown={onSignupKeyDown}
                    disabled={signupLoading}
                    className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-widest text-emerald-200/80">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    onKeyDown={onSignupKeyDown}
                    disabled={signupLoading}
                    className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-widest text-emerald-200/80">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    onKeyDown={onSignupKeyDown}
                    disabled={signupLoading}
                    className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-emerald-100/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
                {signupError && <p className="rounded-xl border border-rose-900/50 bg-rose-950/50 px-4 py-3 text-sm font-medium text-rose-300">{signupError}</p>}
                <Button
                  className="mt-4 h-14 w-full gap-2 rounded-2xl bg-primary text-lg font-bold text-emerald-950 shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:bg-emerald-400 disabled:opacity-50"
                  onClick={handleSignup}
                  disabled={signupLoading || !signupName || !signupEmail || !signupPassword}
                >
                  {signupLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating account...</> : <><UserPlus className="h-5 w-5" /> Sign up</>}
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      ) : (
        <Button onClick={logout} variant="outline" className="gap-2 rounded-full border-white/10 bg-black/40 text-white backdrop-blur-md hover:bg-black/60">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      )}
    </div>
  );
};

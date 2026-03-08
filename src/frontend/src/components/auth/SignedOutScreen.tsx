import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckSquare,
  Loader2,
  Search,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function SignedOutScreen() {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("❌ [SignedOutScreen] Login failed:", error);
    }
  };

  const handlePublicSearch = () => {
    navigate({ to: "/public-search" });
  };

  return (
    <div className="min-h-screen bg-texture-diagonal flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="mb-7">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-01-25-at-8.23.55-AM-3-1.jpeg"
              alt="CSWA Group of Companies"
              className="h-20 mx-auto object-contain"
            />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
            CSWA Group of Companies
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Professional tax consulting — client &amp; task management,
            simplified.
          </p>
        </div>

        {/* ── Auth Cards row ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {/* Sign In */}
          <Card
            className="border border-border/60 shadow-elevated rounded-2xl"
            data-ocid="auth.login.card"
          >
            <CardHeader className="text-center pb-4 pt-7">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="font-display text-2xl font-bold text-foreground">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm">
                Sign in to access your workspace and manage tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 px-7 pb-7">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                size="lg"
                data-ocid="auth.login.primary_button"
                className="w-full h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary transition-all duration-200"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in to Continue"
                )}
              </Button>
              {isLoginError && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="auth.login.error_state"
                >
                  Sign in failed. Please try again.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Public Search */}
          <Card
            className="border border-border/60 shadow-card rounded-2xl"
            data-ocid="auth.public_search.card"
          >
            <CardHeader className="text-center pb-4 pt-7">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Search className="h-6 w-6 text-accent" />
                </div>
              </div>
              <CardTitle className="font-display text-2xl font-bold text-foreground">
                Search Assignees
              </CardTitle>
              <CardDescription className="text-sm">
                View assignee tasks without signing in
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 px-7 pb-7">
              <Button
                onClick={handlePublicSearch}
                size="lg"
                variant="outline"
                data-ocid="auth.public_search.button"
                className="w-full h-11 text-sm font-semibold border-accent/50 text-accent hover:bg-accent/8 hover:border-accent transition-all duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Assignees
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Feature Cards ─────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="border border-border/60 shadow-card rounded-xl hover:shadow-elevated transition-shadow duration-200 group">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3 group-hover:bg-primary/15 transition-colors">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="font-display text-base font-bold text-foreground">
                Client Management
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organize client information, contact details, and tax year
                projects in one centralized platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-card rounded-xl hover:shadow-elevated transition-shadow duration-200 group">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="p-2.5 rounded-lg bg-accent/10 w-fit mb-3 group-hover:bg-accent/15 transition-colors">
                <CheckSquare className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="font-display text-base font-bold text-foreground">
                Task Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor progress, assign responsibilities, and ensure timely
                completion of all client deliverables.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-card rounded-xl hover:shadow-elevated transition-shadow duration-200 group">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="p-2.5 rounded-lg bg-highlight/10 w-fit mb-3 group-hover:bg-highlight/15 transition-colors">
                <TrendingUp className="h-5 w-5 text-highlight" />
              </div>
              <CardTitle className="font-display text-base font-bold text-foreground">
                Analytics &amp; Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gain valuable insights into team performance, revenue tracking,
                and operational efficiency.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Security Badge ────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-1.5 text-sm text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
            Secured with Internet Identity
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CSWA Group of Companies. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

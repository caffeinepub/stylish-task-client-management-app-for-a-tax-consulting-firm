import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { FileText, Users, CheckSquare, Sparkles, TrendingUp, Shield } from 'lucide-react';

export default function SignedOutScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-highlight/5 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl" />
            <img 
              src="/assets/generated/cswa-logo-new.dim_800x200.png" 
              alt="CSWA Group of Companies Logo" 
              className="h-28 mx-auto relative"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent mb-4">
            CSWA Group of Companies
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your client relationships and task workflows with our powerful management platform
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="mb-12 border-2 border-primary/20 shadow-glow-primary overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <CardHeader className="text-center relative">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base">Sign in to access your workspace and start managing</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 relative">
            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              size="lg"
              className="w-full max-w-md h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-primary transition-all duration-300"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in to Continue'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow-primary group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <CardHeader className="relative">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Client Management</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organize client information, contact details, and tax year projects in one centralized platform
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-glow-accent group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />
            <CardHeader className="relative">
              <div className="p-3 rounded-xl bg-accent/10 w-fit mb-3 group-hover:bg-accent/20 transition-colors">
                <CheckSquare className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl font-bold">Task Tracking</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track deadlines, priorities, and progress for every client engagement with real-time updates
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-highlight/20 hover:border-highlight/40 transition-all duration-300 hover:shadow-glow-highlight group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-highlight/10 rounded-full blur-2xl group-hover:bg-highlight/20 transition-colors" />
            <CardHeader className="relative">
              <div className="p-3 rounded-xl bg-highlight/10 w-fit mb-3 group-hover:bg-highlight/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-highlight" />
              </div>
              <CardTitle className="text-xl font-bold">Dashboard Insights</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor active clients, open tasks, and upcoming deadlines with powerful analytics at a glance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>© {new Date().getFullYear()}</span>
            <span>•</span>
            <span>Built with ❤️ using</span>
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

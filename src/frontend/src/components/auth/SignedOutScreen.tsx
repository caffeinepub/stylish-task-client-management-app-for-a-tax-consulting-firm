import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { FileText, Users, CheckSquare } from 'lucide-react';

export default function SignedOutScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.97_0_0)] via-[oklch(0.95_0.01_80)] to-[oklch(0.93_0.02_120)] dark:from-[oklch(0.145_0_0)] dark:via-[oklch(0.18_0.01_80)] dark:to-[oklch(0.20_0.02_120)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/cswa-logo.dim_256x256.png" 
            alt="CSWA Group of Companies Logo" 
            className="h-20 w-20 mx-auto mb-4 opacity-90"
          />
          <h1 className="text-4xl font-bold text-[oklch(0.25_0_0)] dark:text-[oklch(0.95_0_0)] mb-2">
            CSWA Group of Companies
          </h1>
          <p className="text-lg text-[oklch(0.45_0_0)] dark:text-[oklch(0.70_0_0)]">
            Streamline your client relationships and task workflows
          </p>
        </div>

        <Card className="mb-8 border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in to access your workspace</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              size="lg"
              className="w-full max-w-xs bg-[oklch(0.35_0.05_120)] hover:bg-[oklch(0.30_0.05_120)] text-white dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)] dark:text-[oklch(0.15_0_0)]"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in to Continue'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-[oklch(0.50_0.08_130)]" />
              <CardTitle className="text-lg">Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Organize client information, contact details, and tax year projects in one place
              </p>
            </CardContent>
          </Card>

          <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
            <CardHeader>
              <CheckSquare className="h-8 w-8 mb-2 text-[oklch(0.50_0.08_130)]" />
              <CardTitle className="text-lg">Task Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track deadlines, priorities, and progress for every client engagement
              </p>
            </CardContent>
          </Card>

          <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-[oklch(0.50_0.08_130)]" />
              <CardTitle className="text-lg">Dashboard Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor active clients, open tasks, and upcoming deadlines at a glance
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

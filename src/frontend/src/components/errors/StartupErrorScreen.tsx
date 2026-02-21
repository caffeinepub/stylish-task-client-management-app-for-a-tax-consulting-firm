import { ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Copy, ExternalLink, Server, Wifi, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface StartupErrorScreenProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReload: () => void;
}

export function StartupErrorScreen({ error, errorInfo, onReload }: StartupErrorScreenProps) {
  const isDevelopment = import.meta.env.DEV;

  const copyErrorDetails = () => {
    const details = `
Application Startup Error Report
================================
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error Message:
${error?.message || 'Unknown error'}

Error Stack:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

Browser Info:
- Platform: ${navigator.platform}
- Language: ${navigator.language}
- Online: ${navigator.onLine}
- Cookies Enabled: ${navigator.cookieEnabled}
    `.trim();

    navigator.clipboard.writeText(details);
    toast.success('Error details copied to clipboard');
  };

  // Enhanced error categorization
  const getErrorCategory = () => {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('backend') || message.includes('canister') || message.includes('actor')) {
      return {
        type: 'Backend Connection Error',
        icon: Server,
        color: 'text-orange-500',
      };
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return {
        type: 'Network Error',
        icon: Wifi,
        color: 'text-red-500',
      };
    }
    if (message.includes('auth') || message.includes('identity')) {
      return {
        type: 'Authentication Error',
        icon: Shield,
        color: 'text-yellow-500',
      };
    }
    if (message.includes('router') || message.includes('route')) {
      return {
        type: 'Navigation Error',
        icon: AlertCircle,
        color: 'text-blue-500',
      };
    }
    
    return {
      type: 'Application Error',
      icon: AlertCircle,
      color: 'text-destructive',
    };
  };

  const errorCategory = getErrorCategory();
  const ErrorIcon = errorCategory.icon;

  // Get specific troubleshooting steps based on error type
  const getTroubleshootingSteps = () => {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('backend') || message.includes('canister') || message.includes('actor')) {
      return [
        'The backend canister may not be deployed or running',
        'Check canister status: dfx canister status backend',
        'Verify deployment: dfx deploy backend',
        'Ensure the canister has sufficient cycles',
        'Check Internet Computer network status',
        'Review backend logs for errors',
      ];
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return [
        'Check your internet connection',
        'Verify you can access other websites',
        'Try disabling VPN or proxy if enabled',
        'Check firewall settings',
        'Try a different network connection',
      ];
    }
    
    if (message.includes('auth') || message.includes('identity')) {
      return [
        'Clear browser cache and cookies',
        'Try signing in again',
        'Check Internet Identity service status',
        'Try using a different browser',
        'Disable browser extensions that might interfere',
      ];
    }
    
    return [
      'Click "Reload Application" below to restart with a clean state',
      'Check your internet connection',
      'Clear your browser cache and cookies',
      'Try using a different browser or incognito mode',
      'If the problem persists, contact support with the error details',
    ];
  };

  const troubleshootingSteps = getTroubleshootingSteps();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ErrorIcon className={`h-8 w-8 ${errorCategory.color} flex-shrink-0`} />
            <div>
              <CardTitle>Application Failed to Start</CardTitle>
              <CardDescription>
                {errorCategory.type}: An unexpected error occurred during initialization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-muted p-4 border-l-4 border-destructive">
              <p className="font-semibold text-sm mb-1">{errorCategory.type}</p>
              <p className="font-mono text-sm text-destructive break-words">{error.message}</p>
            </div>
          )}
          
          {isDevelopment && error?.stack && (
            <details className="rounded-lg bg-muted p-4">
              <summary className="cursor-pointer font-medium text-sm">Stack Trace (Development)</summary>
              <pre className="mt-2 overflow-x-auto text-xs whitespace-pre-wrap break-words">{error.stack}</pre>
            </details>
          )}

          {isDevelopment && errorInfo?.componentStack && (
            <details className="rounded-lg bg-muted p-4">
              <summary className="cursor-pointer font-medium text-sm">Component Stack (Development)</summary>
              <pre className="mt-2 overflow-x-auto text-xs whitespace-pre-wrap break-words">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div className="text-sm text-muted-foreground space-y-3">
            <div>
              <p className="font-semibold mb-2 text-foreground">Troubleshooting Steps:</p>
              <ul className="list-inside list-disc space-y-1 ml-2">
                {troubleshootingSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            {!navigator.onLine && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-destructive font-semibold">⚠️ No Internet Connection</p>
                <p className="text-sm mt-1">Please check your network connection and try again.</p>
              </div>
            )}

            {(error?.message?.toLowerCase().includes('backend') || 
              error?.message?.toLowerCase().includes('canister') ||
              error?.message?.toLowerCase().includes('actor')) && (
              <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                <p className="text-orange-600 dark:text-orange-400 font-semibold">🔧 Backend Connection Issue</p>
                <p className="text-sm mt-1">
                  The application cannot connect to the backend canister. This usually means:
                </p>
                <ul className="text-sm mt-2 ml-4 list-disc space-y-1">
                  <li>The canister is not deployed or not running</li>
                  <li>The canister has run out of cycles</li>
                  <li>There's a network connectivity issue to the Internet Computer</li>
                  <li>The canister is experiencing high load (HTTP 503 errors)</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onReload} className="flex-1 w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Application
          </Button>
          <Button onClick={copyErrorDetails} variant="outline" className="w-full sm:w-auto">
            <Copy className="mr-2 h-4 w-4" />
            Copy Error Details
          </Button>
          {isDevelopment && (
            <Button
              onClick={() => window.open('https://dashboard.internetcomputer.org/', '_blank')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              IC Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

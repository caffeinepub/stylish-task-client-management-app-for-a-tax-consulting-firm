import { ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Copy, ExternalLink } from 'lucide-react';
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

  // Categorize error type
  const getErrorCategory = () => {
    const message = error?.message?.toLowerCase() || '';
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network Error';
    }
    if (message.includes('auth') || message.includes('identity')) {
      return 'Authentication Error';
    }
    if (message.includes('actor') || message.includes('canister')) {
      return 'Backend Connection Error';
    }
    if (message.includes('router') || message.includes('route')) {
      return 'Navigation Error';
    }
    return 'Application Error';
  };

  const errorCategory = getErrorCategory();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
            <div>
              <CardTitle>Application Failed to Start</CardTitle>
              <CardDescription>
                {errorCategory}: An unexpected error occurred during initialization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-muted p-4">
              <p className="font-semibold text-sm mb-1">{errorCategory}</p>
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
              <p className="font-semibold mb-2">Troubleshooting Steps:</p>
              <ul className="list-inside list-disc space-y-1 ml-2">
                <li>Click "Reload Application" below to restart with a clean state</li>
                <li>Check your internet connection</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try using a different browser or incognito mode</li>
                <li>If the problem persists, contact support with the error details</li>
              </ul>
            </div>

            {!navigator.onLine && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-destructive font-semibold">⚠️ No Internet Connection</p>
                <p className="text-sm mt-1">Please check your network connection and try again.</p>
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
              onClick={() => window.open('https://console.cloud.google.com', '_blank')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Console
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

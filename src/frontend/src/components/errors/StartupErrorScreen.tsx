import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function StartupErrorScreen() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-3 text-foreground">
          Something went wrong
        </h1>
        
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error while loading the application. 
          Please try reloading the page.
        </p>
        
        <Button onClick={handleReload} size="lg">
          Reload Page
        </Button>
      </div>
    </div>
  );
}

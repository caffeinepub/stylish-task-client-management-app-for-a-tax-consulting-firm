/**
 * Comprehensive asset loading diagnostics utility with enhanced HTTP 503 detection
 * Provides detailed logging and error categorization for asset serving issues
 */

export interface AssetLoadError {
  url: string;
  status?: number;
  statusText?: string;
  timestamp: number;
  errorType: 'network' | 'http' | 'timeout' | 'http503' | 'unknown';
  headers?: Record<string, string>;
  timing?: {
    duration: number;
    startTime: number;
  };
  responseBody?: string;
}

export interface DiagnosticReport {
  errors: AssetLoadError[];
  environment: {
    userAgent: string;
    url: string;
    timestamp: number;
    online: boolean;
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
  };
  canisterInfo?: {
    canisterId?: string;
    domain: string;
  };
  http503Summary?: {
    count: number;
    urls: string[];
    firstOccurrence?: number;
    lastOccurrence?: number;
  };
}

class AssetLoadingDiagnostics {
  private errors: AssetLoadError[] = [];
  private startTime = Date.now();
  private http503Count = 0;

  constructor() {
    this.setupGlobalErrorHandlers();
    this.logEnvironmentInfo();
  }

  private setupGlobalErrorHandlers() {
    // Capture script loading errors
    window.addEventListener('error', (event) => {
      if (event.target instanceof HTMLScriptElement) {
        const script = event.target as HTMLScriptElement;
        this.logAssetError({
          url: script.src,
          errorType: 'network',
          timestamp: Date.now(),
        });
      }
    }, true);

    // Capture fetch errors with enhanced HTTP 503 detection
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        // Log failed asset requests with special handling for HTTP 503
        if (!response.ok && this.isAssetRequest(args[0])) {
          const headers: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });

          // Try to read response body for additional context
          let responseBody: string | undefined;
          try {
            const clonedResponse = response.clone();
            responseBody = await clonedResponse.text();
            responseBody = responseBody.substring(0, 500); // Limit size
          } catch (e) {
            responseBody = undefined;
          }

          const errorType = response.status === 503 ? 'http503' : this.categorizeHttpError(response.status);
          
          if (response.status === 503) {
            this.http503Count++;
          }

          this.logAssetError({
            url: this.getUrlFromRequestInfo(args[0]),
            status: response.status,
            statusText: response.statusText,
            errorType,
            timestamp: Date.now(),
            headers,
            timing: {
              duration,
              startTime,
            },
            responseBody,
          });
        }

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        if (this.isAssetRequest(args[0])) {
          this.logAssetError({
            url: this.getUrlFromRequestInfo(args[0]),
            errorType: 'network',
            timestamp: Date.now(),
            timing: {
              duration,
              startTime,
            },
          });
        }
        
        throw error;
      }
    };
  }

  private getUrlFromRequestInfo(input: RequestInfo | URL): string {
    if (typeof input === 'string') {
      return input;
    } else if (input instanceof URL) {
      return input.href;
    } else {
      return input.url;
    }
  }

  private isAssetRequest(input: RequestInfo | URL): boolean {
    const url = this.getUrlFromRequestInfo(input);
    return url.includes('/_app/') || 
           url.includes('/assets/') || 
           url.endsWith('.js') || 
           url.endsWith('.css') ||
           url.endsWith('.mjs') ||
           url.includes('/src/');
  }

  private categorizeHttpError(status: number): 'network' | 'http' | 'timeout' | 'http503' | 'unknown' {
    if (status === 503) return 'http503'; // Service Unavailable - special category
    if (status === 404) return 'http'; // Not Found
    if (status === 500) return 'http'; // Internal Server Error
    if (status === 502) return 'http'; // Bad Gateway
    if (status === 504) return 'timeout'; // Gateway Timeout
    if (status >= 400 && status < 500) return 'http'; // Client errors
    if (status >= 500) return 'http'; // Server errors
    return 'unknown';
  }

  private logEnvironmentInfo() {
    console.group('🔍 [Asset Diagnostics] Environment Information');
    console.log('User Agent:', navigator.userAgent);
    console.log('Current URL:', window.location.href);
    console.log('Online Status:', navigator.onLine);
    console.log('Timestamp:', new Date().toISOString());
    
    // Connection information if available
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      console.log('Connection:', {
        effectiveType: conn?.effectiveType,
        downlink: conn?.downlink,
        rtt: conn?.rtt,
        saveData: conn?.saveData
      });
    }
    
    // Extract canister information from URL
    const canisterMatch = window.location.hostname.match(/^([a-z0-9-]+)\.(ic0\.app|icp0\.io|localhost)/);
    if (canisterMatch) {
      console.log('Canister ID:', canisterMatch[1]);
      console.log('Domain:', canisterMatch[2]);
    }
    
    console.groupEnd();
  }

  public logAssetError(error: AssetLoadError) {
    this.errors.push(error);

    const isHttp503 = error.status === 503 || error.errorType === 'http503';
    const groupLabel = isHttp503 
      ? `🚨 [Asset Load Error] HTTP 503 SERVICE UNAVAILABLE (#${this.http503Count})`
      : `❌ [Asset Load Error] ${error.errorType.toUpperCase()}`;

    console.group(groupLabel);
    console.error('URL:', error.url);
    console.error('Status:', error.status || 'N/A');
    console.error('Status Text:', error.statusText || 'N/A');
    console.error('Timestamp:', new Date(error.timestamp).toISOString());
    console.error('Elapsed since page load:', (error.timestamp - this.startTime) + 'ms');
    
    if (error.timing) {
      console.error('Request Duration:', `${error.timing.duration.toFixed(2)}ms`);
    }
    
    if (error.headers) {
      console.error('Response Headers:', error.headers);
      
      // Highlight IC-specific headers
      if (error.headers['x-ic-canister-id']) {
        console.error('IC Canister ID:', error.headers['x-ic-canister-id']);
      }
      if (error.headers['x-ic-subnet-id']) {
        console.error('IC Subnet ID:', error.headers['x-ic-subnet-id']);
      }
    }

    if (error.responseBody) {
      console.error('Response Body Preview:', error.responseBody);
    }

    // Provide actionable guidance
    this.logTroubleshootingGuidance(error);
    
    console.groupEnd();
  }

  private logTroubleshootingGuidance(error: AssetLoadError) {
    console.group('💡 Troubleshooting Guidance');

    if (error.status === 503 || error.errorType === 'http503') {
      console.warn('🚨 HTTP 503 SERVICE UNAVAILABLE - CRITICAL ISSUE');
      console.warn('');
      console.warn('The asset canister is unable to serve this request.');
      console.warn('');
      console.warn('IMMEDIATE ACTIONS:');
      console.warn('  1. Check canister cycles balance:');
      console.warn('     dfx canister status <canister-id>');
      console.warn('');
      console.warn('  2. Verify canister is running:');
      console.warn('     dfx canister info <canister-id>');
      console.warn('');
      console.warn('  3. Check if asset exists in canister:');
      console.warn('     dfx canister call <canister-id> list');
      console.warn('');
      console.warn('  4. Review deployment logs for errors');
      console.warn('');
      console.warn('  5. Verify .ic-assets.json5 configuration');
      console.warn('');
      console.warn('COMMON CAUSES:');
      console.warn('  • Canister out of cycles (most common)');
      console.warn('  • Asset not uploaded during deployment');
      console.warn('  • Canister being upgraded/restarted');
      console.warn('  • Asset canister overloaded');
      console.warn('  • Incorrect asset canister configuration');
      console.warn('');
      console.warn('NEXT STEPS:');
      console.warn('  1. Top up canister cycles if low');
      console.warn('  2. Redeploy frontend: dfx deploy frontend');
      console.warn('  3. Check build output matches deployment');
    } else if (error.status === 404) {
      console.warn('HTTP 404 Not Found detected:');
      console.warn('• The requested asset does not exist in the canister');
      console.warn('• Verify Vite build output matches expected paths');
      console.warn('• Check if asset was uploaded during deployment');
      console.warn('• Review build configuration in vite.config.ts');
      console.warn('• Verify asset path in .ic-assets.json5');
    } else if (error.errorType === 'network') {
      console.warn('Network error detected:');
      console.warn('• Check internet connectivity');
      console.warn('• Verify canister is accessible');
      console.warn('• Check browser console for CORS errors');
      console.warn('• Try accessing the canister URL directly');
      console.warn('• Check if firewall is blocking requests');
    } else if (error.errorType === 'timeout') {
      console.warn('Timeout error detected:');
      console.warn('• The request took too long to complete');
      console.warn('• Canister may be under heavy load');
      console.warn('• Network connection may be slow or unstable');
      console.warn('• Consider increasing timeout limits');
    }

    console.groupEnd();
  }

  public generateReport(): DiagnosticReport {
    const canisterMatch = window.location.hostname.match(/^([a-z0-9-]+)\.(ic0\.app|icp0\.io|localhost)/);
    
    const http503Errors = this.errors.filter(e => e.status === 503 || e.errorType === 'http503');
    const http503Summary = http503Errors.length > 0 ? {
      count: http503Errors.length,
      urls: http503Errors.map(e => e.url),
      firstOccurrence: http503Errors[0]?.timestamp,
      lastOccurrence: http503Errors[http503Errors.length - 1]?.timestamp,
    } : undefined;

    const conn = 'connection' in navigator ? (navigator as any).connection : undefined;
    
    return {
      errors: this.errors,
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        online: navigator.onLine,
        connection: conn ? {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
        } : undefined,
      },
      canisterInfo: canisterMatch ? {
        canisterId: canisterMatch[1],
        domain: canisterMatch[2],
      } : undefined,
      http503Summary,
    };
  }

  public logSummary() {
    if (this.errors.length === 0) {
      console.log('✅ [Asset Diagnostics] No asset loading errors detected');
      return;
    }

    console.group(`⚠️ [Asset Diagnostics] Summary: ${this.errors.length} error(s) detected`);
    
    // Group errors by type
    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.errorType] = (acc[error.errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Errors by type:', errorsByType);
    
    // Group errors by status code
    const errorsByStatus = this.errors.reduce((acc, error) => {
      const status = error.status?.toString() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Errors by status code:', errorsByStatus);
    
    // Special handling for HTTP 503 errors
    if (this.http503Count > 0) {
      console.group('🚨 HTTP 503 SERVICE UNAVAILABLE ERRORS');
      console.error('Total HTTP 503 errors:', this.http503Count);
      console.error('This is a CRITICAL issue indicating the asset canister cannot serve requests');
      
      const http503Errors = this.errors.filter(e => e.status === 503);
      console.error('Failed URLs:');
      http503Errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error.url}`);
      });
      
      console.error('');
      console.error('REQUIRED ACTIONS:');
      console.error('  1. Check canister cycles immediately');
      console.error('  2. Verify canister deployment status');
      console.error('  3. Review asset canister configuration');
      console.error('  4. Check deployment logs for errors');
      console.groupEnd();
    }
    
    // List all failed URLs
    console.log('All failed URLs:');
    this.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.url} (${error.status || 'N/A'}) [${error.errorType}]`);
    });

    console.groupEnd();
  }

  public copyReportToClipboard() {
    const report = this.generateReport();
    const reportText = JSON.stringify(report, null, 2);
    
    navigator.clipboard.writeText(reportText).then(() => {
      console.log('✅ Diagnostic report copied to clipboard');
    }).catch((err) => {
      console.error('❌ Failed to copy report to clipboard:', err);
      console.log('Report:', reportText);
    });
  }

  public getHttp503Count(): number {
    return this.http503Count;
  }
}

// Create singleton instance
export const assetDiagnostics = new AssetLoadingDiagnostics();

// Expose to window for manual debugging
if (typeof window !== 'undefined') {
  (window as any).__assetDiagnostics = assetDiagnostics;
  console.log('[Asset Diagnostics] 💾 Diagnostic utility available at window.__assetDiagnostics');
  console.log('[Asset Diagnostics] 📋 Use window.__assetDiagnostics.copyReportToClipboard() to copy full report');
}

// Log summary after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    assetDiagnostics.logSummary();
    
    // If HTTP 503 errors detected, provide additional guidance
    if (assetDiagnostics.getHttp503Count() > 0) {
      console.group('🚨 [Asset Diagnostics] HTTP 503 CRITICAL ALERT');
      console.error('Your application is experiencing HTTP 503 Service Unavailable errors.');
      console.error('This prevents JavaScript modules from loading and breaks the application.');
      console.error('');
      console.error('To diagnose and fix:');
      console.error('  1. Copy diagnostic report: window.__assetDiagnostics.copyReportToClipboard()');
      console.error('  2. Check canister status: dfx canister status <canister-id>');
      console.error('  3. Review deployment logs for errors');
      console.error('  4. Verify asset canister configuration');
      console.groupEnd();
    }
  }, 2000);
});

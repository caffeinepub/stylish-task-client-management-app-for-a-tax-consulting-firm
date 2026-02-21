/**
 * Comprehensive asset loading diagnostics utility with enhanced HTTP 503 detection
 * and actor initialization failure tracking
 */

export interface AssetLoadError {
  url: string;
  status?: number;
  statusText?: string;
  timestamp: number;
  errorType: 'network' | 'http' | 'timeout' | 'http503' | 'actor' | 'unknown';
  headers?: Record<string, string>;
  timing?: {
    duration: number;
    startTime: number;
  };
  responseBody?: string;
  errorMessage?: string;
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
  actorErrors?: {
    count: number;
    messages: string[];
    firstOccurrence?: number;
    lastOccurrence?: number;
  };
}

class AssetLoadingDiagnostics {
  private errors: AssetLoadError[] = [];
  private startTime = Date.now();
  private http503Count = 0;
  private actorErrorCount = 0;

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

          const errorType = response.status === 503 ? 'http503' : 'http';
          
          if (response.status === 503) {
            this.http503Count++;
            console.error('🚨 [AssetDiagnostics] HTTP 503 Service Unavailable detected:', {
              url: this.getUrlString(args[0]),
              status: response.status,
              statusText: response.statusText,
              headers,
              duration: `${duration.toFixed(2)}ms`,
              canisterId: headers['x-ic-canister-id'],
              nodeId: headers['x-ic-node-id'],
              subnetId: headers['x-ic-subnet-id'],
            });
          }

          this.logAssetError({
            url: this.getUrlString(args[0]),
            status: response.status,
            statusText: response.statusText,
            errorType,
            timestamp: Date.now(),
            headers,
            timing: {
              duration,
              startTime,
            },
          });
        }

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        if (this.isAssetRequest(args[0])) {
          this.logAssetError({
            url: this.getUrlString(args[0]),
            errorType: 'network',
            timestamp: Date.now(),
            timing: {
              duration,
              startTime,
            },
            errorMessage: error instanceof Error ? error.message : String(error),
          });
        }
        throw error;
      }
    };
  }

  private logEnvironmentInfo() {
    console.group('🌍 [AssetDiagnostics] Environment Information');
    console.log('User Agent:', navigator.userAgent);
    console.log('URL:', window.location.href);
    console.log('Online:', navigator.onLine);
    console.log('Platform:', navigator.platform);
    console.log('Language:', navigator.language);
    
    // Network information if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      console.log('Connection:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      });
    }
    
    console.groupEnd();
  }

  private isAssetRequest(input: RequestInfo | URL): boolean {
    const url = this.getUrlString(input);
    // Consider requests to .js, .css, .wasm, .json, and other static assets
    return /\.(js|mjs|css|wasm|json|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?|$)/i.test(url);
  }

  private getUrlString(input: RequestInfo | URL): string {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.href;
    if (input instanceof Request) return input.url;
    return String(input);
  }

  public logAssetError(error: Omit<AssetLoadError, 'timestamp'> & { timestamp?: number }) {
    const fullError: AssetLoadError = {
      ...error,
      timestamp: error.timestamp || Date.now(),
    };
    
    this.errors.push(fullError);
    
    console.error('❌ [AssetDiagnostics] Asset loading error:', {
      url: fullError.url,
      status: fullError.status,
      errorType: fullError.errorType,
      duration: fullError.timing?.duration ? `${fullError.timing.duration.toFixed(2)}ms` : 'N/A',
    });
  }

  public logActorError(error: Error | string, context?: Record<string, any>) {
    this.actorErrorCount++;
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    this.errors.push({
      url: 'actor-initialization',
      errorType: 'actor',
      timestamp: Date.now(),
      errorMessage,
    });

    console.error('❌ [AssetDiagnostics] Actor initialization error:', {
      error: errorMessage,
      count: this.actorErrorCount,
      context,
    });
  }

  public generateReport(): DiagnosticReport {
    const http503Errors = this.errors.filter(e => e.errorType === 'http503');
    const actorErrors = this.errors.filter(e => e.errorType === 'actor');
    
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    const report: DiagnosticReport = {
      errors: this.errors,
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        online: navigator.onLine,
        connection: connection ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        } : undefined,
      },
      canisterInfo: this.extractCanisterInfo(),
    };

    if (http503Errors.length > 0) {
      report.http503Summary = {
        count: http503Errors.length,
        urls: [...new Set(http503Errors.map(e => e.url))],
        firstOccurrence: Math.min(...http503Errors.map(e => e.timestamp)),
        lastOccurrence: Math.max(...http503Errors.map(e => e.timestamp)),
      };
    }

    if (actorErrors.length > 0) {
      report.actorErrors = {
        count: actorErrors.length,
        messages: [...new Set(actorErrors.map(e => e.errorMessage || 'Unknown error'))],
        firstOccurrence: Math.min(...actorErrors.map(e => e.timestamp)),
        lastOccurrence: Math.max(...actorErrors.map(e => e.timestamp)),
      };
    }

    return report;
  }

  private extractCanisterInfo() {
    const hostname = window.location.hostname;
    const canisterIdMatch = hostname.match(/^([a-z0-9-]+)\.(?:ic0\.app|icp0\.io|localhost)/);
    
    return {
      canisterId: canisterIdMatch ? canisterIdMatch[1] : undefined,
      domain: hostname,
    };
  }

  public exportToClipboard() {
    const report = this.generateReport();
    const formatted = JSON.stringify(report, null, 2);
    
    navigator.clipboard.writeText(formatted).then(() => {
      console.log('📋 [AssetDiagnostics] Report copied to clipboard');
    }).catch(err => {
      console.error('❌ [AssetDiagnostics] Failed to copy report:', err);
    });
  }

  public getErrorCount(): number {
    return this.errors.length;
  }

  public getHttp503Count(): number {
    return this.http503Count;
  }

  public getActorErrorCount(): number {
    return this.actorErrorCount;
  }
}

// Global singleton instance
export const assetDiagnostics = new AssetLoadingDiagnostics();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).assetDiagnostics = assetDiagnostics;
}

import { StrictMode, useEffect, useState } from 'react';
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import TasksPage from './pages/TasksPage';
import AssigneesPage from './pages/AssigneesPage';
import TodosPage from './pages/TodosPage';
import SignedOutScreen from './components/auth/SignedOutScreen';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { AppStartupErrorBoundary } from './components/errors/AppStartupErrorBoundary';
import { useDeferredUrlCleanup } from './hooks/useDeferredUrlCleanup';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { assetDiagnostics } from './utils/assetLoadingDiagnostics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

// Root component that handles authentication and profile setup
function RootComponent() {
  const { identity, isInitializing: authInitializing, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
    error: profileError,
  } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  // Enhanced loading timeout detection with comprehensive diagnostics including HTTP 503 detection
  const [loadingStartTime] = useState(Date.now());
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed > 30000 && !timeoutTriggered) {
        setTimeoutTriggered(true);
        
        console.error('⏱️ [App] LOADING TIMEOUT DETECTED - Generating diagnostic report...');
        console.group('🔍 Diagnostic Report');
        
        // Authentication state
        console.log('🔐 Authentication State:', {
          isAuthenticated,
          authInitializing,
          loginStatus,
          hasIdentity: !!identity,
          principal: identity?.getPrincipal().toString(),
        });
        
        // Actor state
        console.log('🎬 Actor State:', {
          hasActor: !!actor,
          actorFetching,
        });
        
        // Profile state
        console.log('👤 Profile State:', {
          profileLoading,
          profileFetched,
          hasProfile: !!userProfile,
          profileError: profileError ? String(profileError) : null,
        });
        
        // React Query state
        const queryCache = queryClient.getQueryCache();
        const allQueries = queryCache.getAll();
        console.log('📊 React Query State:', {
          totalQueries: allQueries.length,
          pendingQueries: allQueries.filter(q => q.state.status === 'pending').map(q => ({
            queryKey: q.queryKey,
            status: q.state.status,
            fetchStatus: q.state.fetchStatus,
          })),
          errorQueries: allQueries.filter(q => q.state.status === 'error').map(q => ({
            queryKey: q.queryKey,
            error: String(q.state.error),
          })),
        });
        
        // Router state
        console.log('🛣️ Router State:', {
          currentPath: window.location.pathname,
          currentHash: window.location.hash,
        });
        
        // Asset loading diagnostics
        const assetReport = assetDiagnostics.generateReport();
        console.log('📦 Asset Loading State:', {
          totalErrors: assetReport.errors.length,
          http503Errors: assetReport.http503Summary?.count || 0,
          failedUrls: assetReport.errors.map(e => ({ url: e.url, status: e.status, type: e.errorType })),
        });
        
        if (assetReport.http503Summary && assetReport.http503Summary.count > 0) {
          console.error('🚨 HTTP 503 ERRORS DETECTED:');
          console.error('Count:', assetReport.http503Summary.count);
          console.error('URLs:', assetReport.http503Summary.urls);
          console.error('This indicates the asset canister is unable to serve requests!');
        }
        
        // Environment info
        console.log('🌍 Environment:', {
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          timestamp: new Date().toISOString(),
          canisterInfo: assetReport.canisterInfo,
        });
        
        console.groupEnd();
        console.error('⏱️ [App] Loading timeout diagnostic report complete');
        
        // Provide actionable guidance
        if (assetReport.http503Summary && assetReport.http503Summary.count > 0) {
          console.group('💡 [App] Recommended Actions for HTTP 503 Errors');
          console.warn('1. Check canister cycles: dfx canister status <canister-id>');
          console.warn('2. Verify deployment: dfx canister info <canister-id>');
          console.warn('3. Redeploy frontend: dfx deploy frontend');
          console.warn('4. Check .ic-assets.json5 configuration');
          console.warn('5. Review build output: ls -la dist/');
          console.groupEnd();
        }
      }
    }, 30000);

    return () => clearTimeout(timeoutId);
  }, [
    loadingStartTime,
    timeoutTriggered,
    isAuthenticated,
    authInitializing,
    loginStatus,
    identity,
    actor,
    actorFetching,
    profileLoading,
    profileFetched,
    userProfile,
    profileError,
    queryClient,
  ]);

  // Clean up URL parameters
  useDeferredUrlCleanup();

  console.log('🎨 [RootComponent] Render decision point:', {
    authInitializing,
    isAuthenticated,
    actorFetching,
    hasActor: !!actor,
    profileLoading,
    profileFetched,
    hasProfile: !!userProfile,
    showProfileSetup: isAuthenticated && !profileLoading && profileFetched && userProfile === null,
  });

  // Show auth initialization screen
  if (authInitializing) {
    console.log('🔄 [RootComponent] Showing auth initialization screen');
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Show signed out screen for unauthenticated users
  if (!isAuthenticated) {
    console.log('🚪 [RootComponent] Showing signed out screen');
    return <SignedOutScreen />;
  }

  // Show actor loading screen
  if (actorFetching || !actor) {
    console.log('🎬 [RootComponent] Waiting for actor...', { actorFetching, hasActor: !!actor });
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  // Show profile loading screen (only if we're still loading and haven't fetched yet)
  if (profileLoading && !profileFetched) {
    console.log('👤 [RootComponent] Loading user profile...');
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show profile error screen (treat as missing profile)
  const showProfileSetup = profileFetched && (userProfile === null || profileError);

  console.log('✅ [RootComponent] Rendering authenticated layout', {
    hasProfile: !!userProfile,
    showProfileSetup,
  });

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

// Create routes
const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: ClientsPage,
});

const clientDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/$clientId',
  component: ClientDetailPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
});

const assigneesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assignees',
  component: AssigneesPage,
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos',
  component: TodosPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  clientsRoute,
  clientDetailRoute,
  tasksRoute,
  assigneesRoute,
  todosRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  console.log('🎬 [App] Creating route tree');
  console.log('🎬 [App] Creating router');
  console.log('🎬 [App] Router created successfully');

  return (
    <StrictMode>
      <AppStartupErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </AppStartupErrorBoundary>
    </StrictMode>
  );
}

export default App;

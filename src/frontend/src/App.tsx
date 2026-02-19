import { StrictMode, useEffect, useState } from 'react';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import TasksPage from './pages/TasksPage';
import AssigneesPage from './pages/AssigneesPage';
import TodosPage from './pages/TodosPage';
import AppLayout from './components/layout/AppLayout';
import SignedOutScreen from './components/auth/SignedOutScreen';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { useDeferredUrlCleanup } from './hooks/useDeferredUrlCleanup';
import { AppStartupErrorBoundary } from './components/errors/AppStartupErrorBoundary';

function RootComponent() {
  console.log('[RootComponent] Rendering');
  useDeferredUrlCleanup();

  const { identity, isInitializing: authInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  useEffect(() => {
    console.log('[RootComponent] Auth state:', { 
      isAuthenticated, 
      authInitializing,
      principalId: identity?.getPrincipal().toString() 
    });
  }, [isAuthenticated, authInitializing, identity]);

  useEffect(() => {
    console.log('[RootComponent] Profile state:', { 
      userProfile, 
      profileLoading, 
      isFetched 
    });
  }, [userProfile, profileLoading, isFetched]);

  // Show loading only during initial auth check
  if (authInitializing) {
    console.log('[RootComponent] Showing auth initialization screen');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[RootComponent] User not authenticated, showing SignedOutScreen');
    return <SignedOutScreen />;
  }

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;
  console.log('[RootComponent] Rendering authenticated layout', { showProfileSetup });

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

// Create routes with defensive search validation
const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
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
  validateSearch: (search: Record<string, unknown>) => {
    try {
      return {
        clientName: typeof search.clientName === 'string' ? search.clientName : undefined,
        taskCategory: typeof search.taskCategory === 'string' ? search.taskCategory : undefined,
        subCategory: typeof search.subCategory === 'string' ? search.subCategory : undefined,
        assignedName: typeof search.assignedName === 'string' ? search.assignedName : undefined,
        status: typeof search.status === 'string' ? search.status : undefined,
      };
    } catch (error) {
      console.error('[TasksRoute] Search validation error:', error);
      return {};
    }
  },
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

console.log('[App] Creating route tree');
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  clientsRoute,
  clientDetailRoute,
  tasksRoute,
  assigneesRoute,
  todosRoute,
]);

console.log('[App] Creating router');
const router = createRouter({ routeTree });
console.log('[App] Router created successfully');

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    console.log('[App] Component mounted');
    
    // Set a timeout to detect if the app is stuck loading
    const timeoutId = setTimeout(() => {
      console.error('[App] Loading timeout - app may be stuck');
      setLoadingTimeout(true);
    }, 10000);

    return () => {
      console.log('[App] Component unmounting');
      clearTimeout(timeoutId);
    };
  }, []);

  if (loadingTimeout) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Loading Timeout</h1>
          <p className="text-muted-foreground mb-4">
            The application is taking longer than expected to load. Please check the console for errors.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <StrictMode>
      <AppStartupErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </AppStartupErrorBoundary>
    </StrictMode>
  );
}

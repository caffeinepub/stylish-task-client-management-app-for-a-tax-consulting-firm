import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { useDeferredUrlCleanup } from './hooks/useDeferredUrlCleanup';
import AppLayout from './components/layout/AppLayout';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import TasksPage from './pages/TasksPage';
import AssigneesPage from './pages/AssigneesPage';
import TodosPage from './pages/TodosPage';
import SignedOutScreen from './components/auth/SignedOutScreen';
import AppStartupErrorBoundary from './components/errors/AppStartupErrorBoundary';
import StartupErrorScreen from './components/errors/StartupErrorScreen';

// Root route component
function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  // Perform deferred URL cleanup in post-mount effect
  useDeferredUrlCleanup();

  const isAuthenticated = !!identity;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(0.50_0.08_130)] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignedOutScreen />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AppLayout>
      <Outlet />
      {showProfileSetup && <ProfileSetupModal />}
    </AppLayout>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: RootComponent,
  errorComponent: StartupErrorScreen,
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
  validateSearch: (search: Record<string, unknown>): { overdue?: string; status?: string; taskCategory?: string; subCategory?: string } => {
    // Defensive normalization: only accept expected string values
    const result: { overdue?: string; status?: string; taskCategory?: string; subCategory?: string } = {};

    // Only accept string primitives, ignore arrays/objects/unexpected types
    if (typeof search.overdue === 'string' && search.overdue.length > 0) {
      result.overdue = search.overdue;
    }

    if (typeof search.status === 'string' && search.status.length > 0) {
      result.status = search.status;
    }

    if (typeof search.taskCategory === 'string' && search.taskCategory.length > 0) {
      result.taskCategory = search.taskCategory;
    }

    if (typeof search.subCategory === 'string' && search.subCategory.length > 0) {
      result.subCategory = search.subCategory;
    }

    return result;
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

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  clientsRoute,
  clientDetailRoute,
  tasksRoute,
  assigneesRoute,
  todosRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppStartupErrorBoundary>
      <RouterProvider router={router} />
    </AppStartupErrorBoundary>
  );
}

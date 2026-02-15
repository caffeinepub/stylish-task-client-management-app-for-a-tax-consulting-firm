import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AppLayout from './components/layout/AppLayout';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import TasksPage from './pages/TasksPage';
import SignedOutScreen from './components/auth/SignedOutScreen';

// Root route component
function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <SignedOutScreen />;
  }

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Dashboard route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// Clients routes
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

// Tasks route
const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  clientsRoute,
  clientDetailRoute,
  tasksRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

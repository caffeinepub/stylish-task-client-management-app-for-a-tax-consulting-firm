import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect, useState } from "react";
import ProfileSetupModal from "./components/auth/ProfileSetupModal";
import SignedOutScreen from "./components/auth/SignedOutScreen";
import { AppStartupErrorBoundary } from "./components/errors/AppStartupErrorBoundary";
import { StartupErrorScreen } from "./components/errors/StartupErrorScreen";
import AppLayout from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import { useActor } from "./hooks/useActor";
import { useGetCallerUserProfile } from "./hooks/useCurrentUserProfile";
import { useDeferredUrlCleanup } from "./hooks/useDeferredUrlCleanup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// Lazy-load pages to reduce initial bundle parse time
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AssigneesPage = lazy(() => import("./pages/AssigneesPage"));
const ClientDetailPage = lazy(() => import("./pages/ClientDetailPage"));
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const PublicAssigneeSearchPage = lazy(
  () => import("./pages/PublicAssigneeSearchPage"),
);
const TaskTypesPage = lazy(() => import("./pages/TaskTypesPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const TodosPage = lazy(() => import("./pages/TodosPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

const PageLoader = () => (
  <div className="flex h-full items-center justify-center py-20">
    <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
  </div>
);

function RootComponent() {
  const { identity, isInitializing: authInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const [loadingStartTime] = useState(Date.now());
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed > 25000 && !actor && isAuthenticated) {
        setShowTimeoutError(true);
      }
    }, 25000);
    return () => clearTimeout(timeoutId);
  }, [loadingStartTime, actor, isAuthenticated]);

  useDeferredUrlCleanup();

  if (showTimeoutError && !actor) {
    const timeoutError = new Error(
      "Backend connection timeout: Unable to connect to the backend canister after 25 seconds",
    );
    return (
      <StartupErrorScreen
        error={timeoutError}
        errorInfo={null}
        onReload={() => {
          queryClient.clear();
          window.location.reload();
        }}
      />
    );
  }

  if (authInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground">
            Initializing authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignedOutScreen />;
  }

  if (actorFetching || !actor) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground mb-2">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  if (profileLoading && !profileFetched) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  return (
    <>
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AppLayout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const publicSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/public-search",
  component: PublicAssigneeSearchPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients",
  component: ClientsPage,
});

const clientDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients/$clientId",
  component: ClientDetailPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: TasksPage,
});

const taskTypesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/task-types",
  component: TaskTypesPage,
});

const assigneesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assignees",
  component: AssigneesPage,
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/todos",
  component: TodosPage,
});

const routeTree = rootRoute.addChildren([
  publicSearchRoute,
  indexRoute,
  clientsRoute,
  clientDetailRoute,
  tasksRoute,
  taskTypesRoute,
  assigneesRoute,
  todosRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <AppStartupErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AppStartupErrorBoundary>
  );
}

export default App;

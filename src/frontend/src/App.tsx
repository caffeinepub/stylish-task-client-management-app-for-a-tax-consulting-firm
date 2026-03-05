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
import { StrictMode, useEffect, useState } from "react";
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
import AssigneesPage from "./pages/AssigneesPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ClientsPage from "./pages/ClientsPage";
import DashboardPage from "./pages/DashboardPage";
import PublicAssigneeSearchPage from "./pages/PublicAssigneeSearchPage";
import TaskTypesPage from "./pages/TaskTypesPage";
import TasksPage from "./pages/TasksPage";
import TodosPage from "./pages/TodosPage";
import { assetDiagnostics } from "./utils/assetLoadingDiagnostics";

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
  const {
    identity,
    isInitializing: authInitializing,
    loginStatus,
  } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
    error: profileError,
  } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  // Enhanced loading timeout detection with comprehensive diagnostics
  const [loadingStartTime] = useState(Date.now());
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  useEffect(() => {
    // Use 20s timeout (down from 30s) to surface errors faster
    const timeoutId = setTimeout(() => {
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed > 20000 && !timeoutTriggered && !actor && isAuthenticated) {
        setTimeoutTriggered(true);

        console.error(
          "⏱️ [App] LOADING TIMEOUT DETECTED - Generating diagnostic report...",
        );
        console.group("🔍 Diagnostic Report");

        // Authentication state
        console.log("🔐 Authentication State:", {
          isAuthenticated,
          authInitializing,
          loginStatus,
          hasIdentity: !!identity,
          principal: identity?.getPrincipal().toString(),
        });

        // Actor state
        console.log("🎬 Actor State:", {
          hasActor: !!actor,
          actorFetching,
        });

        // Profile state
        console.log("👤 Profile State:", {
          profileLoading,
          profileFetched,
          hasProfile: !!userProfile,
          profileError: profileError ? String(profileError) : null,
        });

        // React Query state
        const queryCache = queryClient.getQueryCache();
        const allQueries = queryCache.getAll();
        console.log("📊 React Query State:", {
          totalQueries: allQueries.length,
          pendingQueries: allQueries
            .filter((q) => q.state.status === "pending")
            .map((q) => ({
              queryKey: q.queryKey,
              status: q.state.status,
              fetchStatus: q.state.fetchStatus,
            })),
          errorQueries: allQueries
            .filter((q) => q.state.status === "error")
            .map((q) => ({
              queryKey: q.queryKey,
              error: String(q.state.error),
            })),
        });

        // Asset loading diagnostics
        const assetReport = assetDiagnostics.generateReport();
        console.log("📦 Asset Loading State:", {
          totalErrors: assetReport.errors.length,
          http503Errors: assetReport.http503Summary?.count || 0,
          actorErrors: assetReport.actorErrors?.count || 0,
          failedUrls: assetReport.errors.map((e) => ({
            url: e.url,
            status: e.status,
            type: e.errorType,
          })),
        });

        if (
          assetReport.http503Summary &&
          assetReport.http503Summary.count > 0
        ) {
          console.error("🚨 HTTP 503 ERRORS DETECTED:");
          console.error("Count:", assetReport.http503Summary.count);
          console.error("URLs:", assetReport.http503Summary.urls);
          console.error(
            "This indicates the asset canister is unable to serve requests!",
          );
        }

        if (assetReport.actorErrors && assetReport.actorErrors.count > 0) {
          console.error("🚨 ACTOR INITIALIZATION ERRORS DETECTED:");
          console.error("Count:", assetReport.actorErrors.count);
          console.error("Messages:", assetReport.actorErrors.messages);
        }

        // Environment info
        console.log("🌍 Environment:", {
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          timestamp: new Date().toISOString(),
          canisterInfo: assetReport.canisterInfo,
        });

        console.groupEnd();
        console.error("⏱️ [App] Loading timeout diagnostic report complete");

        // Provide actionable guidance
        if (!actor && actorFetching) {
          console.group(
            "💡 [App] Recommended Actions for Actor Connection Issues",
          );
          console.warn(
            "1. Check backend canister status: dfx canister status backend",
          );
          console.warn("2. Verify backend deployment: dfx deploy backend");
          console.warn("3. Check canister cycles: dfx canister status --all");
          console.warn("4. Review backend logs for errors");
          console.warn("5. Verify network connectivity to Internet Computer");
          console.groupEnd();
        }

        // Show error screen after timeout
        setShowTimeoutError(true);
      }
    }, 20000);

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

  console.log("🎨 [RootComponent] Render decision point:", {
    authInitializing,
    isAuthenticated,
    actorFetching,
    hasActor: !!actor,
    profileLoading,
    profileFetched,
    hasProfile: !!userProfile,
    showProfileSetup:
      isAuthenticated &&
      !profileLoading &&
      profileFetched &&
      userProfile === null,
    showTimeoutError,
  });

  // Show timeout error screen
  if (showTimeoutError && !actor) {
    const timeoutError = new Error(
      "Backend connection timeout: Unable to connect to the backend canister after 30 seconds",
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

  // Show auth initialization screen
  if (authInitializing) {
    console.log("🔄 [RootComponent] Showing auth initialization screen");
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

  // Show signed out screen for unauthenticated users
  if (!isAuthenticated) {
    console.log("🚪 [RootComponent] Showing signed out screen");
    return <SignedOutScreen />;
  }

  // Show actor loading screen
  if (actorFetching || !actor) {
    console.log("🎬 [RootComponent] Waiting for actor...", {
      actorFetching,
      hasActor: !!actor,
    });
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground mb-2">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  // Show profile loading screen (only if we're still loading and haven't fetched yet)
  if (profileLoading && !profileFetched) {
    console.log("👤 [RootComponent] Loading user profile...");
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show profile setup modal following authorization component pattern
  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  console.log("✅ [RootComponent] Rendering authenticated layout", {
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

// Public route for assignee search (no authentication required)
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

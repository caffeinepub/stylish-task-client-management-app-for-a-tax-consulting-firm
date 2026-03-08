import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  UserCog,
  Users,
} from "lucide-react";
import { SiFacebook, SiLinkedin, SiX } from "react-icons/si";
import { useGetCallerUserProfile } from "../../hooks/useCurrentUserProfile";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const navItems = [
    { to: "/" as const, label: "Dashboard", icon: LayoutDashboard },
    { to: "/clients" as const, label: "Clients", icon: Users },
    { to: "/tasks" as const, label: "Tasks", icon: CheckSquare },
    { to: "/task-types" as const, label: "Task Types", icon: FolderKanban },
    { to: "/assignees" as const, label: "Assignees", icon: UserCog },
    { to: "/todos" as const, label: "Todos", icon: ListTodo },
  ];

  const isActive = (path: string) => currentPath === path;

  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-soft">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-01-25-at-8.23.55-AM-3-1.jpeg"
              alt="CSWA Group of Companies"
              className="h-9 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  className={[
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary/8 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side — avatar + mobile trigger */}
          <div className="flex items-center gap-3">
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  data-ocid="nav.user.button"
                  className="relative h-9 w-9 rounded-full p-0 ring-2 ring-accent/40 hover:ring-accent transition-all duration-200 focus-visible:ring-accent"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground font-display font-bold text-sm">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {userProfile?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Manage your account
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  data-ocid="nav.logout.button"
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-ocid="nav.mobile_menu.button"
                  className="rounded-lg"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="mb-6 mt-2">
                  <img
                    src="/assets/uploads/WhatsApp-Image-2026-01-25-at-8.23.55-AM-3-1.jpeg"
                    alt="CSWA Group of Companies"
                    className="h-8 object-contain"
                  />
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                        className={[
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                          active
                            ? "bg-primary/8 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile logout */}
                <div className="mt-auto pt-6 border-t border-border mt-8">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Log out
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">{children}</div>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CSWA Group of Companies. Built with ❤️
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <SiX className="h-3.5 w-3.5" />
              </span>
              <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <SiFacebook className="h-3.5 w-3.5" />
              </span>
              <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <SiLinkedin className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

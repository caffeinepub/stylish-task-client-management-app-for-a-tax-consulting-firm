import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LayoutDashboard, Users, CheckSquare, UserCheck } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/assignees', label: 'Assignees', icon: UserCheck },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              active
                ? 'bg-[oklch(0.50_0.08_130)] text-white dark:bg-[oklch(0.65_0.08_130)] dark:text-[oklch(0.15_0_0)]'
                : 'text-[oklch(0.35_0_0)] hover:bg-[oklch(0.95_0_0)] dark:text-[oklch(0.85_0_0)] dark:hover:bg-[oklch(0.25_0_0)]'
            }`}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  const userInitials = userProfile?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className="min-h-screen bg-[oklch(0.98_0_0)] dark:bg-[oklch(0.145_0_0)]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] bg-white/80 dark:bg-[oklch(0.20_0_0)]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/assets/generated/cswa-logo-new.dim_800x200.png" 
                alt="CSWA Group of Companies Logo" 
                className="h-9"
              />
              <span className="hidden sm:inline-block font-semibold text-lg text-[oklch(0.25_0_0)] dark:text-[oklch(0.95_0_0)]">
                CSWA Group of Companies
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2 ml-8">
              <NavLinks />
            </nav>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-[oklch(0.50_0.08_130)]">
                  <AvatarFallback className="bg-[oklch(0.50_0.08_130)] text-white dark:bg-[oklch(0.65_0.08_130)] dark:text-[oklch(0.15_0_0)]">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">Tax Consultant</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] mt-16 py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

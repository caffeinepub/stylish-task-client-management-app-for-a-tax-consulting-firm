import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LayoutDashboard, Users, CheckSquare, UserCircle, LogOut, ListTodo, UserCog } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si';

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
    navigate({ to: '/' });
  };

  const navItems = [
    { to: '/' as const, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/clients' as const, label: 'Clients', icon: Users },
    { to: '/tasks' as const, label: 'Tasks', icon: CheckSquare },
    { to: '/assignees' as const, label: 'Assignees', icon: UserCog },
    { to: '/todos' as const, label: 'Todos', icon: ListTodo },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-colors" />
                <img 
                  src="/assets/generated/cswa-logo-new.dim_800x200.png" 
                  alt="CSWA Logo" 
                  className="h-10 relative"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-glow-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                      {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{userProfile?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">Manage your account</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 border-l-2">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-glow-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Built with ❤️ using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 transition-colors underline"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiX className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiFacebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

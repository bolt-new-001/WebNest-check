import { useState, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Bell, 
  MessageSquare, 
  Home, 
  FolderOpen, 
  Clock, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  User,
  Briefcase
} from "lucide-react";

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

interface DeveloperLayoutProps {
  children: ReactNode;
}

export function DeveloperLayout({ children }: DeveloperLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { path: "/developer/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
    { path: "/developer/projects", label: "Projects", icon: <FolderOpen className="mr-2 h-4 w-4" /> },
    { path: "/developer/time-tracking", label: "Time Tracking", icon: <Clock className="mr-2 h-4 w-4" /> },
    { path: "/developer/earnings", label: "Earnings", icon: <DollarSign className="mr-2 h-4 w-4" /> },
    { path: "/developer/portfolio", label: "Portfolio", icon: <Briefcase className="mr-2 h-4 w-4" /> },
    { path: "/developer/chat", label: "Messages", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-64 flex-col border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/developer/dashboard" className="font-semibold text-xl">
            WebNest <span className="text-primary text-sm">Developer</span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 py-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2 px-4 rounded-md ${
                location.pathname.startsWith(item.path)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/developer/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/developer/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-16 flex items-center px-6 border-b">
            <Link to="/developer/dashboard" className="font-semibold text-xl">
              WebNest <span className="text-primary text-sm">Developer</span>
            </Link>
          </div>
          <div className="flex flex-col flex-1 py-4 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center py-2 px-4 rounded-md ${
                  location.pathname.startsWith(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Link
              to="/developer/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-2 px-4 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <Link
              to="/developer/settings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-2 px-4 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-4 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full text-left"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-6 justify-between">
          <div className="flex items-center md:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <span className="font-medium ml-3">WebNest Developer</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="ghost" size="icon" className="relative md:flex hidden">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DeveloperLayout;
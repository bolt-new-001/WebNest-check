import { useState, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Bell, 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  User,
  Code,
  Headphones
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

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="mr-2 h-4 w-4" /> },
    { path: "/admin/developers", label: "Developers", icon: <Code className="mr-2 h-4 w-4" /> },
    { path: "/admin/projects", label: "Projects", icon: <FolderOpen className="mr-2 h-4 w-4" /> },
    { path: "/admin/themes", label: "Themes", icon: <FileText className="mr-2 h-4 w-4" /> },
    { path: "/admin/support", label: "Support", icon: <Headphones className="mr-2 h-4 w-4" /> },
    { path: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/auth");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-64 flex-col border-r bg-gray-950 text-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/admin" className="font-semibold text-xl">
            WebNest <span className="text-blue-400 text-sm">Admin</span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 py-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2 px-4 rounded-md ${
                location.pathname === item.path || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path))
                  ? "bg-blue-600/20 text-blue-400 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-start bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100">
                <div className="h-8 w-8 rounded-full bg-blue-600/20 mr-2 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-blue-400" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
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
        <SheetContent side="left" className="w-64 p-0 bg-gray-950 text-gray-200 border-r-gray-800">
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <Link to="/admin" className="font-semibold text-xl">
              WebNest <span className="text-blue-400 text-sm">Admin</span>
            </Link>
          </div>
          <div className="flex flex-col flex-1 py-4 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center py-2 px-4 rounded-md ${
                  location.pathname === item.path || 
                  (item.path !== '/admin' && location.pathname.startsWith(item.path))
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-2 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <Link
              to="/admin/settings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-2 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 w-full text-left"
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
        <header className="h-16 border-b bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center px-6 justify-between">
          <div className="flex items-center md:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <span className="font-medium ml-3">WebNest Admin</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
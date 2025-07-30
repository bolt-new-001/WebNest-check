import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  FolderOpen,
  Files,
  Bell,
  Settings,
  Menu,
  Package,
  Crown,
  History,
  LifeBuoy,
  LogOut,
  User,
  MessageSquare,
  Code2,
  X,
  Sparkles,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/client', icon: LayoutDashboard },
  { name: 'Projects', href: '/client/projects', icon: FolderOpen },
  { name: 'Packages', href: '/client/packages', icon: Package },
  { name: 'Files', href: '/client/files', icon: Files },
  { name: 'Chat', href: '/client/chat', icon: MessageSquare },
  { name: 'Notifications', href: '/client/notifications', icon: Bell },
  { name: 'Revisions', href: '/client/revisions', icon: History },
  { name: 'Support', href: '/client/support', icon: LifeBuoy },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const Sidebar = ({ mobile = false }) => (
    <motion.div
      initial={mobile ? { x: -300 } : { opacity: 0 }}
      animate={mobile ? { x: 0 } : { opacity: 1 }}
      exit={mobile ? { x: -300 } : { opacity: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-6 py-6"
    >
      <div className="px-6 py-2">
        <Link to="/client" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft group-hover:scale-110 transition-transform">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient">WebNest</span>
        </Link>
      </div>
      
      <div className="px-3">
        <div className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = item.href === '/client'
              ? location.pathname === '/client'
              : location.pathname.startsWith(item.href)
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NavLink
                  to={item.href}
                  className={`flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-soft' 
                      : 'hover:bg-neutral-100 text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => mobile && setOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Premium Upgrade Card */}
      {!user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-3"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Upgrade to Premium</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Unlock advanced features and priority support
            </p>
            <Link to="/client/premium">
              <Button size="sm" variant="gradient" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-80 lg:border-r lg:border-neutral-200 lg:bg-white/80 lg:backdrop-blur-md lg:shadow-soft">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-soft-lg lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <Link to="/client" className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gradient">WebNest</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:pl-80">
        {/* Top bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-soft"
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              {user?.isPremium && (
                <Badge variant="gradient" className="hidden sm:flex">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
                    <Avatar className="h-10 w-10 shadow-soft">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-2xl shadow-soft-lg border-0 bg-white/95 backdrop-blur-md" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none text-gray-900">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-600">{user?.email}</p>
                      {user?.isPremium && (
                        <Badge variant="gradient" size="sm" className="w-fit">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium Member
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-200" />
                  <DropdownMenuItem asChild className="rounded-xl m-1 p-3 cursor-pointer">
                    <Link to="/client/profile" className="flex items-center">
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl m-1 p-3 cursor-pointer">
                    <Link to="/client/settings" className="flex items-center">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {!user?.isPremium && (
                    <DropdownMenuItem asChild className="rounded-xl m-1 p-3 cursor-pointer">
                      <Link to="/client/premium" className="flex items-center text-yellow-700">
                        <Crown className="mr-3 h-4 w-4" />
                        Upgrade to Premium
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-neutral-200" />
                  <DropdownMenuItem
                    className="rounded-xl m-1 p-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </main>
    </div>
  )
}
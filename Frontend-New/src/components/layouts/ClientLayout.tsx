import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '../../lib/theme';
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
  Flag,
  Clock,
  DollarSign,
  Database,
  Zap,
  Globe,
  Palette,
  Layers,
  Monitor,
  TrendingUp,
  Shield,
  Award,
  Star,
  ChevronDown,
  Activity,
  Sun,
  Moon,
  Laptop,
  Smartphone,
  Tablet,
  BellRing,
  Gem,
  Diamond,
  Briefcase,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Workflow,
  GitBranch,
  Rocket,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Key,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Link2,
  ExternalLink,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  FolderPlus,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Cut,
  Paste,
  Save,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind
} from 'lucide-react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/client', 
    icon: LayoutDashboard, 
    badge: null,
    gradient: 'from-blue-500 to-purple-600',
    description: 'Overview and insights'
  },
  { 
    name: 'Projects', 
    href: '/client/projects', 
    icon: FolderOpen, 
    badge: '12',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Manage your projects'
  },
  { 
    name: 'Analytics', 
    href: '/client/analytics', 
    icon: BarChart3, 
    badge: null,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Performance insights'
  },
  { 
    name: 'Site Builder', 
    href: '/client/builder', 
    icon: Rocket, 
    badge: 'NEW',
    gradient: 'from-violet-500 to-purple-600',
    description: 'Build stunning websites'
  },
  { 
    name: 'Templates', 
    href: '/client/templates', 
    icon: Layers, 
    badge: '248',
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Premium templates'
  },
  { 
    name: 'Components', 
    href: '/client/components', 
    icon: Package, 
    badge: null,
    gradient: 'from-indigo-500 to-blue-600',
    description: 'UI components library'
  },
  { 
    name: 'Design System', 
    href: '/client/design', 
    icon: Palette, 
    badge: null,
    gradient: 'from-pink-500 to-purple-600',
    description: 'Design tokens & styles'
  },
  { 
    name: 'Responsive', 
    href: '/client/responsive', 
    icon: Monitor, 
    badge: null,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Multi-device optimization'
  },
  { 
    name: 'Collaboration', 
    href: '/client/chat', 
    icon: MessageSquare, 
    badge: '3',
    gradient: 'from-yellow-500 to-orange-600',
    description: 'Team communication'
  },
  { 
    name: 'Deploy & Host', 
    href: '/client/deploy', 
    icon: Zap, 
    badge: null,
    gradient: 'from-purple-500 to-pink-600',
    description: 'Launch your projects'
  },
  { 
    name: 'Performance', 
    href: '/client/performance', 
    icon: Activity, 
    badge: null,
    gradient: 'from-red-500 to-pink-600',
    description: 'Speed & optimization'
  },
  { 
    name: 'Security', 
    href: '/client/security', 
    icon: Shield, 
    badge: null,
    gradient: 'from-gray-600 to-gray-800',
    description: 'Security & compliance'
  },
  { 
    name: 'Backups', 
    href: '/client/backups', 
    icon: Database, 
    badge: null,
    gradient: 'from-teal-500 to-cyan-600',
    description: 'Data protection'
  },
  { 
    name: 'Support', 
    href: '/client/support', 
    icon: LifeBuoy, 
    badge: null,
    gradient: 'from-orange-500 to-red-600',
    description: '24/7 expert help'
  },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
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
    <div className={`flex flex-col h-full ${isDark ? 'sidebar-luxury-dark' : 'sidebar-luxury'}`}>
      {/* Logo Section */}
      <div className="flex-shrink-0 px-6 py-8 border-b border-border/20">
        <Link to="/client" className="flex items-center space-x-4 group">
          <motion.div 
            className="relative p-3 rounded-2xl luxury-gradient shadow-2xl group-hover:scale-110 transition-all duration-500 luxury-glow"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/logo.png" 
              alt="WebNest Icon"
              className="h-8 w-8 object-cover rounded-sm filter brightness-0 invert"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              WebNest
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Enterprise Studio
            </span>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="flex-shrink-0 mx-6 mb-6">
        <motion.div 
          className="p-4 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50 border border-slate-200/60 shadow-lg backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-4 ring-white shadow-xl">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <div className="flex items-center space-x-2">
                {user?.isPremium ? (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
                    <Crown className="w-3 h-3 mr-1" />
                    Elite
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Free Plan</Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Navigation - Scrollable */}
      <div className="flex-1 px-3 overflow-y-auto scrollbar-hide">
        <div className="space-y-1 pb-6">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Navigation</p>
          {navigation.map((item, index) => {
            const isActive = item.href === '/client'
              ? location.pathname === '/client'
              : location.pathname.startsWith(item.href);
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <NavLink
                  to={item.href}
                  className={`relative flex items-center space-x-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl transform scale-105` 
                      : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-white text-gray-700 hover:text-gray-900 hover:shadow-lg hover:scale-102'
                  }`}
                  onClick={() => mobile && setOpen(false)}
                >
                  {/* Background Animation */}
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      initial={false}
                    />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative z-10 p-2 rounded-xl ${
                    isActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                  } transition-all duration-300`}>
                    <item.icon className={`h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                    } transition-colors duration-300`} />
                  </div>
                  
                  {/* Text */}
                  <span className="relative z-10 flex-1">{item.name}</span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`relative z-10 px-2 py-1 rounded-full text-xs font-bold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 text-gray-600 group-hover:bg-white group-hover:shadow-sm'
                      } transition-all duration-300`}
                    >
                      {item.badge}
                    </motion.div>
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-8 bg-white rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Premium Upgrade Card - Fixed at bottom */}
      {!user?.isPremium && (
        <div className="flex-shrink-0 mx-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 shadow-xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-yellow-100/20 to-orange-100/30"></div>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900">Upgrade to Elite</h3>
                    <p className="text-xs text-amber-700">Unlock premium features</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-amber-800">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Unlimited projects & exports</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-amber-800">
                    <Zap className="w-3 h-3" />
                    <span>Priority support & hosting</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-amber-800">
                    <Award className="w-3 h-3" />
                    <span>Advanced analytics & AI tools</span>
                  </div>
                </div>
                
                <Link to="/client/premium">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 px-6 py-4">
        <div className="text-center">
          <p className="text-xs text-gray-400">© 2025 WebNest Enterprise</p>
          <p className="text-xs text-gray-300">Version 3.2.1</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50'
    }`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-96 lg:border-r lg:shadow-2xl transition-colors duration-300 ${
        isDark 
          ? 'lg:border-gray-700 lg:bg-gray-900/90 lg:backdrop-blur-xl' 
          : 'lg:border-slate-200/60 lg:bg-white/90 lg:backdrop-blur-xl'
      }`}>
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
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 250, damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-96 bg-white/95 backdrop-blur-xl shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
                <Link to="/client" className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">WebNest</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="hover:bg-red-50 hover:text-red-600 rounded-xl"
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
      <main className="flex-1 lg:pl-96">
        {/* Top bar */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`sticky top-0 z-40 backdrop-blur-xl border-b shadow-xl transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-900/90 border-gray-700' 
              : 'bg-white/90 border-slate-200/60'
          }`}
        >
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="lg:hidden hover:bg-blue-50 hover:text-blue-600 rounded-xl"
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              <div className="hidden md:block">
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Let's build something amazing today
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`relative rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-yellow-500/10 hover:text-yellow-500' 
                    : 'hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-50 hover:text-blue-600 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Button>

              {/* Premium Badge */}
              {user?.isPremium && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden sm:flex"
                >
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg px-4 py-2 rounded-xl font-semibold">
                    <Crown className="w-4 h-4 mr-2" />
                    Elite Member
                  </Badge>
                </motion.div>
              )}
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-12 w-12 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-xl"
                  >
                    <Avatar className="h-12 w-12 shadow-xl ring-2 ring-white">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-lg">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full p-0.5 shadow-md" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-80 rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-xl p-2" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuLabel className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl mb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 shadow-xl">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-xl">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        {user?.isPremium && (
                          <Badge className="mt-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
                            <Crown className="w-3 h-3 mr-1" />
                            Elite Member
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <div className="space-y-1">
                    <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer hover:bg-blue-50 group">
                      <Link to="/client/profile" className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Profile Settings</p>
                          <p className="text-xs text-gray-600">Manage your account</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer hover:bg-purple-50 group">
                      <Link to="/client/settings" className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                          <Settings className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Preferences</p>
                          <p className="text-xs text-gray-600">Customize your experience</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    
                    {!user?.isPremium && (
                      <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer hover:bg-amber-50 group">
                        <Link to="/client/premium" className="flex items-center">
                          <div className="p-2 bg-amber-100 rounded-xl mr-4 group-hover:bg-amber-200 transition-colors">
                            <Crown className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-amber-800">Upgrade to Elite</p>
                            <p className="text-xs text-amber-600">Unlock premium features</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                  
                  <DropdownMenuSeparator className="bg-slate-200 my-2" />
                  
                  <DropdownMenuItem
                    className="rounded-2xl p-4 cursor-pointer text-red-600 hover:bg-red-50 group"
                    onClick={handleLogout}
                  >
                    <div className="p-2 bg-red-100 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Sign out</p>
                      <p className="text-xs text-red-500">End your session</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-6 lg:p-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
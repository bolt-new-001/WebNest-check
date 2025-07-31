import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Code2, User, UserCog, Shield, Mail, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { clientApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'client' | 'developer' | 'admin'>('client')

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const response = await clientApi.login(data)
      const userData = response.data
      
      if (!userData || !userData.token) {
        throw new Error('Invalid login response structure')
      }

      login(userData, userData.token)
      toast.success('Welcome back!')

      if (userData.role === 'admin' || userData.role === 'owner') {
        navigate('/admin')
      } else if (userData.role === 'developer' || userData.role === 'leadDeveloper') {
        navigate('/developer')
      } else {
        navigate('/client')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const response = await clientApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: userType // Include the selected role
      })
      
      // The user data is directly in response.data
      const userData = response.data;
      
      if (!userData || !userData.token) {
        throw new Error('Invalid registration response');
      }

      // Login with the user data and token
      login(userData, userData.token)
      
      toast.success('Account created successfully!')
      
      // Navigate based on the user's role
      switch(userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'developer':
          navigate('/developer');
          break;
        default:
          navigate('/client');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Registration failed. Please try again.';
      toast.error(errorMessage)
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false)
    }
  }

  const userTypes = [
    {
      id: 'client',
      title: 'Client',
      description: 'I want to create a website or hire developers',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'developer',
      title: 'Developer',
      description: 'I want to work on projects and earn money',
      icon: UserCog,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'I manage the platform and oversee operations',
      icon: Shield,
      gradient: 'from-red-500 to-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft via-white to-secondary/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img src="/logo.png" alt="WebNest Icon" className="h-8 w-8 object-cover rounded-sm" />
            </div>
            <span className="text-3xl font-bold text-gradient">WebNest</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome</h1>
          <p className="text-gray-600 leading-relaxed">Sign in to your account or create a new one</p>
        </motion.div>

        <Card className="shadow-soft-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Choose Your Role</CardTitle>
            <CardDescription>Select how you want to use WebNest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="grid gap-3">
              {userTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setUserType(type.id as any)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                    userType === type.id
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'border-neutral-200 hover:border-primary/30 hover:bg-neutral-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${type.gradient} shadow-soft group-hover:scale-110 transition-transform`}>
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{type.title}</div>
                      <div className="text-sm text-gray-600 leading-relaxed">{type.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      icon={<Mail className="h-4 w-4" />}
                      error={loginForm.formState.errors.email?.message}
                      {...loginForm.register('email')}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        icon={<Lock className="h-4 w-4" />}
                        error={loginForm.formState.errors.password?.message}
                        autoComplete="current-password"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </motion.form>
              </TabsContent>

              <TabsContent value="register">
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-4"
                >
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    icon={<User className="h-4 w-4" />}
                    error={registerForm.formState.errors.name?.message}
                    {...registerForm.register('name')}
                  />

                  <Input
                    type="email"
                    placeholder="Enter your email"
                    icon={<Mail className="h-4 w-4" />}
                    error={registerForm.formState.errors.email?.message}
                    {...registerForm.register('email')}
                  />

                  <Input
                    type="password"
                    placeholder="Create a password"
                    icon={<Lock className="h-4 w-4" />}
                    error={registerForm.formState.errors.password?.message}
                    {...registerForm.register('password')}
                  />

                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    icon={<Lock className="h-4 w-4" />}
                    error={registerForm.formState.errors.confirmPassword?.message}
                    {...registerForm.register('confirmPassword')}
                  />

                  <Button type="submit" className="w-full" size="lg" variant="gradient" loading={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:text-accent transition-colors underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:text-accent transition-colors underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
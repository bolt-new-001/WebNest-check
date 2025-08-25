import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Code2, 
  Terminal, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Layers,
  Globe,
  ChevronLeft,
  Loader2,
  Zap,
  GitBranch
} from 'lucide-react';

// Mock axios for demo - replace with actual axios import
const axios = {
  post: async (url: string, data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock success response
    if (data.email === 'dev@example.com' && data.password === 'devpass') {
      return {
        status: 200,
        data: {
          data: {
            token: 'mock-dev-jwt-token-67890'
          }
        }
      };
    } else {
      throw new Error('Invalid developer credentials');
    }
  }
};

export default function AuthDevPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('authToken', response.data.data.token);
        setTimeout(() => {
          window.location.href = '/dev/dashboard';
        }, 2000);
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Try dev@example.com / devpass');
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      borderColor: "rgba(59, 130, 246, 0.5)",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "none",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 8px 30px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Code-like Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Matrix-like Code Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 79px, rgba(59, 130, 246, 0.3) 81px, rgba(59, 130, 246, 0.3) 82px, transparent 84px),
                             linear-gradient(rgba(59, 130, 246, 0.3) 0.1em, transparent 0.1em)`,
            backgroundSize: '84px 1.2em'
          }}
        />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => window.history.back()}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors duration-300"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-6"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Code2 className="w-10 h-10 text-white" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-md opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-2">Developer Portal</h1>
          <p className="text-white/80">Access your development workspace</p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* Status Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 mb-6"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email Address
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focused"
                initial="unfocused"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your developer email"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-0 transition-all duration-200"
                />
              </motion.div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Password
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focused"
                initial="unfocused"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-0 transition-all duration-200"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm"
            >
              <p className="font-medium mb-1">Developer Demo:</p>
              <p>Email: dev@example.com</p>
              <p>Password: devpass</p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              variants={buttonVariants}
              initial="idle"
              whileHover={loading ? "idle" : "hover"}
              whileTap={loading ? "idle" : "tap"}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Accessing...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 group"
                  >
                    <Terminal className="w-5 h-5" />
                    <span>Access Portal</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              />
            </motion.button>

            {/* Additional Links */}
            <div className="flex flex-col gap-4 pt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <a 
                  href="/auth/forgot-password" 
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                >
                  Reset your access key?
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center text-white/60 text-sm"
              >
                New to the platform? 
                <a href="/auth/dev-register" className="text-blue-400 hover:text-blue-300 ml-1 font-medium transition-colors duration-200">
                  Join as Developer
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Developer Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: GitBranch, text: "Git Ready", color: "text-green-400" },
            { icon: Zap, text: "Fast Deploy", color: "text-yellow-400" },
            { icon: Layers, text: "Full Stack", color: "text-purple-400" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-colors duration-300"
            >
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
              <span className="text-white/80 text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Code Snippet Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-6 p-4 rounded-2xl bg-slate-900/50 border border-blue-500/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white/60 text-xs ml-2">terminal</span>
          </div>
          <motion.div 
            className="font-mono text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-green-400">developer@webnest</span>
            <span className="text-white/60">:</span>
            <span className="text-blue-400">~$</span>
            <span className="text-white/80 ml-2">npm run dev</span>
            <motion.span 
              className="text-blue-400 ml-1"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              |
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Success Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <Code2 className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Access Granted!</h2>
              <p className="text-white/80">Loading your development environment...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
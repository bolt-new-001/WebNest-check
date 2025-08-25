import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield,
  ChevronRight,
  Layers,
  Globe,
  Terminal,
  User,
  Building
} from 'lucide-react';

export default function AuthTypeSelection() {
  const [selectedType, setSelectedType] = useState<'dev' | 'client' | ''>('');
  const [isHovering, setIsHovering] = useState<'dev' | 'client' | ''>('');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  
  // Mock navigation function - replace with your actual router navigation
  const navigate = (path: string) => {
    // For React Router: useNavigate hook se navigate(path)
    // For Next.js: useRouter hook se router.push(path)
    window.location.href = path; // Temporary solution
  };

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const handleSelect = (type: 'dev' | 'client') => {
    setSelectedType(type);
    // Navigate after animation completes
    setTimeout(() => {
      navigate(`/auth-type=${type}`);
    }, 1200);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: 45
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 400
      }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: [0, 1, 0], 
      scale: [0.5, 1.2, 1.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const devFeatures = [
    { icon: Code2, text: "Access to Projects", color: "text-blue-400" },
    { icon: Terminal, text: "Developer Tools", color: "text-green-400" },
    { icon: Layers, text: "Full Stack Support", color: "text-purple-400" }
  ];

  const clientFeatures = [
    { icon: Users, text: "Hire Developers", color: "text-orange-400" },
    { icon: Building, text: "Project Management", color: "text-pink-400" },
    { icon: Shield, text: "Secure Payments", color: "text-cyan-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
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
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
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

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Welcome to WebNest</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Choose Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-4">
              Path
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether you're a developer looking for opportunities or a client seeking talent,
            we've got the perfect experience for you.
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Developer Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setIsHovering('dev')}
            onHoverEnd={() => setIsHovering('')}
            className="relative group perspective-1000"
          >
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500 cursor-pointer"
                 onClick={() => handleSelect('dev')}>
              
              {/* Glow Effect */}
              <motion.div
                variants={glowVariants}
                initial="hidden"
                animate={isHovering === 'dev' ? "visible" : "hidden"}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10"
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Code2 className="w-8 h-8 text-white" />
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
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Developer</h3>
                    <p className="text-white/60">Build amazing projects</p>
                  </div>
                </div>
                <motion.div
                  className="text-blue-400"
                  animate={{ x: isHovering === 'dev' ? 10 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {devFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  >
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-white/90 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('dev')}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  I'm a Developer
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>

              {/* Selection Indicator */}
              <AnimatePresence>
                {selectedType === 'dev' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border-2 border-blue-400 flex items-center justify-center backdrop-blur-md"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Client Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setIsHovering('client')}
            onHoverEnd={() => setIsHovering('')}
            className="relative group perspective-1000"
          >
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-pink-400/50 transition-all duration-500 cursor-pointer"
                 onClick={() => handleSelect('client')}>
              
              {/* Glow Effect */}
              <motion.div
                variants={glowVariants}
                initial="hidden"
                animate={isHovering === 'client' ? "visible" : "hidden"}
                className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-3xl blur-xl -z-10"
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-600 shadow-lg"
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <User className="w-8 h-8 text-white" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-500 rounded-2xl blur-md opacity-50"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Client</h3>
                    <p className="text-white/60">Get projects done</p>
                  </div>
                </div>
                <motion.div
                  className="text-pink-400"
                  animate={{ x: isHovering === 'client' ? 10 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {clientFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.7 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  >
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-white/90 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('client')}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  I'm a Client
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>

              {/* Selection Indicator */}
              <AnimatePresence>
                {selectedType === 'client' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-3xl border-2 border-pink-400 flex items-center justify-center backdrop-blur-md"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 text-lg">
            Not sure which one? You can always switch later in your profile settings.
          </p>
        </motion.div>
      </motion.div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
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
                className={`w-20 h-20 rounded-full ${
                  selectedType === 'dev' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-r from-pink-500 to-orange-600'
                } flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                {selectedType === 'dev' ? (
                  <Code2 className="w-10 h-10 text-white" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome, {selectedType === 'dev' ? 'Developer' : 'Client'}!
              </h2>
              <p className="text-white/80">Preparing your personalized experience...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
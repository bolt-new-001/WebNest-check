import { motion } from 'framer-motion';
import { Code2, Shield, Users, Sparkles, Globe, Award, TrendingUp, TrendingDown, CircleDot, CircleDot2, CircleDashed, CircleDashed2, CircleWavy, CircleWavy2, ArrowRight, CheckCircle, Zap, Users2, Building2, Building, Layout, LayoutGrid, LayoutList, LayoutDashboard, LayoutColumns } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from 'react-router-dom';

export function WebDevelopment() {
  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Modern Web Development",
      description: "We build cutting-edge web applications using the latest technologies and best practices. Our team of expert developers ensures your project is scalable, secure, and performs optimally.",
      benefits: [
        "Responsive design for all devices",
        "Optimized performance",
        "Scalable architecture",
        "Secure coding practices",
        "SEO optimization"
      ]
    },
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "Full Stack Development",
      description: "From frontend to backend, we handle everything. Our full-stack developers create seamless, integrated solutions that meet your business needs.",
      benefits: [
        "Frontend frameworks (React, Vue, Angular)",
        "Backend technologies (Node.js, Python, PHP)",
        "Database integration",
        "API development",
        "Real-time applications"
      ]
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Enterprise Solutions",
      description: "We build robust enterprise applications that integrate with your existing systems and scale with your business growth.",
      benefits: [
        "Custom business solutions",
        "Integration with legacy systems",
        "High availability",
        "Data security",
        "Compliance ready"
      ]
    }
  ];

  const technologies = [
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: "Frontend Technologies",
      items: [
        "React.js",
        "Vue.js",
        "Angular",
        "Next.js",
        "Tailwind CSS",
        "Material-UI"
      ]
    },
    {
      icon: <LayoutList className="h-6 w-6" />,
      title: "Backend Technologies",
      items: [
        "Node.js",
        "Python (Django, Flask)",
        "PHP (Laravel, Symfony)",
        "Java (Spring Boot)",
        ".NET Core"
      ]
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Databases",
      items: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Elasticsearch"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Navbar */}
      <Navbar
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient">WebNest</span>
          </Link>
        }
        items={[
          { title: 'Home', href: '/' },
          { title: 'About', href: '/about' },
          { title: 'Contact', href: '/contact' },
          { title: 'Help', href: '/help' },
          { title: 'Services', href: '/services' },
        ]}
        actions={
          <>
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="gradient" size="sm">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-100/50 to-purple-50/50 rounded-3xl blur-3xl opacity-30"></div>
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
              <Code2 className="h-16 w-16 text-blue-600" />
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Web Development Services
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transform your digital presence with our expert web development services. We create modern, scalable, and secure web applications that drive business growth.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="lg">
                  <Sparkles className="h-4 w-4 mr-2" /> Get a Quote
                </Button>
                <Button variant="outline" size="lg">
                  <CircleDot className="h-4 w-4 mr-2" /> View Portfolio
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-center gap-2">
                          <CircleDot className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Tech Stack</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        {tech.icon}
                      </div>
                      <CardTitle>{tech.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tech.items.map((item, iIndex) => (
                        <li key={iIndex} className="flex items-center gap-2">
                          <CircleDot className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img 
                src="/logo.png" 
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient">WebNest</span>
          </Link>
        }
        sections={[
          {
            title: 'Services',
            links: [
              { title: 'Web Development', href: '/services/web' },
              { title: 'E-commerce', href: '/services/ecommerce' },
              { title: 'Mobile Apps', href: '/services/mobile' },
              { title: 'Consulting', href: '/services/consulting' },
            ]
          },
          {
            title: 'Company',
            links: [
              { title: 'About Us', href: '/about' },
              { title: 'Portfolio', href: '/portfolio' },
              { title: 'Careers', href: '/careers' },
              { title: 'Contact', href: '/contact' },
            ]
          },
          {
            title: 'Support',
            links: [
              { title: 'Help Center', href: '/help' },
              { title: 'Documentation', href: '/doc' },
              { title: 'Privacy Policy', href: '/privacy' },
              { title: 'Terms of Service', href: '/terms' },
            ]
          },
        ]}
        social={[
          {
            icon: <Globe className="h-5 w-5" />,
            href: "https://webnest.netlify.app",
            label: "Website"
          },
          {
            icon: <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img src="/logo.png" alt="WebNest Icon" className="h-5 w-5 object-cover rounded-sm" />
            </div>,
            href: "https://github.com/webnestpro",
            label: "GitHub"
          },
        ]}
      />
    </div>
  );
}

import { motion } from 'framer-motion';
import { Code2, CircleDot, Zap, Shield, Star, CheckCircle, Sparkles, Award, TrendingUp, Server, Database, Settings, Rocket, BarChart2, Users, Truck, Gift, Clock, Tag, Search, Cloud, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from 'react-router-dom';

export function WebDevelopment() {
  const features = [
    {
      title: 'Frontend Development',
      description: 'Build responsive and interactive user interfaces using modern web technologies.',
      icon: Code2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Backend Development',
      description: 'Create robust and scalable server-side applications with RESTful APIs.',
      icon: Server,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Database Integration',
      description: 'Implement efficient data storage and retrieval solutions.',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Security Implementation',
      description: 'Ensure your application is protected with industry-standard security measures.',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Performance Optimization',
      description: 'Optimize your application for speed and scalability.',
      icon: Rocket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Cloud Integration',
      description: 'Deploy and scale your applications on cloud platforms.',
      icon: Cloud,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
  ];

  const technologies = [
    {
      title: 'Frontend Technologies',
      description: 'React, Next.js, Vue.js, Angular, Tailwind CSS, Material UI, Framer Motion',
      icon: Code2,
      color: 'text-blue-600'
    },
    {
      title: 'Backend Technologies',
      description: 'Node.js, Express.js, Django, Ruby on Rails, Spring Boot',
      icon: Server,
      color: 'text-purple-600'
    },
    {
      title: 'Databases',
      description: 'MongoDB, PostgreSQL, MySQL, Redis, Cassandra',
      icon: Database,
      color: 'text-green-600'
    },
    {
      title: 'Cloud Services',
      description: 'AWS, Google Cloud Platform, Azure, DigitalOcean',
      icon: Cloud,
      color: 'text-gray-600'
    },
    {
      title: 'DevOps Tools',
      description: 'Docker, Kubernetes, Jenkins, GitLab CI/CD',
      icon: Settings,
      color: 'text-orange-600'
    },
    {
      title: 'Testing & Monitoring',
      description: 'Jest, Cypress, Selenium, New Relic, Datadog',
      icon: Shield,
      color: 'text-red-600'
    },
  ];

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'WebDevelopment', href: '/services/web' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient from-blue-600 to-purple-600">WebNest</span>
          </Link>
        }
        items={navItems}
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
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Web Development Services
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We provide comprehensive web development solutions to bring your digital vision to life.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    <p className="text-base font-semibold leading-7 text-gray-900">{feature.title}</p>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <a href="#" className="text-sm font-semibold leading-6 text-blue-600">
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

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
                        <tech.icon className={`h-6 w-6 ${tech.color}`} aria-hidden="true" />
                      </div>
                      <CardTitle>{tech.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{tech.description}</p>
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
            <div className="p-1 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient from-blue-600 to-purple-600">WebNest</span>
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

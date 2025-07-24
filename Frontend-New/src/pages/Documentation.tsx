import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Code2, Database, Layout, Lock, Settings, Server, Zap, ChevronRight, CircleDashed, CircleWavy, CircleDashed2, CircleWavy2, CircleDot, CircleDot2, Sparkles, Shield, Globe2, Building2, Clock2, Calendar, User, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Essential information to begin your journey with WebNest.',
      topics: [
        'Introduction to WebNest',
        'Quick Start Guide',
        'Platform Overview',
        'System Requirements',
      ],
      level: 'beginner',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 5
    },
    {
      icon: Code2,
      title: 'Frontend Development',
      description: 'Build beautiful and responsive user interfaces.',
      topics: [
        'Component Library',
        'State Management',
        'Routing Guide',
        'Performance Optimization',
      ],
      level: 'intermediate',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 8
    },
    {
      icon: Database,
      title: 'Backend Integration',
      description: 'Connect and manage your backend services.',
      topics: [
        'API Integration',
        'Database Setup',
        'Authentication Flow',
        'Error Handling',
      ],
      level: 'intermediate',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 6
    },
    {
      icon: Layout,
      title: 'UI Components',
      description: 'Pre-built components for rapid development.',
      topics: [
        'Form Components',
        'Layout Components',
        'Data Display',
        'Navigation Elements',
      ],
      level: 'beginner',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 7
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Implement robust security measures.',
      topics: [
        'Authentication',
        'Authorization',
        'Data Protection',
        'Security Best Practices',
      ],
      level: 'advanced',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 4
    },
    {
      icon: Settings,
      title: 'Configuration',
      description: 'Configure and customize your application.',
      topics: [
        'Environment Setup',
        'Build Configuration',
        'Deployment Settings',
        'Performance Tuning',
      ],
      level: 'intermediate',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 5
    },
    {
      icon: Server,
      title: 'Deployment',
      description: 'Deploy and manage your applications.',
      topics: [
        'Deployment Guide',
        'CI/CD Pipeline',
        'Cloud Services',
        'Monitoring',
      ],
      level: 'advanced',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 3
    },
    {
      icon: Zap,
      title: 'Advanced Features',
      description: 'Take your application to the next level.',
      topics: [
        'WebSocket Integration',
        'Real-time Features',
        'Caching Strategies',
        'Advanced Patterns',
      ],
      level: 'advanced',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 4
    },
  ];

  const recentUpdates = [
    {
      title: 'New Authentication Features',
      date: 'March 15, 2024',
      description: 'Enhanced security with OAuth 2.0 and JWT implementation.',
    },
    {
      title: 'Performance Optimization Guide',
      date: 'March 10, 2024',
      description: 'Learn how to optimize your application for better performance.',
    },
    {
      title: 'Real-time Data Sync',
      date: 'March 5, 2024',
      description: 'Implementation guide for real-time data synchronization.',
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.topics.some((topic) =>
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
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
              <Shield className="h-16 w-16 text-blue-600" />
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Documentation
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive guides and resources to help you build amazing web applications with WebNest.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="lg">
                  <Sparkles className="h-4 w-4 mr-2" /> Get Started
                </Button>
                <Button variant="outline" size="lg">
                  <CircleDot className="h-4 w-4 mr-2" /> View All Topics
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveSection(section.title.toLowerCase().replace(' ', '-'))}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        section.level === 'beginner' ? 'bg-green-100' :
                        section.level === 'intermediate' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        <section.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <span>{section.description}</span>
                            <Badge variant="outline" className="text-xs">
                              {section.level.toUpperCase()}
                            </Badge>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.topics.map((topic, tIndex) => (
                        <div key={topic} className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{topic}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Updated: {section.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{section.contributors} contributors</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recent Updates
            </h2>
            <p className="text-xl text-gray-600">
              Stay up to date with the latest documentation changes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {recentUpdates.map((update, index) => (
              <motion.div
                key={update.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                    <CardDescription>{update.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{update.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Links
              </h2>
              <p className="text-lg text-gray-600">
                Jump to commonly accessed documentation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="text-left justify-start h-auto py-4">
                <div>
                  <div className="font-semibold">API Reference</div>
                  <div className="text-sm text-gray-500">Complete API documentation</div>
                </div>
              </Button>
              <Button variant="outline" className="text-left justify-start h-auto py-4">
                <div>
                  <div className="font-semibold">Best Practices</div>
                  <div className="text-sm text-gray-500">Development guidelines</div>
                </div>
              </Button>
              <Button variant="outline" className="text-left justify-start h-auto py-4">
                <div>
                  <div className="font-semibold">Examples</div>
                  <div className="text-sm text-gray-500">Code examples and demos</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
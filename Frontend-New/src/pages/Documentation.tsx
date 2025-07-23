import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Code2, Database, Layout, Lock, Settings, Server, Zap, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Book className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              WebNest <span className="text-blue-600">Documentation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive guides and references to help you build amazing applications.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-12 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <section.icon className="h-8 w-8 text-blue-600 mb-4" />
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.topics.map((topic) => (
                        <li key={topic}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-600 hover:text-blue-600"
                          >
                            <ChevronRight className="h-4 w-4 mr-2" />
                            {topic}
                          </Button>
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
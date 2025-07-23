import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, MessageCircle, Phone, Mail, FileText, ChevronRight, ExternalLink, Book, Settings, Shield, Zap, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'New to WebNest? Start here for the basics.',
      articles: [
        'Creating your first project',
        'Understanding the dashboard',
        'Managing team members',
        'Basic platform navigation',
      ],
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Manage your account and preferences.',
      articles: [
        'Profile settings',
        'Notification preferences',
        'Billing and subscriptions',
        'Security settings',
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Keep your account and data secure.',
      articles: [
        'Two-factor authentication',
        'Password guidelines',
        'API key management',
        'Access control',
      ],
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimize your website performance.',
      articles: [
        'Caching strategies',
        'Image optimization',
        'CDN configuration',
        'Performance monitoring',
      ],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work effectively with your team.',
      articles: [
        'Role management',
        'Team permissions',
        'Collaboration tools',
        'Activity tracking',
      ],
    },
    {
      icon: MessageCircle,
      title: 'Support',
      description: 'Get help when you need it.',
      articles: [
        'Contact support',
        'Live chat',
        'Ticket system',
        'FAQ',
      ],
    },
  ];

  const popularArticles = [
    {
      title: 'How to deploy your first website',
      views: '2.5k views',
      category: 'Getting Started',
    },
    {
      title: 'Setting up custom domains',
      views: '1.8k views',
      category: 'Configuration',
    },
    {
      title: 'Understanding billing cycles',
      views: '1.2k views',
      category: 'Billing',
    },
    {
      title: 'Team collaboration best practices',
      views: '950 views',
      category: 'Teams',
    },
  ];

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some((article) =>
      article.toLowerCase().includes(searchQuery.toLowerCase())
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
            <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              How can we <span className="text-blue-600">help</span>?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Search our knowledge base or browse categories below to find the answers you need.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for help articles..."
                className="pl-12 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <category.icon className="h-8 w-8 text-blue-600 mb-4" />
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article) => (
                        <li key={article}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-600 hover:text-blue-600"
                          >
                            <ChevronRight className="h-4 w-4 mr-2" />
                            {article}
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

      {/* Popular Articles Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to frequently asked questions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="mb-4 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {article.category} • {article.views}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Users className="mr-2 h-5 w-5" />
                Community Forum
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
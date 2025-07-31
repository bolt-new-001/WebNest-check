import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, CircleDot, MessageCircle, ChevronRight, Book, Settings, Shield, Zap, Users, Sparkles, Calendar, User, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/ui/navbar';
import { Link } from 'react-router-dom';

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Documentation', href: '/doc' },
  ]

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
      level: 'beginner',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 5
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
      level: 'beginner',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 4
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
      level: 'intermediate',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 3
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
      level: 'intermediate',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 4
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
      level: 'intermediate',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 5
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
      level: 'beginner',
      status: 'active',
      lastUpdated: '2025-07-24',
      contributors: 6
    },
  ];

  const popularArticles = [
    {
      title: 'How to deploy your first website',
      views: '2.5k views',
      category: 'Getting Started',
      rating: 4.8,
      difficulty: 'beginner'
    },
    {
      title: 'Setting up custom domains',
      views: '1.8k views',
      category: 'Configuration',
      rating: 4.5,
      difficulty: 'intermediate'
    },
    {
      title: 'Understanding billing cycles',
      views: '1.2k views',
      category: 'Billing',
      rating: 4.2,
      difficulty: 'beginner'
    },
    {
      title: 'Team collaboration best practices',
      views: '950 views',
      category: 'Teams',
      rating: 4.7,
      difficulty: 'intermediate'
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
    <div className="">
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

      <div className="min-h-screen bg-gradient-to-br from-[#e7e1f5] via-[#c9bce7] to-[#e7e1f5]">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e7e1f5]/50 via-[#c9bce7]/50 to-[#e7e1f5]/50 rounded-3xl blur-3xl opacity-30"></div>
          <div className="container mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <HelpCircle className="h-16 w-16 text-[#8b70cd]" />
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8b70cd] to-[#aa96da] mb-6">
                  Help Center
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Find answers to your questions and get support for WebNest.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg">
                    <Sparkles className="h-4 w-4 mr-2" /> Browse Categories
                  </Button>
                  <Button variant="outline" size="lg">
                    <CircleDot className="h-4 w-4 mr-2" /> Popular Articles
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search help center..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {searchQuery.length > 0 && `${searchQuery.length} characters`}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">beginner</Badge>
                <Badge variant="outline">intermediate</Badge>
                <Badge variant="outline">advanced</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveCategory(category.title.toLowerCase().replace(' ', '-'))}
                  className="cursor-pointer"
                >
                  <Card className="bg-white/80 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${category.level === 'beginner' ? 'bg-[#e7e1f5]' :
                            category.level === 'intermediate' ? 'bg-[#c9bce7]' :
                              'bg-[#aa96da]'
                          }`}>
                          <category.icon className="h-6 w-6 text-[#8b70cd]" />
                        </div>
                        <div>
                          <CardTitle>{category.title}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-2">
                              <span>{category.description}</span>
                              <Badge variant="outline" className="text-xs">
                                {category.level.toUpperCase()}
                              </Badge>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.articles.map((article, aIndex) => (
                          <div key={article} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{article}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Updated: {category.lastUpdated}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{category.contributors} contributors</span>
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

        {/* Popular Articles */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Popular Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {popularArticles.map((article, index) => (
                  <motion.div
                    key={article.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 hover:bg-white transition-colors duration-300">
                      <CardHeader>
                        <CardTitle>{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{article.views}</span>
                            <Badge variant="outline" className="text-xs">
                              {article.difficulty.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{article.category}</span>
                            <span className="text-sm text-gray-500">
                              <span className="text-green-500">⭐</span>{article.rating}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
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
    </div>
  );
}
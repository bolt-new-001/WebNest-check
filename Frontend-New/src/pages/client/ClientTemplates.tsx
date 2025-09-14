import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Star,
  Eye,
  Download,
  Crown,
  Zap,
  Heart,
  ArrowRight,
  Play,
  Code,
  Palette,
  Smartphone,
  Monitor,
  ShoppingCart,
  Briefcase,
  Camera,
  Users,
  Rocket,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'

interface Template {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  thumbnail: string
  previewUrl: string
  demoUrl?: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  downloads: number
  isPremium: boolean
  isNew?: boolean
  isTrending?: boolean
  tags: string[]
  features: string[]
  technologies: string[]
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  createdAt: string
  lastUpdated: string
}

interface Category {
  id: string
  name: string
  icon: React.ElementType
  count: number
  description: string
  color: string
}

// Static template data - replace with API call later
const staticTemplates: Template[] = [
  {
    id: 'modern-portfolio-1',
    title: 'Modern Portfolio Pro',
    description: 'Stunning portfolio template for developers and designers with dark mode, animations, and responsive design.',
    category: 'portfolio',
    subcategory: 'developer',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/templates/preview/modern-portfolio-1',
    demoUrl: 'https://demo.example.com/modern-portfolio',
    price: 0,
    rating: 4.9,
    reviews: 234,
    downloads: 1520,
    isPremium: false,
    isNew: true,
    isTrending: true,
    tags: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
    features: ['Dark Mode', 'Responsive', 'Animations', 'SEO Optimized'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    author: {
      name: 'Alex Chen',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    createdAt: '2024-01-15',
    lastUpdated: '2024-02-01'
  },
  {
    id: 'ecommerce-store-1',
    title: 'Premium E-Commerce Store',
    description: 'Complete e-commerce solution with cart, payments, admin panel, and modern UI/UX design.',
    category: 'ecommerce',
    subcategory: 'store',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/templates/preview/ecommerce-store-1',
    demoUrl: 'https://demo.example.com/ecommerce-store',
    price: 49,
    originalPrice: 79,
    rating: 4.8,
    reviews: 156,
    downloads: 890,
    isPremium: true,
    isTrending: true,
    tags: ['Next.js', 'Stripe', 'MongoDB', 'Admin Panel'],
    features: ['Payment Integration', 'Admin Dashboard', 'Inventory Management', 'Order Tracking'],
    technologies: ['Next.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    author: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-25'
  },
  {
    id: 'business-landing-1',
    title: 'Corporate Business Landing',
    description: 'Professional landing page template perfect for agencies, startups, and corporate websites.',
    category: 'business',
    subcategory: 'landing',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/templates/preview/business-landing-1',
    demoUrl: 'https://demo.example.com/business-landing',
    price: 29,
    rating: 4.7,
    reviews: 89,
    downloads: 445,
    isPremium: true,
    tags: ['Vue.js', 'GSAP', 'Responsive', 'Corporate'],
    features: ['Contact Forms', 'Team Sections', 'Service Pages', 'Blog Integration'],
    technologies: ['Vue.js', 'GSAP', 'Bootstrap'],
    author: {
      name: 'Mike Rodriguez',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    createdAt: '2024-01-05',
    lastUpdated: '2024-01-20'
  },
  {
    id: 'blog-template-1',
    title: 'Minimal Blog Template',
    description: 'Clean and minimal blog template with markdown support, search functionality, and author profiles.',
    category: 'blog',
    subcategory: 'minimal',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/templates/preview/blog-template-1',
    demoUrl: 'https://demo.example.com/blog-template',
    price: 19,
    rating: 4.6,
    reviews: 67,
    downloads: 234,
    isPremium: false,
    isNew: true,
    tags: ['Markdown', 'Search', 'Minimal', 'Fast'],
    features: ['Markdown Support', 'Search Functionality', 'Author Profiles', 'Tag System'],
    technologies: ['Gatsby', 'GraphQL', 'Markdown'],
    author: {
      name: 'Emma Wilson',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    createdAt: '2024-01-12',
    lastUpdated: '2024-01-28'
  },
  {
    id: 'app-landing-1',
    title: 'Mobile App Showcase',
    description: 'Beautiful landing page template designed specifically for mobile apps with download buttons and features showcase.',
    category: 'app',
    subcategory: 'mobile',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/templates/preview/app-landing-1',
    demoUrl: 'https://demo.example.com/app-landing',
    price: 35,
    rating: 4.8,
    reviews: 124,
    downloads: 567,
    isPremium: true,
    isTrending: true,
    tags: ['Mobile', 'App Store', 'Features', 'Download'],
    features: ['App Store Buttons', 'Feature Showcase', 'Screenshots Gallery', 'Testimonials'],
    technologies: ['React', 'Styled Components', 'Framer Motion'],
    author: {
      name: 'David Kim',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    createdAt: '2024-01-08',
    lastUpdated: '2024-01-22'
  }
]

const categories: Category[] = [
  { id: 'all', name: 'All Templates', icon: Grid3x3, count: 150, description: 'Browse all available templates', color: 'blue' },
  { id: 'portfolio', name: 'Portfolio', icon: Briefcase, count: 35, description: 'Personal and professional portfolios', color: 'purple' },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart, count: 28, description: 'Online stores and shopping sites', color: 'green' },
  { id: 'business', name: 'Business', icon: Users, count: 42, description: 'Corporate and agency websites', color: 'orange' },
  { id: 'blog', name: 'Blog', icon: Camera, count: 25, description: 'Blogs and content websites', color: 'pink' },
  { id: 'app', name: 'App Landing', icon: Smartphone, count: 20, description: 'Mobile and web app showcases', color: 'indigo' }
]

const filters = [
  { id: 'all', name: 'All Templates', count: 150 },
  { id: 'free', name: 'Free', count: 45 },
  { id: 'premium', name: 'Premium', count: 105 },
  { id: 'new', name: 'New', count: 12 },
  { id: 'trending', name: 'Trending', count: 8 }
]

export default function ClientTemplates() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [templates, setTemplates] = useState<Template[]>(staticTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(staticTemplates)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState<boolean>(false)

  // Filter templates based on category, filter, and search
  useEffect(() => {
    let filtered = templates

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Type filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'free':
          filtered = filtered.filter(template => template.price === 0)
          break
        case 'premium':
          filtered = filtered.filter(template => template.price > 0)
          break
        case 'new':
          filtered = filtered.filter(template => template.isNew)
          break
        case 'trending':
          filtered = filtered.filter(template => template.isTrending)
          break
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredTemplates(filtered)
  }, [templates, selectedCategory, selectedFilter, searchQuery])

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    }
    return colors[color] || colors.blue
  }

  const handlePreview = (template: Template) => {
    navigate(`/client/templates/preview/${template.id}`)
  }

  const handleDownload = (template: Template) => {
    if (template.isPremium && !user?.isPremium) {
      navigate('/client/premium')
      return
    }
    // Download logic here
    console.log('Downloading template:', template.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Premium Template Collection
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Choose Your Perfect Template
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover professionally designed templates for every project. From portfolios to e-commerce stores, 
              find the perfect starting point for your next website.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">150+</div>
              <div className="text-sm text-gray-600">Templates</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">4.8★</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id
              const colorClasses = getCategoryColor(category.color)
              
              return (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center ${colorClasses}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.count} templates</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className="whitespace-nowrap"
                  >
                    {filter.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {!user?.isPremium && (
              <Button 
                onClick={() => navigate('/client/premium')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade for Premium Templates
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Template Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button 
                        size="sm" 
                        onClick={() => handlePreview(template)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      {template.demoUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black"
                          onClick={() => window.open(template.demoUrl, '_blank')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Demo
                        </Button>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {template.isNew && (
                        <Badge className="bg-green-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      )}
                      {template.isTrending && (
                        <Badge className="bg-orange-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {template.isPremium && (
                        <Badge className="bg-yellow-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    {/* Price */}
                    <div className="absolute top-3 right-3">
                      {template.price === 0 ? (
                        <Badge className="bg-blue-500 text-white">Free</Badge>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Badge className="bg-white text-gray-900">
                            ${template.price}
                          </Badge>
                          {template.originalPrice && (
                            <Badge variant="secondary" className="line-through text-xs">
                              ${template.originalPrice}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                          {template.title}
                        </h3>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{template.rating}</span>
                        <span>({template.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{template.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img 
                          src={template.author.avatar} 
                          alt={template.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-700">{template.author.name}</span>
                        {template.author.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(template)}
                        className={template.isPremium && !user?.isPremium 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" 
                          : ""
                        }
                      >
                        {template.isPremium && !user?.isPremium ? (
                          <>
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            {template.price === 0 ? 'Download' : 'Buy'}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900">No Templates Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any templates matching your criteria. 
                  Try adjusting your filters or search query.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedFilter('all')
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredTemplates.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg" className="px-8">
              Load More Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Can't Find What You're Looking For?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Get access to our premium template collection with exclusive designs, 
                priority support, and custom development options.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => navigate('/client/premium')}
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/client/contact')}
              >
                Request Custom Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
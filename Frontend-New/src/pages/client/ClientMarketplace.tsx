import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  ShoppingCart,
  Package,
  Palette,
  Code2,
  Star,
  Clock,
  DollarSign,
  Eye,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { clientApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export function ClientMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Fetch templates data
  const { data: templates } = useQuery({
    queryKey: ['templates', { search: searchTerm, category: categoryFilter }],
    queryFn: () => clientApi.getTemplates({ 
      search: searchTerm || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined 
    }),
  })

  // Fetch packages data
  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: () => clientApi.getPackages(),
  })

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'business', name: 'Business' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'ecommerce', name: 'E-Commerce' },
    { id: 'blog', name: 'Blog' },
    { id: 'landing', name: 'Landing Page' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-500">Discover premium templates and packages</p>
        </div>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart (0)
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">
            <Palette className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="packages">
            <Package className="mr-2 h-4 w-4" />
            Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? 'default' : 'outline'}
                onClick={() => setCategoryFilter(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates?.data?.map((template: any) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="object-cover"
                    />
                    <Button
                      variant="secondary"
                      className="absolute bottom-4 right-4"
                      size="sm"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-yellow-400" />
                          {template.rating}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {template.deliveryTime} days
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold">
                          {formatCurrency(template.price)}
                        </span>
                        <Button>
                          Select
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages?.data?.map((pkg: any) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </div>
                      <Badge
                        variant={pkg.popular ? 'default' : 'secondary'}
                        className={pkg.popular ? 'bg-blue-100 text-blue-800' : ''}
                      >
                        {pkg.popular ? 'Popular' : pkg.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {pkg.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm">
                          <Code2 className="mr-2 h-4 w-4 text-blue-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold">{formatCurrency(pkg.price)}</p>
                      </div>
                      <Button>
                        Choose Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
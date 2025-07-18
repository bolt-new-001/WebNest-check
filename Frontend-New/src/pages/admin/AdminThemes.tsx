import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Palette,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { adminApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminThemes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: themes, isLoading } = useQuery({
    queryKey: ['admin-themes', { search: searchTerm, category: categoryFilter }],
    queryFn: () => adminApi.get('/api/themes', { 
      params: {
        search: searchTerm || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined 
      }
    }),
  })

  const approveThemeMutation = useMutation({
    mutationFn: (themeId: string) => adminApi.put(`/api/themes/${themeId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-themes'] })
      toast.success('Theme approved successfully')
    },
    onError: () => {
      toast.error('Failed to approve theme')
    },
  })

  const featureThemeMutation = useMutation({
    mutationFn: (themeId: string) => adminApi.put(`/api/themes/${themeId}/feature`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-themes'] })
      toast.success('Theme featured successfully')
    },
    onError: () => {
      toast.error('Failed to feature theme')
    },
  })

  const deleteThemeMutation = useMutation({
    mutationFn: (themeId: string) => adminApi.delete(`/api/themes/${themeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-themes'] })
      toast.success('Theme deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete theme')
    },
  })

  const filteredThemes = themes?.data?.data || []

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'landing', label: 'Landing Page' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theme Management</h1>
          <p className="text-gray-600">Manage and curate website themes for clients</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Palette className="mr-2 h-4 w-4" />
              Add Theme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Theme</DialogTitle>
              <DialogDescription>
                Upload a new theme to the platform.
              </DialogDescription>
            </DialogHeader>
            {/* Add theme form would go here */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme Name</label>
                <Input placeholder="Modern Portfolio" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input placeholder="$49" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Theme description..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Palette className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop an image, or click to browse</p>
                  <input type="file" className="hidden" />
                  <Button variant="outline" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Download className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload theme files (ZIP format)</p>
                  <input type="file" className="hidden" />
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload ZIP
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Add Theme</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search themes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Themes Grid */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading themes...</p>
        </div>
      ) : filteredThemes.length === 0 ? (
        <div className="text-center py-10">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No themes found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme: any) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={theme.previewImage || 'https://via.placeholder.com/400x225?text=Theme+Preview'} 
                    alt={theme.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  {theme.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    </div>
                  )}
                  {theme.status === 'pending' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{theme.name}</h3>
                    <Badge className="capitalize">{theme.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{theme.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-medium">${theme.price}</span>
                    <span className="text-sm text-gray-500">{theme.downloads || 0} downloads</span>
                  </div>
                </CardContent>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Added {formatDate(theme.createdAt)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {theme.status === 'pending' && (
                        <DropdownMenuItem onClick={() => approveThemeMutation.mutate(theme.id)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {!theme.featured && (
                        <DropdownMenuItem onClick={() => featureThemeMutation.mutate(theme.id)}>
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                          Feature
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => deleteThemeMutation.mutate(theme.id)}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Themes</p>
                <h3 className="text-2xl font-bold mt-1">48</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Featured</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Downloads</p>
                <h3 className="text-2xl font-bold mt-1">1,248</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$24,500</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
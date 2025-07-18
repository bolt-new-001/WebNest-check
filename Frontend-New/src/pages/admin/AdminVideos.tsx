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
  Video,
  Plus,
  Play,
  Pause,
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Tag,
  Star
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import { formatDate, formatDuration } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminVideos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'tutorial',
    tags: '',
    file: null,
    thumbnail: null
  })
  const queryClient = useQueryClient()

  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-videos', { search: searchTerm, category: categoryFilter }],
    queryFn: () => adminApi.get('/api/videos', { 
      params: {
        search: searchTerm || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined 
      }
    }),
  })

  const getVideoDetailsMutation = useMutation({
    mutationFn: (videoId: string) => adminApi.get(`/api/videos/${videoId}`),
    onSuccess: (response) => {
      setSelectedVideo(response.data.data)
      setIsVideoDialogOpen(true)
    },
    onError: () => {
      toast.error('Failed to load video details')
    },
  })

  const updateVideoMutation = useMutation({
    mutationFn: (data: any) => adminApi.put(`/api/videos/${data.videoId}`, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
      toast.success('Video updated successfully')
      setIsVideoDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to update video')
    },
  })

  const uploadVideoMutation = useMutation({
    mutationFn: (formData: FormData) => adminApi.post('/api/videos', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
      toast.success('Video uploaded successfully')
      setIsUploadDialogOpen(false)
      setUploadForm({
        title: '',
        description: '',
        category: 'tutorial',
        tags: '',
        file: null,
        thumbnail: null
      })
    },
    onError: () => {
      toast.error('Failed to upload video')
    },
  })

  const featureVideoMutation = useMutation({
    mutationFn: (videoId: string) => adminApi.put(`/api/videos/${videoId}/feature`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
      toast.success('Video featured successfully')
    },
    onError: () => {
      toast.error('Failed to feature video')
    },
  })

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => adminApi.delete(`/api/videos/${videoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
      toast.success('Video deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete video')
    },
  })

  const handleViewVideo = (video) => {
    setSelectedVideo(video)
    getVideoDetailsMutation.mutate(video._id)
  }

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    
    if (!uploadForm.title.trim()) {
      toast.error('Please enter a video title')
      return
    }

    if (!uploadForm.file) {
      toast.error('Please select a video file to upload')
      return
    }

    const formData = new FormData()
    formData.append('title', uploadForm.title)
    formData.append('description', uploadForm.description)
    formData.append('category', uploadForm.category)
    formData.append('tags', uploadForm.tags)
    formData.append('videoFile', uploadForm.file)
    
    if (uploadForm.thumbnail) {
      formData.append('thumbnail', uploadForm.thumbnail)
    }

    uploadVideoMutation.mutate(formData)
  }

  const filteredVideos = videos?.data?.data || []

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'guide', label: 'Guides' },
    { value: 'showcase', label: 'Showcases' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'demo', label: 'Demos' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
          <p className="text-gray-600">Manage tutorial and promotional videos</p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Video className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Videos ({filteredVideos.length})</CardTitle>
          <CardDescription>
            Manage tutorial, promotional, and educational videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100 group">
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <Video className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        onClick={() => handleViewVideo(video)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                    {video.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium line-clamp-1">{video.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewVideo(video)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {!video.featured && (
                            <DropdownMenuItem onClick={() => featureVideoMutation.mutate(video._id)}>
                              <Star className="mr-2 h-4 w-4" />
                              Feature
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => deleteVideoMutation.mutate(video._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(video.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No videos found</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Your First Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload New Video</DialogTitle>
            <DialogDescription>
              Add a new tutorial or promotional video to the platform
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Title</label>
              <Input 
                placeholder="Introduction to WebNest" 
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Describe what this video is about..." 
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                >
                  {categoryOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input 
                  placeholder="tutorial, beginner, setup" 
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <Video className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  {uploadForm.file ? uploadForm.file.name : 'Drag and drop a video file, or click to browse'}
                </p>
                <Input 
                  type="file" 
                  accept="video/*"
                  className="hidden" 
                  id="video-upload"
                  onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('video-upload').click()}
                  type="button"
                >
                  Browse Files
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <img 
                  src={uploadForm.thumbnail ? URL.createObjectURL(uploadForm.thumbnail) : ''}
                  alt="Thumbnail preview"
                  className={`h-32 object-cover mb-2 ${!uploadForm.thumbnail ? 'hidden' : ''}`}
                />
                {!uploadForm.thumbnail && <img className="h-8 w-8 text-gray-400 mb-2" />}
                <p className="text-sm text-gray-500 mb-2">
                  {uploadForm.thumbnail ? uploadForm.thumbnail.name : 'Upload a thumbnail image (16:9 ratio recommended)'}
                </p>
                <Input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  id="thumbnail-upload"
                  onChange={(e) => setUploadForm({...uploadForm, thumbnail: e.target.files[0]})}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                  type="button"
                >
                  Browse Files
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadVideoMutation.isPending}>
                {uploadVideoMutation.isPending ? 'Uploading...' : 'Upload Video'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Details Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>
              {selectedVideo?.category} - Uploaded on {selectedVideo && formatDate(selectedVideo.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {selectedVideo?.videoUrl && (
                <video 
                  src={selectedVideo.videoUrl} 
                  controls 
                  className="w-full h-full"
                  poster={selectedVideo.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-gray-600">{selectedVideo?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Category</h3>
                <p className="text-sm text-gray-600">{selectedVideo?.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Duration</h3>
                <p className="text-sm text-gray-600">{selectedVideo && formatDuration(selectedVideo.duration)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Views</h3>
                <p className="text-sm text-gray-600">{selectedVideo?.views || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <Badge variant={selectedVideo?.published ? "default" : "outline"}>
                  {selectedVideo?.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVideo?.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
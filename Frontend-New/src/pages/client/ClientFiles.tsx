import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Search, 
  Filter, 
  MoreHorizontal,
  Download,
  Trash2,
  File,
  Image,
  FileText,
  Archive,
  Eye
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
import { clientApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function ClientFiles() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const queryClient = useQueryClient()

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => clientApi.getProjects(),
  })

  const { data: files, isLoading } = useQuery({
    queryKey: ['files', { search: searchTerm, category: categoryFilter, project: selectedProject }],
    queryFn: () => clientApi.getProjectFiles(selectedProject !== 'all' ? selectedProject : '', { 
      search: searchTerm || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined 
    }),
    enabled: selectedProject !== 'all'
  })

  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) => clientApi.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete file')
    },
  })

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return Image
      case 'document':
        return FileText
      case 'archive':
        return Archive
      default:
        return File
    }
  }

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'logo', label: 'Logo' },
    { value: 'brand_assets', label: 'Brand Assets' },
    { value: 'requirements', label: 'Requirements' },
    { value: 'reference', label: 'Reference' },
    { value: 'deliverable', label: 'Deliverable' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">File Management</h1>
          <p className="text-muted-foreground">Upload and manage project files</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Project Files</DialogTitle>
              <DialogDescription>
                Upload files for your projects
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 text-center text-gray-500">
              File upload form coming soon...
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent/5 transition-colors"
              >
                <option value="all">Select Project</option>
                {projects?.data?.data?.map((project: any) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent/5 transition-colors"
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

      {/* Files Grid */}
      {selectedProject === 'all' ? (
        <Card className="border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-12 text-center relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:10px_10px]" />
            <div className="absolute h-full w-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 opacity-20 blur-3xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 animate-float">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Select a Project</h3>
              <p className="text-muted-foreground">Choose a project to view and manage its files</p>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg animate-pulse"></div>
                  <div className="w-8 h-8 bg-muted rounded-md"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-primary/5 rounded-full w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : files?.data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.data.data.map((file: any, index: number) => {
            const FileIcon = getFileIcon(file.fileType)
            return (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <FileIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteFileMutation.mutate(file._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm line-clamp-2">{file.originalName}</h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs bg-primary/5 hover:bg-primary/10 transition-colors">
                          {file.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {(file.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(file.createdAt)}
                      </p>
                      {file.description && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-2">
                          {file.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card className="border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-12 text-center relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:10px_10px]" />
            <div className="absolute h-full w-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 opacity-20 blur-3xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 animate-float">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">No files found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first file to get started'
                }
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <div className="p-4 text-center text-gray-500">
                  File upload form coming soon...
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
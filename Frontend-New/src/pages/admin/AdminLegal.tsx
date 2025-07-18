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
  FileText,
  Plus,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock
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
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminLegal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
  const [documentContent, setDocumentContent] = useState('')
  const queryClient = useQueryClient()

  const { data: documents, isLoading } = useQuery({
    queryKey: ['admin-legal-documents', { search: searchTerm, type: typeFilter }],
    queryFn: () => adminApi.get('/api/legal', { 
      params: {
        search: searchTerm || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined 
      }
    }),
  })

  const getDocumentMutation = useMutation({
    mutationFn: (documentId: string) => adminApi.get(`/api/legal/${documentId}/content`),
    onSuccess: (response) => {
      setDocumentContent(response.data.data.content)
      setIsDocumentDialogOpen(true)
    },
    onError: () => {
      toast.error('Failed to load document content')
    },
  })

  const updateDocumentMutation = useMutation({
    mutationFn: ({ documentId, content }) => adminApi.put(`/api/legal/${documentId}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-legal-documents'] })
      toast.success('Document updated successfully')
      setIsDocumentDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to update document')
    },
  })

  const publishDocumentMutation = useMutation({
    mutationFn: (documentId: string) => adminApi.put(`/api/legal/${documentId}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-legal-documents'] })
      toast.success('Document published successfully')
    },
    onError: () => {
      toast.error('Failed to publish document')
    },
  })

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => adminApi.delete(`/api/legal/${documentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-legal-documents'] })
      toast.success('Document deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete document')
    },
  })

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    getDocumentMutation.mutate(document._id)
  }

  const handleUpdateDocument = () => {
    if (!documentContent.trim()) {
      toast.error('Document content cannot be empty')
      return
    }
    updateDocumentMutation.mutate({ 
      documentId: selectedDocument._id, 
      content: documentContent 
    })
  }

  const filteredDocuments = documents?.data?.data || []

  const documentTypeOptions = [
    { value: 'all', label: 'All Documents' },
    { value: 'terms', label: 'Terms of Service' },
    { value: 'privacy', label: 'Privacy Policy' },
    { value: 'cookies', label: 'Cookie Policy' },
    { value: 'disclaimer', label: 'Disclaimer' },
    { value: 'refund', label: 'Refund Policy' },
    { value: 'eula', label: 'EULA' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Documents</h1>
          <p className="text-gray-600">Manage platform legal documents and policies</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Legal Document</DialogTitle>
              <DialogDescription>
                Create a new legal document or policy for the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input placeholder="Terms of Service" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  {documentTypeOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Content</label>
                <Textarea 
                  rows={10}
                  placeholder="Enter the legal document content here..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="publish" className="rounded text-red-500 focus:ring-red-500" />
                <label htmlFor="publish" className="text-sm">Publish immediately</label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Add Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {documentTypeOptions.map((option) => (
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

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Documents ({filteredDocuments.length})</CardTitle>
          <CardDescription>
            Manage and update your platform's legal documents and policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{document.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last updated: {formatDate(document.updatedAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Version: {document.version}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={document.published ? "default" : "outline"}>
                      {document.published ? "Published" : "Draft"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View & Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        {!document.published && (
                          <DropdownMenuItem
                            onClick={() => publishDocumentMutation.mutate(document._id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => deleteDocumentMutation.mutate(document._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No legal documents found</p>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document View/Edit Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>
              {selectedDocument?.type} - Version {selectedDocument?.version}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Document Content</label>
                <Badge variant={selectedDocument?.published ? "default" : "outline"}>
                  {selectedDocument?.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <Textarea 
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                <AlertTriangle className="h-3
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
  UserCog,
  Star,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Award,
  DollarSign
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminDevelopers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: developers, isLoading } = useQuery({
    queryKey: ['admin-developers', { search: searchTerm, status: statusFilter }],
    queryFn: () => adminApi.get('/api/developers', { 
      params: {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined 
      }
    }),
  })

  const approveDeveloperMutation = useMutation({
    mutationFn: (developerId: string) => adminApi.put(`/api/developers/${developerId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-developers'] })
      toast.success('Developer approved successfully')
    },
    onError: () => {
      toast.error('Failed to approve developer')
    },
  })

  const suspendDeveloperMutation = useMutation({
    mutationFn: (developerId: string) => adminApi.put(`/api/developers/${developerId}/suspend`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-developers'] })
      toast.success('Developer suspended successfully')
    },
    onError: () => {
      toast.error('Failed to suspend developer')
    },
  })

  const deleteDeveloperMutation = useMutation({
    mutationFn: (developerId: string) => adminApi.delete(`/api/developers/${developerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-developers'] })
      toast.success('Developer deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete developer')
    },
  })

  const filteredDevelopers = developers?.data?.data || []

  const statusOptions = [
    { value: 'all', label: 'All Developers' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'suspended', label: 'Suspended' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developer Management</h1>
          <p className="text-gray-600">Manage and monitor all platform developers</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserCog className="mr-2 h-4 w-4" />
              Add Developer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Developer</DialogTitle>
              <DialogDescription>
                Invite a new developer to join the platform.
              </DialogDescription>
            </DialogHeader>
            {/* Add developer form would go here */}
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="john.doe@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Input placeholder="Frontend, Backend, Full Stack, etc." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <Input placeholder="Junior, Mid-level, Senior" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search developers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Developers List */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Developers</CardTitle>
          <CardDescription>
            Manage developers, view their profiles, and monitor their activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-gray-500">Developer</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Specialization</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Projects</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Rating</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Earnings</th>
                  <th className="pb-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      Loading developers...
                    </td>
                  </tr>
                ) : filteredDevelopers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No developers found.
                    </td>
                  </tr>
                ) : (
                  filteredDevelopers.map((developer: any) => (
                    <motion.tr
                      key={developer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={developer.avatar} />
                            <AvatarFallback>{getInitials(developer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{developer.name}</div>
                            <div className="text-sm text-gray-500">{developer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{developer.specialization}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{developer.projectsCount || 0}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{developer.rating || '0'}/5</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        {getStatusBadge(developer.status)}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{formatCurrency(developer.earnings || 0)}</div>
                      </td>
                      <td className="py-4 text-right">
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            {developer.status === 'pending' && (
                              <DropdownMenuItem onClick={() => approveDeveloperMutation.mutate(developer.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {developer.status === 'active' && (
                              <DropdownMenuItem onClick={() => suspendDeveloperMutation.mutate(developer.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-orange-500" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            {developer.status === 'suspended' && (
                              <DropdownMenuItem onClick={() => approveDeveloperMutation.mutate(developer.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => deleteDeveloperMutation.mutate(developer.id)}>
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Developers</p>
                <h3 className="text-2xl font-bold mt-1">128</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Top Rated</p>
                <h3 className="text-2xl font-bold mt-1">42</h3>
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
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <h3 className="text-2xl font-bold mt-1">7</h3>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { User, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getInitials } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

interface ProfileFormData {
  name: string
  email: string
  phone: string
  company: string
  avatar?: FileList
}

export function ClientProfile() {
  const { user, updateUser } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || ''
    }
  })

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/client/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json()
    }
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update profile')
      return response.json()
    },
    onSuccess: (data) => {
      updateUser(data)
      toast.success('Profile updated successfully')
    },
    onError: () => toast.error('Failed to update profile')
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await fetch('/api/client/profile/avatar', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) throw new Error('Failed to upload avatar')
      return response.json()
    },
    onSuccess: (data) => {
      updateUser(data)
      toast.success('Avatar updated successfully')
    },
    onError: () => toast.error('Failed to upload avatar')
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) uploadAvatarMutation.mutate(file)
  }

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
                        <Upload className="h-4 w-4" />
                        <span>Upload new image</span>
                      </div>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information here</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        {...register('company')}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>View your account statistics and usage</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col space-y-2 p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Total Projects</span>
                  <span className="text-2xl font-bold">{profile?.totalProjects || 0}</span>
                </div>
                <div className="flex flex-col space-y-2 p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="text-2xl font-bold">
                    ${profile?.totalSpent?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex flex-col space-y-2 p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <span className="text-2xl font-bold">
                    {profile?.isPremium ? 'Premium' : 'Basic'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Github,
  Eye,
  Star,
  Award,
  Code,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { developerApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function DeveloperPortfolio() {
  const [bio, setBio] = useState('')
  const [tagline, setTagline] = useState('')
  const queryClient = useQueryClient()

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['developer-portfolio'],
    queryFn: () => developerApi.get('/api/portfolio'),
  })

  const updatePortfolioMutation = useMutation({
    mutationFn: (data: any) => developerApi.put('/api/portfolio', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-portfolio'] })
      toast.success('Portfolio updated successfully')
    },
    onError: () => {
      toast.error('Failed to update portfolio')
    },
  })

  const addProjectMutation = useMutation({
    mutationFn: (data: any) => developerApi.post('/api/portfolio/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-portfolio'] })
      toast.success('Project added to portfolio')
    },
    onError: () => {
      toast.error('Failed to add project')
    },
  })

  const portfolioData = portfolio?.data?.data

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading portfolio...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600">Showcase your work and attract clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Public Profile
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Portfolio Project</DialogTitle>
                <DialogDescription>
                  Add a new project to showcase your work
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 text-center text-gray-500">
                Project form coming soon...
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your professional profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tagline">Professional Tagline</Label>
            <Input
              id="tagline"
              placeholder="e.g., Full-stack developer specializing in React and Node.js"
              value={tagline || portfolioData?.tagline || ''}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell clients about your experience, skills, and what makes you unique..."
              value={bio || portfolioData?.bio || ''}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          <Button 
            onClick={() => updatePortfolioMutation.mutate({ bio, tagline })}
            disabled={updatePortfolioMutation.isPending}
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Showcase your technical skills</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioData?.skills?.map((skill: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{skill.name}</h3>
                  <Badge variant="outline">{skill.level}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="h-3 w-3 mr-1" />
                  {skill.yearsOfExperience || 0} years
                </div>
              </div>
            ))}
            
            {(!portfolioData?.skills || portfolioData.skills.length === 0) && (
              <div className="col-span-full text-center py-8">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No skills added yet</p>
                <Button className="mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Skill
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Projects</CardTitle>
              <CardDescription>Showcase your best work</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Portfolio Project</DialogTitle>
                </DialogHeader>
                <div className="p-4 text-center text-gray-500">
                  Project form coming soon...
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData?.projects?.map((project: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Project Image */}
                      {project.images?.[0] && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={project.images[0].url} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Project Info */}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          {project.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1">
                        {project.techStack?.slice(0, 4).map((tech: string, techIndex: number) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.techStack?.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.techStack.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {project.projectUrl && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Live Demo
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Github className="h-3 w-3 mr-1" />
                            Code
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Client Testimonial */}
                      {project.clientTestimonial && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm italic">"{project.clientTestimonial.feedback}"</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs font-medium">
                              - {project.clientTestimonial.name}
                            </p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${
                                    i < (project.clientTestimonial.rating || 0) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {(!portfolioData?.projects || portfolioData.projects.length === 0) && (
              <div className="col-span-full text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-6">Add your first project to showcase your work</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Portfolio Project</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 text-center text-gray-500">
                      Project form coming soon...
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {portfolioData?.statistics?.totalProjects || 0}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {portfolioData?.statistics?.averageRating || 0}/5
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {portfolioData?.statistics?.responseTime || 24}h
              </div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {portfolioData?.profileViews || 0}
              </div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Grid,
  Image,
  Star,
  Clock,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  ExternalLink
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { 
  Button, 
  ButtonGroup 
} from '@/components/ui/button'
import { 
  Badge, 
  BadgeGroup 
} from '@/components/ui/badge'
import { 
  ScrollArea 
} from '@/components/ui/scroll-area'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { clientApi } from '@/lib/api'
import { useState } from 'react'

export function ClientPortfolio() {
  const [selectedTab, setSelectedTab] = useState('projects')
  const [selectedProject, setSelectedProject] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: projects } = useQuery({
    queryKey: ['client-portfolio-projects'],
    queryFn: () => clientApi.getPortfolioProjects(),
  })

  const { data: achievements } = useQuery({
    queryKey: ['client-achievements'],
    queryFn: () => clientApi.getClientAchievements(),
  })

  const { data: testimonials } = useQuery({
    queryKey: ['client-testimonials'],
    queryFn: () => clientApi.getClientTestimonials(),
  })

  const getProjectStatus = (status: string) => {
    const statusMap = {
      completed: { color: 'bg-green-500', text: 'Completed' },
      featured: { color: 'bg-purple-500', text: 'Featured' },
      showcase: { color: 'bg-blue-500', text: 'Showcase' },
      highlight: { color: 'bg-yellow-500', text: 'Highlight' }
    }
    return statusMap[status as keyof typeof statusMap]
  }

  const getProjectCategory = (category: string) => {
    const categoryMap = {
      web: { color: 'bg-blue-500', text: 'Web' },
      mobile: { color: 'bg-green-500', text: 'Mobile' },
      desktop: { color: 'bg-purple-500', text: 'Desktop' },
      other: { color: 'bg-gray-500', text: 'Other' }
    }
    return categoryMap[category as keyof typeof categoryMap]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio & Showcase</CardTitle>
          <CardDescription>Showcase your completed projects and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Grid className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
            {showFilters && (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Category className="mr-2 h-4 w-4" />
                      Categories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Web</DropdownMenuItem>
                    <DropdownMenuItem>Mobile</DropdownMenuItem>
                    <DropdownMenuItem>Desktop</DropdownMenuItem>
                    <DropdownMenuItem>Other</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Star className="mr-2 h-4 w-4" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Featured</DropdownMenuItem>
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Showcase</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Projects Grid */}
        <TabsContent value="projects">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects?.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold">{project.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getProjectStatus(project.status).color}>
                              {getProjectStatus(project.status).text}
                            </Badge>
                            <Badge variant="outline" className={getProjectCategory(project.category).color}>
                              {getProjectCategory(project.category).text}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">
                              {project.rating} ({project.reviews})
                            </span>
                          </div>
                          <ButtonGroup>
                            <Button variant="outline" size="sm">
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Live Demo
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {achievements?.map((achievement) => (
                <Card key={achievement.id}>
                  <CardHeader>
                    <CardTitle>{achievement.title}</CardTitle>
                    <CardDescription>
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                          {achievement.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(achievement.timestamp))}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {testimonials?.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardHeader>
                    <CardTitle>{testimonial.author}</CardTitle>
                    <CardDescription>
                      {testimonial.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">
                          {testimonial.rating} / 5
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Add statistics cards here */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Projects</CardTitle>
                  <CardDescription>Number of completed projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Featured Projects</CardTitle>
                  <CardDescription>Number of featured projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects?.filter(p => p.status === 'featured').length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Rating</CardTitle>
                  <CardDescription>Average project rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects?.reduce((sum, p) => sum + p.rating, 0) / projects?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>Number of client testimonials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testimonials?.length || 0}</div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const formatDistanceToNow = (date) => {
  const now = new Date()
  const diff = now - date
  
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diff < minute) return 'just now'
  if (diff < hour) return Math.floor(diff / minute) + ' minutes ago'
  if (diff < day) return Math.floor(diff / hour) + ' hours ago'
  if (diff < week) return Math.floor(diff / day) + ' days ago'
  if (diff < month) return Math.floor(diff / week) + ' weeks ago'
  if (diff < year) return Math.floor(diff / month) + ' months ago'
  return Math.floor(diff / year) + ' years ago'
}

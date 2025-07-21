import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  BookOpen,
  FileText,
  Folder,
  Layout,
  Code2,
  Image,
  Video,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search
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
  Input, 
  InputGroup 
} from '@/components/ui/input'
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

export function ClientResources() {
  const [selectedTab, setSelectedTab] = useState('templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResource, setSelectedResource] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: templates } = useQuery({
    queryKey: ['client-templates'],
    queryFn: () => clientApi.getTemplates(),
  })

  const { data: guides } = useQuery({
    queryKey: ['client-guides'],
    queryFn: () => clientApi.getGuides(),
  })

  const { data: tools } = useQuery({
    queryKey: ['client-tools'],
    queryFn: () => clientApi.getTools(),
  })

  const { data: assets } = useQuery({
    queryKey: ['client-assets'],
    queryFn: () => clientApi.getAssets(),
  })

  const getResourceType = (type: string) => {
    const typeMap = {
      template: { icon: Layout, color: 'bg-blue-500' },
      guide: { icon: BookOpen, color: 'bg-purple-500' },
      tool: { icon: Code2, color: 'bg-green-500' },
      asset: { icon: Folder, color: 'bg-yellow-500' }
    }
    return typeMap[type as keyof typeof typeMap]
  }

  const getResourceCategory = (category: string) => {
    const categoryMap = {
      web: { color: 'bg-blue-500', text: 'Web' },
      mobile: { color: 'bg-green-500', text: 'Mobile' },
      desktop: { color: 'bg-purple-500', text: 'Desktop' },
      design: { color: 'bg-pink-500', text: 'Design' },
      development: { color: 'bg-cyan-500', text: 'Development' }
    }
    return categoryMap[category as keyof typeof categoryMap]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Center</CardTitle>
          <CardDescription>Access templates, guides, and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <InputGroup>
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </InputGroup>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        {/* Templates */}
        <TabsContent value="templates">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={template.thumbnail}
                        alt={template.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold">{template.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getResourceType(template.type).color}>
                              {getResourceType(template.type).icon}
                            </Badge>
                            <Badge variant="outline" className={getResourceCategory(template.category).color}>
                              {getResourceCategory(template.category).text}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              {template.views} views
                            </Badge>
                            <Badge variant="outline" className="bg-purple-100 text-purple-700">
                              {template.downloads} downloads
                            </Badge>
                          </div>
                          <ButtonGroup>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
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

        {/* Guides */}
        <TabsContent value="guides">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {guides?.map((guide) => (
                <Card key={guide.id}>
                  <CardHeader>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-700">
                          {guide.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(guide.updatedAt))}
                        </span>
                      </div>
                      <ButtonGroup>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {tools?.map((tool) => (
                <Card key={tool.id}>
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-700">
                          {tool.type}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
                          {tool.version}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <ButtonGroup>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Assets */}
        <TabsContent value="assets">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets?.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader>
                    <CardTitle>{asset.name}</CardTitle>
                    <CardDescription>
                      {asset.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">
                          {asset.type}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
                          {asset.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <ButtonGroup>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add favorite resources here */}
              <Card>
                <CardHeader>
                  <CardTitle>Favorites</CardTitle>
                  <CardDescription>Your favorite resources</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add favorite resources grid here */}
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

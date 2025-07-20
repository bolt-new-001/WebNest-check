import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle2,
  XCircle,
  Clock2,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { clientApi } from '@/lib/api'
import { formatDistanceToNow, format } from 'date-fns'
import { useState } from 'react'

export function ClientProjectTimeline() {
  const [selectedView, setSelectedView] = useState('project')
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const { data: projects } = useQuery({
    queryKey: ['client-projects'],
    queryFn: () => clientApi.getClientProjects(),
  })

  const { data: milestones } = useQuery({
    queryKey: ['project-milestones', selectedProjectId],
    queryFn: () => clientApi.getProjectMilestones(selectedProjectId),
    enabled: !!selectedProjectId
  })

  const { data: tasks } = useQuery({
    queryKey: ['project-tasks', selectedProjectId],
    queryFn: () => clientApi.getProjectTasks(selectedProjectId),
    enabled: !!selectedProjectId
  })

  const getTimelineItemStatus = (status: string) => {
    const statusMap = {
      completed: { icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
      in_progress: { icon: Clock2, color: 'bg-yellow-100 text-yellow-700' },
      pending: { icon: Clock, color: 'bg-blue-100 text-blue-700' },
      delayed: { icon: AlertCircle, color: 'bg-red-100 text-red-700' }
    }
    return statusMap[status as keyof typeof statusMap]
  }

  const getTimelineItemColor = (status: string) => {
    const colorMap = {
      completed: 'bg-green-500/20',
      in_progress: 'bg-yellow-500/20',
      pending: 'bg-blue-500/20',
      delayed: 'bg-red-500/20'
    }
    return colorMap[status as keyof typeof colorMap]
  }

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Track project progress and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="project" className="w-full">
            <TabsList>
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="project">
              <div className="space-y-4">
                {projects?.map((project) => (
                  <Button
                    key={project.id}
                    variant={selectedProjectId === project.id ? "default" : "outline"}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="w-full justify-between"
                  >
                    {project.name}
                    <Badge variant="outline" className="ml-2">
                      {project.status}
                    </Badge>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="milestones">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {milestones?.map((milestone) => (
                    <div key={milestone.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{milestone.title}</h3>
                        <Badge variant="outline" className="ml-2">
                          {formatDistanceToNow(new Date(milestone.dueDate))}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {milestone.description}
                      </p>
                      <div className="mt-4 flex items-center">
                        <Progress value={milestone.progress} className="w-48" />
                        <span className="ml-2">{milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tasks">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {tasks?.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.assignee}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {task.description}
                      </p>
                      <div className="mt-4 flex items-center">
                        <Progress value={task.progress} className="w-48" />
                        <span className="ml-2">{task.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Visual representation of project progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[600px]">
            {/* Timeline Line */}
            <div className="absolute top-0 left-1/2 w-px h-full bg-gray-200" />

            {/* Timeline Items */}
            {milestones?.map((milestone, index) => {
              const statusInfo = getTimelineItemStatus(milestone.status)
              const color = getTimelineItemColor(milestone.status)
              
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 w-full"
                  style={{ top: `${(index * 100) / milestones.length}%` }}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className={`absolute -left-2.5 -top-2.5 w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                        <statusInfo.icon className="w-5 h-5" />
                      </div>
                      <div className="absolute -left-2.5 -top-2.5 w-10 h-10 rounded-full border-4 border-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                      </p>
                      <div className="mt-2 flex items-center">
                        <Progress value={milestone.progress} className="w-32" />
                        <span className="ml-2">{milestone.progress}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

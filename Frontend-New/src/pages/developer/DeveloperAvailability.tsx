import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Coffee,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

export function DeveloperAvailability() {
  const [isAcceptingProjects, setIsAcceptingProjects] = useState(true)
  const [maxProjectsPerWeek, setMaxProjectsPerWeek] = useState(3)
  const [minimumBudget, setMinimumBudget] = useState(5000)
  const queryClient = useQueryClient()

  const { data: availability } = useQuery({
    queryKey: ['developer-availability'],
    queryFn: () => developerApi.get('/api/availability'),
  })

  const updateAvailabilityMutation = useMutation({
    mutationFn: (data: any) => developerApi.put('/api/availability', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-availability'] })
      toast.success('Availability updated successfully')
    },
    onError: () => {
      toast.error('Failed to update availability')
    },
  })

  const addVacationMutation = useMutation({
    mutationFn: (data: any) => developerApi.post('/api/availability/vacation', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-availability'] })
      toast.success('Vacation period added')
    },
    onError: () => {
      toast.error('Failed to add vacation period')
    },
  })

  const availabilityData = availability?.data?.data

  const weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ]

  const handleSaveAvailability = () => {
    updateAvailabilityMutation.mutate({
      isAcceptingNewProjects: isAcceptingProjects,
      maxProjectsPerWeek,
      minimumProjectBudget: minimumBudget,
      // Include weekly schedule data here
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-600">Manage your work schedule and availability</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Coffee className="mr-2 h-4 w-4" />
                Add Vacation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vacation Period</DialogTitle>
                <DialogDescription>
                  Block time when you won't be available for work
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 text-center text-gray-500">
                Vacation form coming soon...
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSaveAvailability}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Availability Status */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Status</CardTitle>
          <CardDescription>Control whether you're accepting new projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Accepting New Projects</h3>
                <p className="text-sm text-gray-600">
                  Turn this off when you're at capacity or taking a break
                </p>
              </div>
              <Switch
                checked={isAcceptingProjects}
                onCheckedChange={setIsAcceptingProjects}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="max-projects">Maximum Projects Per Week</Label>
                <Input
                  id="max-projects"
                  type="number"
                  value={maxProjectsPerWeek}
                  onChange={(e) => setMaxProjectsPerWeek(parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="min-budget">Minimum Project Budget (₹)</Label>
                <Input
                  id="min-budget"
                  type="number"
                  value={minimumBudget}
                  onChange={(e) => setMinimumBudget(parseInt(e.target.value))}
                  min="1000"
                  step="1000"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant={isAcceptingProjects ? 'default' : 'secondary'} className="text-sm">
                {isAcceptingProjects ? 'Available' : 'Unavailable'}
              </Badge>
              <span className="text-sm text-gray-600">
                Current workload: {availabilityData?.currentWorkload || 0} / {maxProjectsPerWeek} projects
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Set your working hours for each day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekDays.map((day) => {
              const dayData = availabilityData?.weeklySchedule?.[day.key]
              return (
                <div key={day.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <span className="font-medium">{day.label}</span>
                    </div>
                    <Switch
                      checked={dayData?.available || false}
                      onCheckedChange={(checked) => {
                        // Handle day availability toggle
                      }}
                    />
                  </div>
                  
                  {dayData?.available && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={dayData?.startTime || '09:00'}
                        className="w-32"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={dayData?.endTime || '17:00'}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vacation Periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vacation Periods</CardTitle>
              <CardDescription>Manage your time off</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vacation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Vacation Period</DialogTitle>
                </DialogHeader>
                <div className="p-4 text-center text-gray-500">
                  Vacation form coming soon...
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilityData?.vacations?.map((vacation: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{vacation.reason}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={vacation.approved ? 'default' : 'secondary'}>
                    {vacation.approved ? 'Approved' : 'Pending'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {(!availabilityData?.vacations || availabilityData.vacations.length === 0) && (
              <div className="text-center py-8">
                <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No vacation periods scheduled</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Time Off
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Vacation Period</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 text-center text-gray-500">
                      Vacation form coming soon...
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Project Types */}
      <Card>
        <CardHeader>
          <CardTitle>Project Preferences</CardTitle>
          <CardDescription>Set your preferred types of projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['website', 'ecommerce', 'webapp', 'mobile', 'api', 'maintenance'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={type}
                  className="rounded border-gray-300"
                  defaultChecked={availabilityData?.preferredProjectTypes?.includes(type)}
                />
                <label htmlFor={type} className="text-sm font-medium capitalize">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
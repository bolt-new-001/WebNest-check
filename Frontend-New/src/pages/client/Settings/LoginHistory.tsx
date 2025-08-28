import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { RefreshCw } from 'lucide-react'

type LogItem = {
  id: string
  action: 'login' | 'logout'
  description: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
  location?: { country?: string; city?: string; timezone?: string }
}

export default function LoginHistory() {
  const { data = [], isLoading, isError, refetch } = useQuery<LogItem[]>({
    queryKey: ['login-history'],
    queryFn: async () => {
      const res: any = await api.get('/api/security/login-history')
      return res.data?.data || []
    },
    refetchOnWindowFocus: true
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Login History</h2>
        <p className="text-muted-foreground">Download your account login activity</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 200 login/logout events</CardDescription>
            </div>
            <button onClick={() => refetch()} className="inline-flex items-center text-sm text-primary">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[420px]">
            <div className="divide-y">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading...</div>
              ) : isError ? (
                <div className="p-6 text-sm text-red-500">Failed to load history</div>
              ) : data.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">No activity found</div>
              ) : (
                data.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {item.action === 'login' ? (
                        <Icons.checkCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Icons.logOut className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium capitalize">{item.action}</h4>
                        <Badge variant="outline">
                          {formatDistanceToNow(new Date(item.createdAt))} ago
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.ipAddress || 'Unknown IP'} • {item.userAgent || 'Unknown Device'}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.location?.city || ''} {item.location?.country ? `• ${item.location?.country}` : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}



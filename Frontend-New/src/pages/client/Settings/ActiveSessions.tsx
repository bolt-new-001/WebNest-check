import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: string;
  isCurrent: boolean;
  location?: {
    city?: string;
    country?: string;
    region?: string;
  };
  device?: {
    type?: string;
    os?: string;
    browser?: string;
  };
}

export default function ActiveSessions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: sessions = [], isLoading, isError } = useQuery<Session[]>({
    queryKey: ['active-sessions'],
    queryFn: async () => {
      try {
        const response: any = await api.get('/api/auth/sessions');
        return response.data?.data || [];
      } catch (err: any) {
        if (err?.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/auth/login');
        }
        throw err;
      }
    },
    enabled: isAuthenticated,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      try {
        const response: any = await api.delete(`/api/auth/sessions/${sessionId}`);
        return response.data;
      } catch (err: any) {
        if (err?.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/auth/login');
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
      toast.success('Session revoked successfully');
    },
    onError: (error: any) => {
      if (error?.response?.status !== 401) {
        toast.error(error?.response?.data?.message || 'Failed to revoke session');
      }
    },
  });

  const revokeAllOtherSessions = useMutation({
    mutationFn: async () => {
      try {
        const response: any = await api.delete('/api/auth/sessions');
        return response.data;
      } catch (err: any) {
        if (err?.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/auth/login');
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
      toast.success('All other sessions have been revoked');
    },
    onError: (error: any) => {
      if (error?.response?.status !== 401) {
        toast.error(error?.response?.data?.message || 'Failed to revoke sessions');
      }
    },
  });

  const getBrowserIcon = (browser?: string) => {
    if (!browser) return <Icons.globe className="h-5 w-5" />;
    if (browser.includes('Chrome')) return <Icons.chrome className="h-5 w-5" />;
    if (browser.includes('Firefox')) return <Icons.firefox className="h-5 w-5" />;
    if (browser.includes('Safari')) return <Icons.safari className="h-5 w-5" />;
    if (browser.includes('Edge')) return <Icons.edge className="h-5 w-5" />;
    return <Icons.globe className="h-5 w-5" />;
  };

  const getDeviceType = (userAgent: string) => {
    if (!userAgent) return 'Unknown Device';
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';
    return 'Device';
  };

  const getLocationString = (session: Session) => {
    if (session.location) {
      const { city, region, country } = session.location;
      return [city, region, country].filter(Boolean).join(', ') || 'Unknown location';
    }
    return 'Unknown location';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Active Sessions</h2>
          <p className="text-muted-foreground">Manage your active login sessions</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Active Sessions</h2>
          <p className="text-muted-foreground">Manage your active login sessions</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <Icons.alertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Unable to load sessions</h3>
            <p className="text-muted-foreground mb-4">There was an error loading your active sessions. Please try again later.</p>
            <Button onClick={() => queryClient.refetchQueries({ queryKey: ['active-sessions'] })}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSession = sessions?.find(session => session.isCurrent);
  const otherSessions = sessions?.filter(session => !session.isCurrent) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Active Sessions</h2>
        <p className="text-muted-foreground">Manage your active login sessions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Session</CardTitle>
              <CardDescription>This is your current active session</CardDescription>
            </div>
            <Badge variant="success" className="flex items-center gap-1">
              <Icons.checkCircle className="h-3.5 w-3.5" />
              Active Now
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentSession ? (
            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-center gap-4 p-4 bg-muted/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {getBrowserIcon(currentSession.device?.browser)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {getDeviceType(currentSession.userAgent)} • {currentSession.device?.browser || 'Unknown Browser'}
                    </h4>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getLocationString(currentSession)} • Last active {formatDistanceToNow(parseISO(currentSession.lastActiveAt))} ago
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentSession.ipAddress}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No active session found
            </div>
          )}
        </CardContent>
      </Card>

      {otherSessions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Other Active Sessions</CardTitle>
                <CardDescription>Manage your other active sessions</CardDescription>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => revokeAllOtherSessions.mutate()}
                disabled={revokeAllOtherSessions.isPending}
              >
                {revokeAllOtherSessions.isPending ? (
                  <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.logOut className="mr-2 h-4 w-4" />
                )}
                Sign out all other devices
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="divide-y">
                {otherSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {getBrowserIcon(session.device?.browser)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {getDeviceType(session.userAgent)} • {session.device?.browser || 'Unknown Browser'}
                        </h4>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getLocationString(session)} • Last active {formatDistanceToNow(parseISO(session.lastActiveAt))} ago
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mr-4">
                      {session.ipAddress}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeSessionMutation.mutate(session.id)}
                      disabled={revokeSessionMutation.isPending && revokeSessionMutation.variables === session.id}
                    >
                      {revokeSessionMutation.isPending && revokeSessionMutation.variables === session.id ? (
                        <Icons.loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Revoke'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Icons.info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Session Security Tips</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Regularly review and revoke unrecognized sessions</li>
              <li>Use strong, unique passwords for your account</li>
              <li>Enable two-factor authentication for added security</li>
              <li>Be cautious when using public or shared devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

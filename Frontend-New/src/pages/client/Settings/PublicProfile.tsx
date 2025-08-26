import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { getInitials } from '@/lib/utils';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: async () => {
      const response = await fetch(`/api/client/profile/public/${id}`);
      if (!response.ok) throw new Error('Profile not found');
      return response.json();
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The requested profile could not be found or is private.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8 gap-2 hover:bg-primary/10 transition-colors duration-300"
        >
          <Icons.arrowLeft className="h-4 w-4" />
          Back to Previous Page
        </Button>

        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <Badge variant={profile.isPremium ? 'default' : 'secondary'}>
                    {profile.isPremium ? 'Premium Member' : 'Basic Member'}
                  </Badge>
                  <Badge variant="outline">
                    Member since {new Date(profile.createdAt).getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-sm">{profile.email}</p>
              </div>
              
              {profile.phone && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p className="text-sm">{profile.phone}</p>
                </div>
              )}

              {profile.company && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                  <p className="text-sm">{profile.company}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{profile.stats?.totalProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{profile.stats?.completedProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{profile.stats?.averageRating || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

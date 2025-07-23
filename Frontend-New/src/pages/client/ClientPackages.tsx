import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { clientApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Headphones,
  ArrowLeft,
  Sparkles,
  Infinity,
  TrendingUp,
  Award,
  Globe,
  Lock,
  Settings
} from 'lucide-react';

const packageFeatures = [
  {
    icon: Users,
    title: 'Team Members',
    description: 'Collaborate with team members'
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Enhanced security features'
  },
  {
    icon: Clock,
    title: 'Support',
    description: '24/7 priority support'
  },
  {
    icon: Globe,
    title: 'Storage',
    description: 'Cloud storage space'
  },
  {
    icon: Sparkles,
    title: 'Features',
    description: 'Advanced project features'
  },
  {
    icon: Infinity,
    title: 'Projects',
    description: 'Number of projects'
  }
];

export default function ClientPackages() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await clientApi.getPackages();
      if (!response.success) {
        throw new Error('Failed to fetch packages');
      }
      return response.data;
    },
    onError: (err) => {
      console.error('Error fetching packages:', err);
      // You might want to show an error toast here
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Error loading packages. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/client')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Project Packages</h2>
            <p className="text-muted-foreground">Choose the perfect package for your needs</p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">WebNest Packages</h3>
                </div>
                <p className="text-lg opacity-90 max-w-2xl">
                  From basic projects to enterprise solutions, we have the perfect package for every need.
                  Choose your package and start building amazing projects today.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure & Reliable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    <span>Expert Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Customizable</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((pkg: any) => (
            <Card 
              key={pkg._id} 
              className={`relative ${pkg.type === 'premium' ? 'border-blue-500 shadow-lg' : ''}`}
            >
              {pkg.type === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className={`h-4 w-4 ${feature.included ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${!feature.included && 'text-gray-400'}`}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={pkg.type === 'premium' ? 'default' : 'outline'}
                    onClick={() => navigate(`/client/packages/${pkg._id}`)}
                    disabled={pkg.isPremiumOnly && !user?.isPremium}
                  >
                    {pkg.isPremiumOnly && !user?.isPremium ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Premium Only
                      </>
                    ) : (
                      'View Details'
                    )}
                  </Button>
                  
                  {pkg.customizable && (
                    <Button 
                      className="w-full" 
                      variant="ghost"
                      onClick={() => navigate(`/client/packages/${pkg._id}/customize`)}
                      disabled={pkg.isPremiumOnly && !user?.isPremium}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Customize Package
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
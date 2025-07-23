import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { clientApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown,
  Check,
  Star,
  Shield,
  Users,
  Clock,
  ArrowLeft,
  Settings,
  CreditCard,
  HardDrive,
  MessageSquare,
  Zap,
  Lock
} from 'lucide-react';

export default function ClientPackageDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: package, isLoading } = useQuery({
    queryKey: ['package', id],
    queryFn: () => clientApi.getPackage(id)
  });

  const purchaseMutation = useMutation({
    mutationFn: () => clientApi.purchasePackage(id),
    onSuccess: () => {
      toast.success('Package purchased successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/client/profile');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase package');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!package?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h3 className="text-xl font-semibold">Package not found</h3>
        <Button onClick={() => navigate('/client/packages')}>Back to Packages</Button>
      </div>
    );
  }

  const pkg = package.data;

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/client/packages')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight">{pkg.name}</h2>
            <p className="text-muted-foreground">{pkg.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {pkg.customizable && (
              <Button
                variant="outline"
                onClick={() => navigate(`/client/packages/${id}/customize`)}
                disabled={pkg.isPremiumOnly && !user?.isPremium}
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            )}
            <Button
              onClick={() => purchaseMutation.mutate()}
              disabled={
                purchaseMutation.isPending ||
                (pkg.isPremiumOnly && !user?.isPremium)
              }
            >
              {purchaseMutation.isPending ? (
                'Processing...'
              ) : pkg.isPremiumOnly && !user?.isPremium ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Premium Only
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Package
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Package Details */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Features */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Package Features</CardTitle>
              <CardDescription>Everything included in this package</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {pkg.features.map((feature: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${!feature.included && 'opacity-50'}`}
                  >
                    <Check className={`h-5 w-5 mt-0.5 ${feature.included ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Package Info */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold">${pkg.price}</div>
                  {pkg.type === 'premium' && (
                    <Badge className="mt-2 bg-blue-500">
                      <Star className="h-3 w-3 mr-1" />
                      Premium Package
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resources Card */}
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    <span>Storage</span>
                  </div>
                  <span className="font-medium">{pkg.maxStorage}GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Team Members</span>
                  </div>
                  <span className="font-medium">{pkg.maxTeamMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Projects</span>
                  </div>
                  <span className="font-medium">{pkg.maxProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Support</span>
                  </div>
                  <span className="font-medium capitalize">{pkg.supportLevel}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
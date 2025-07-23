import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { clientApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Settings,
  Save,
  Lock,
  Check,
  X
} from 'lucide-react';

export default function ClientPackageCustomize() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const { data: package, isLoading } = useQuery({
    queryKey: ['package', id],
    queryFn: () => clientApi.getPackage(id)
  });

  const [customFeatures, setCustomFeatures] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (package?.data) {
      setCustomFeatures(package.data.features);
    }
  }, [package]);

  const customizeMutation = useMutation({
    mutationFn: (features: any[]) => clientApi.customizePackage(id, { features }),
    onSuccess: () => {
      toast.success('Package customized successfully');
      navigate(`/client/packages/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to customize package');
    }
  });

  const handleFeatureToggle = (index: number) => {
    setCustomFeatures(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        included: !updated[index].included
      };
      return updated;
    });
  };

  const handleSave = () => {
    customizeMutation.mutate(customFeatures);
  };

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

  if (!pkg.customizable) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h3 className="text-xl font-semibold">This package cannot be customized</h3>
        <Button onClick={() => navigate(`/client/packages/${id}`)}>Back to Package</Button>
      </div>
    );
  }

  if (pkg.isPremiumOnly && !user?.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold">Premium Only Feature</h3>
        <p className="text-muted-foreground">Upgrade to premium to customize this package</p>
        <Button onClick={() => navigate('/client/premium')}>Upgrade to Premium</Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/client/packages/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight">Customize Package</h2>
            <p className="text-muted-foreground">Customize {pkg.name} to fit your needs</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={customizeMutation.isPending}
          >
            {customizeMutation.isPending ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Customization Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Selection</CardTitle>
            <CardDescription>
              Toggle features on or off to customize your package. Some features may affect the final price.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {customFeatures.map((feature, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">{feature.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={feature.included}
                      onCheckedChange={() => handleFeatureToggle(index)}
                    />
                  </div>
                  {index < customFeatures.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Features</CardTitle>
            <CardDescription>Review your customized package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {customFeatures.filter(f => f.included).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                >
                  <Check className="h-5 w-5 mt-0.5 text-green-500" />
                  <div>
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
              {customFeatures.filter(f => !f.included).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg border opacity-50"
                >
                  <X className="h-5 w-5 mt-0.5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
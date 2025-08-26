import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { clientApi } from '@/lib/api';

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return clientApi.changePassword(data);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      reset();
      navigate('/client/settings');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });

  const onSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 hover:bg-primary/10 transition-colors duration-300"
      >
        <Icons.arrowLeft className="h-4 w-4" />
        Back to Settings
      </Button>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icons.lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                    {...register('currentPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPassword.current ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Icons.alertCircle className="h-3.5 w-3.5" />
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                    {...register('newPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPassword.new ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Icons.alertCircle className="h-3.5 w-3.5" />
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPassword.confirm ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Icons.alertCircle className="h-3.5 w-3.5" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">Password requirements:</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one number</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={changePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

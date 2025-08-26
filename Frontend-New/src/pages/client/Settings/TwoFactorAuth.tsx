import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { clientApi } from '@/lib/api';

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
  backupCode: z.string().optional(),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export default function TwoFactorAuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  // Start 2FA setup
  const start2FASetup = useMutation({
    mutationFn: async () => {
      const response = await clientApi.setup2FA();
      return response.data;
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setStep('verify');
    },
    onError: () => {
      toast.error('Failed to start 2FA setup');
    }
  });

  // Verify 2FA code
  const verify2FA = useMutation({
    mutationFn: async (data: { code: string }) => {
      return clientApi.verify2FA(data);
    },
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      setStep('backup');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    }
  });

  // Handle form submission
  const onSubmit = (data: TwoFactorFormData) => {
    if (step === 'verify') {
      verify2FA.mutate({ code: data.code });
    } else if (step === 'backup' && data.backupCode) {
      // Handle backup code verification if needed
      console.log('Backup code verified');
    }
  };

  // Handle 2FA disable
  const disable2FA = useMutation({
    mutationFn: async () => {
      return clientApi.disable2FA();
    },
    onSuccess: () => {
      toast.success('Two-factor authentication has been disabled');
      setStep('setup');
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    }
  });

  // Start the 2FA setup process
  const handleSetup2FA = () => {
    start2FASetup.mutate();
  };

  // Copy backup codes to clipboard
  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast.success('Backup codes copied to clipboard');
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'webnest-2fa-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 hover:bg-primary/10 transition-colors duration-300"
      >
        <Icons.arrowLeft className="h-4 w-4" />
        Back to Security Settings
      </Button>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icons.shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {step === 'setup' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="font-medium mb-2">What is Two-Factor Authentication?</h3>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication adds an extra layer of security to your account by requiring
                  more than just a password to log in. You'll need to enter a code from an authenticator
                  app on your phone when signing in.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">How it works:</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Icons.checkCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Download an authenticator app like Google Authenticator or Authy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.checkCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Scan the QR code with your authenticator app</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.checkCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Enter the 6-digit code to verify setup</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSetup2FA}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                  disabled={start2FASetup.isPending}
                >
                  {start2FASetup.isPending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    'Set Up Two-Factor Authentication'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'verify' && qrCode && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="font-medium">Scan the QR code with your authenticator app</p>
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <img src={qrCode} alt="2FA QR Code" className="h-48 w-48" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Or enter this code manually: <span className="font-mono font-bold">JBSWY3DPEHPK3PXP</span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Enter the 6-digit code from your app</Label>
                  <div className="relative">
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="000000"
                      className="h-12 text-center text-lg tracking-widest font-mono"
                      {...register('code')}
                    />
                  </div>
                  {errors.code && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <Icons.alertCircle className="h-3.5 w-3.5" />
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('setup')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    disabled={verify2FA.isPending}
                  >
                    {verify2FA.isPending ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === 'backup' && backupCodes.length > 0 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex items-center gap-3">
                  <Icons.checkCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-200">Two-factor authentication enabled</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your account is now protected with two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Backup Codes</Label>
                    <button
                      type="button"
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="text-sm text-primary hover:underline"
                    >
                      {showBackupCodes ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Save these backup codes in a safe place. You can use them to access your account if you lose your device.
                    </p>
                    
                    {showBackupCodes ? (
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm mt-3">
                        {backupCodes.map((code, i) => (
                          <div key={i} className="p-2 bg-background rounded">
                            {code}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-24 bg-background rounded flex items-center justify-center">
                        <Icons.eyeOff className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyBackupCodes}
                    className="flex-1"
                  >
                    <Icons.copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={downloadBackupCodes}
                    className="flex-1"
                  >
                    <Icons.download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => disable2FA.mutate()}
                  className="w-full"
                  disabled={disable2FA.isPending}
                >
                  {disable2FA.isPending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    'Disable Two-Factor Authentication'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

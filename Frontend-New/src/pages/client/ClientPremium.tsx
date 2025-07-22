import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { clientApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
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
  Lock
} from 'lucide-react'

interface PremiumPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  savings?: string
}

const premiumPlans: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 29,
    period: 'month',
    description: 'Perfect for trying out premium features',
    features: [
      'Unlimited Projects',
      'Priority Support',
      'Advanced Analytics',
      'Custom Branding',
      'API Access',
      'Team Collaboration',
      'Premium Templates',
      'Advanced Security'
    ]
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 290,
    period: 'year',
    description: 'Best value for serious professionals',
    features: [
      'Everything in Monthly',
      'Dedicated Account Manager',
      'Custom Integrations',
      'White-label Solutions',
      'Advanced Reporting',
      'Priority Feature Requests',
      'Exclusive Beta Access',
      '24/7 Phone Support'
    ],
    popular: true,
    savings: 'Save $58/year'
  }
]

const premiumFeatures = [
  {
    icon: Infinity,
    title: 'Unlimited Projects',
    description: 'Create and manage unlimited projects without any restrictions'
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get faster response times and dedicated support channels'
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description: 'Deep insights into your project performance and metrics'
  },
  {
    icon: Award,
    title: 'Custom Branding',
    description: 'White-label solutions with your own branding and domain'
  },
  {
    icon: Globe,
    title: 'API Access',
    description: 'Full API access for custom integrations and automation'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Advanced team features and collaboration tools'
  },
  {
    icon: Sparkles,
    title: 'Premium Templates',
    description: 'Access to exclusive premium templates and designs'
  },
  {
    icon: Lock,
    title: 'Enhanced Security',
    description: 'Advanced security features and compliance tools'
  }
]

export default function ClientPremium() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const upgradeMutation = useMutation({
    mutationFn: async (planType: string) => {
      return clientApi.upgradeToPremium({ plan: planType })
    },
    onSuccess: () => {
      toast.success('Successfully upgraded to Premium!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/client/profile')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upgrade to premium')
    }
  })

  const handleUpgrade = (planType: string) => {
    upgradeMutation.mutate(planType)
  }

  if (user?.isPremium) {
    return (
      <ScrollArea className="h-full">
        <div className="container mx-auto py-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/client/profile')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Premium Subscription</h2>
              <p className="text-muted-foreground">You're already a premium member!</p>
            </div>
          </div>

          {/* Premium Status */}
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-yellow-800">Premium Member</CardTitle>
                  <CardDescription className="text-yellow-600">
                    You have access to all premium features
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {premiumFeatures.slice(0, 4).map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">{feature.title}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/client/profile')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h2>
            <p className="text-muted-foreground">Unlock powerful features and take your projects to the next level</p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">WebNest Premium</h3>
                </div>
                <p className="text-lg opacity-90 max-w-2xl">
                  Supercharge your workflow with advanced features, priority support, and unlimited possibilities.
                  Join thousands of professionals who trust WebNest Premium.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                  <Crown className="h-24 w-24 relative" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Choose Your Plan</h3>
            <p className="text-muted-foreground">Select the perfect plan for your needs</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {premiumPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <Badge variant="secondary" className="text-green-600">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgradeMutation.isPending}
                  >
                    {upgradeMutation.isPending ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Premium Features</h3>
            <p className="text-muted-foreground">Everything you need to succeed</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Everything you need to know about Premium</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">What payment methods do you accept?</h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! All new premium subscriptions come with a 14-day free trial. No credit card required.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Can I upgrade or downgrade my plan?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can change your plan at any time. Changes will be prorated and reflected in your next billing cycle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of professionals who have already upgraded to Premium. 
                Start your free trial today and experience the difference.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => handleUpgrade('yearly')}>
                <Crown className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/client/profile')}>
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
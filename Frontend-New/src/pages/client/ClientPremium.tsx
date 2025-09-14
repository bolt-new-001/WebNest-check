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
  Lock,
  ChevronRight,
  Play,
  Target,
  Rocket,
  BarChart3
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
  originalPrice?: number
}

const premiumPlans: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Premium',
    price: 29,
    period: 'month',
    description: 'Perfect for individuals and small teams getting started',
    features: [
      'Unlimited Projects',
      'Priority Email Support',
      'Advanced Analytics Dashboard',
      'Custom Branding',
      'Standard API Access',
      'Team Collaboration (up to 5 members)',
      'Premium Templates Library',
      'Advanced Security Features'
    ]
  },
  {
    id: 'yearly',
    name: 'Premium Pro',
    price: 24,
    originalPrice: 29,
    period: 'month',
    description: 'Best value for growing businesses and power users',
    features: [
      'Everything in Premium',
      'Dedicated Account Manager',
      'Custom Integrations & Webhooks',
      'White-label Solutions',
      'Advanced Reporting & Exports',
      'Priority Feature Requests',
      'Exclusive Beta Access',
      '24/7 Phone & Chat Support',
      'Unlimited Team Members',
      'Custom Domain Integration'
    ],
    popular: true,
    savings: 'Save 17% annually'
  }
]

const premiumFeatures = [
  {
    icon: Infinity,
    title: 'Unlimited Everything',
    description: 'Create unlimited projects, templates, and workflows without restrictions',
    color: 'blue'
  },
  {
    icon: Zap,
    title: 'Lightning Support',
    description: 'Get priority support with average response time under 2 hours',
    color: 'yellow'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights with custom reports and data exports',
    color: 'green'
  },
  {
    icon: Award,
    title: 'White-Label Ready',
    description: 'Full customization with your branding, domain, and styling',
    color: 'purple'
  },
  {
    icon: Globe,
    title: 'API & Integrations',
    description: 'Connect with 100+ tools via API and custom integrations',
    color: 'indigo'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Advanced team management with roles and permissions',
    color: 'pink'
  },
  {
    icon: Sparkles,
    title: 'Premium Resources',
    description: 'Exclusive templates, assets, and design resources',
    color: 'orange'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliance, SSO, and advanced security features',
    color: 'red'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at TechCorp',
    content: 'WebNest Premium transformed how we handle projects. The analytics alone saved us 10+ hours weekly.',
    avatar: '👩‍💼'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CEO, StartupXYZ',
    content: 'The white-label features helped us launch our client portal in days, not months. Incredible ROI.',
    avatar: '👨‍💻'
  }
]

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Support Available' },
  { value: '100+', label: 'Integrations' }
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
      toast.success('🎉 Welcome to Premium! Your account has been upgraded.')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/client/profile')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Upgrade failed. Please try again.')
    }
  })

  const handleUpgrade = (planType: string) => {
    upgradeMutation.mutate(planType)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      red: 'bg-red-50 text-red-600 border-red-100'
    }
    return colors[color] || colors.blue
  }

  if (user?.isPremium) {
    return (
      <ScrollArea className="h-full">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="container mx-auto py-8 space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/client/profile')} className="hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
            </div>

            {/* Premium Status - Enhanced */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                <Crown className="h-6 w-6" />
                Premium Member
                <Sparkles className="h-5 w-5" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  You're All Set!
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Enjoy unlimited access to all premium features and priority support
                </p>
              </div>
            </div>

            {/* Active Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {premiumFeatures.slice(0, 8).map((feature, index) => {
                const Icon = feature.icon
                const colorClasses = getColorClasses(feature.color)
                return (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorClasses} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Management Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">Manage Your Subscription</h3>
                    <p className="text-gray-600">Update billing, view usage, or manage your account</p>
                  </div>
                  <Button onClick={() => navigate('/client/billing')} className="bg-gray-900 hover:bg-gray-800">
                    Manage Billing
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto py-8 space-y-16 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/client/profile')} className="hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-8 py-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Rocket className="h-4 w-4" />
                Supercharge Your Workflow
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Upgrade to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  WebNest Premium
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Unlock powerful features, priority support, and unlimited possibilities. 
                Join over 50,000 professionals who trust WebNest Premium to scale their business.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-lg text-gray-600">Start with a 14-day free trial. No credit card required.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
              {premiumPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg ${
                    plan.popular 
                      ? 'ring-2 ring-blue-500 scale-105 shadow-blue-100' 
                      : 'hover:scale-105'
                  }`}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                          <Star className="h-4 w-4 mr-2" />
                          Most Popular
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg -z-10"></div>
                    </>
                  )}
                  
                  <CardHeader className="text-center space-y-6 pb-8">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                        <div className="text-left">
                          <div className="text-gray-600">/{plan.period}</div>
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">${plan.originalPrice}</div>
                          )}
                        </div>
                      </div>
                      {plan.savings && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          <Target className="h-3 w-3 mr-1" />
                          {plan.savings}
                        </Badge>
                      )}
                      {plan.id === 'yearly' && (
                        <div className="text-sm text-gray-600">
                          Billed annually ($288/year)
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-3">
                      <Button 
                        className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={upgradeMutation.isPending}
                      >
                        {upgradeMutation.isPending ? (
                          'Processing...'
                        ) : (
                          <>
                            Start Free Trial
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        14-day free trial • Cancel anytime • No setup fees
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Succeed</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help you build, scale, and optimize your workflow
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon
                const colorClasses = getColorClasses(feature.color)
                return (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm hover:-translate-y-1">
                    <CardContent className="p-8 space-y-6 text-center">
                      <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center ${colorClasses} group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Trusted by Industry Leaders</h2>
              <p className="text-lg text-gray-600">See what our premium customers have to say</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-lg">Everything you need to know about WebNest Premium</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Can I cancel anytime?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Cancel your subscription at any time from your account settings. 
                    You'll continue to have access to premium features until the end of your billing period.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">What payment methods do you accept?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We accept all major credit cards (Visa, MasterCard, American Express), 
                    PayPal, and bank transfers for annual subscriptions.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Is there really a free trial?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! All new premium subscriptions include a full 14-day free trial with access 
                    to all features. No credit card required to start.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Can I upgrade or downgrade my plan?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Of course! Change your plan anytime from your account settings. 
                    All changes are prorated and take effect immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

            <div className="relative px-8 py-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">Ready to Transform Your Workflow?</h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of professionals who have already upgraded to Premium. 
                  Start your free trial today and experience the difference premium features can make.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold shadow-xl"
                  onClick={() => handleUpgrade('yearly')}
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                  onClick={() => navigate('/client/profile')}
                >
                  Maybe Later
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
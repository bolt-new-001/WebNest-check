import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Globe, 
  ShoppingCart, 
  Briefcase, 
  User, 
  Building, 
  Palette,
  Code,
  Shield,
  MessageSquare,
  Bot,
  CreditCard,
  Search,
  Zap,
  Mail,
  Smartphone,
  Monitor,
  FileText,
  Star,
  DollarSign,
  Clock,
  Users,
  Sparkles,
  Upload
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { clientApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface ProjectData {
  type: string
  industry: string
  features: string[]
  teamRoles: { role: string; level: string; price: number }[]
  addOns: string[]
  theme: string
  pages: string[]
  customPages: string
  budget: { inr: number; usd: number }
  timeline: number
  packageType?: string
}

const steps = [
  { id: 1, title: 'Type', description: 'What are you building?' },
  { id: 2, title: 'Industry', description: 'Who is it for?' },
  { id: 3, title: 'Features', description: 'What features do you need?' },
  { id: 4, title: 'Team', description: 'Who will build it?' },
  { id: 5, title: 'Add-ons', description: 'Extra services?' },
  { id: 6, title: 'Design', description: 'How should it look?' },
  { id: 7, title: 'Pages', description: 'What pages do you need?' },
  { id: 8, title: 'Summary', description: 'Review and submit' },
]

const projectTypes = [
  { id: 'website', title: 'Website', description: 'Business or personal website', icon: Globe, basePrice: 15000 },
  { id: 'saas', title: 'SaaS Platform', description: 'Software as a Service', icon: Code, basePrice: 50000 },
  { id: 'webapp', title: 'Web App', description: 'Interactive web application', icon: Monitor, basePrice: 35000 },
  { id: 'ecommerce', title: 'eCommerce', description: 'Online store or marketplace', icon: ShoppingCart, basePrice: 25000 },
  { id: 'portfolio', title: 'Portfolio', description: 'Showcase your work', icon: Briefcase, basePrice: 10000 },
]

const industries = [
  { id: 'student', title: 'Student / Small Shop', description: 'Simple, affordable solutions', multiplier: 0.6 },
  { id: 'professional', title: 'Professional / Freelancer', description: 'Professional presence', multiplier: 1.0 },
  { id: 'startup', title: 'Startup', description: 'Growing business needs', multiplier: 1.3 },
  { id: 'business', title: 'Large Business', description: 'Enterprise solutions', multiplier: 1.8 },
  { id: 'personal', title: 'Personal Use', description: 'Personal projects', multiplier: 0.8 },
  { id: 'agency', title: 'Agency', description: 'Agency or consultancy', multiplier: 1.5 },
]

const features = [
  { id: 'auth', title: 'Login/Authentication', description: 'User accounts and login', price: 5000, icon: Shield },
  { id: 'payment', title: 'Payment Gateway', description: 'Accept online payments', price: 8000, icon: CreditCard },
  { id: 'blog', title: 'Blog/News Section', description: 'Content management', price: 4000, icon: FileText },
  { id: 'admin', title: 'Admin Panel', description: 'Backend management', price: 12000, icon: Users },
  { id: 'chat', title: 'Real-time Chat', description: 'Live customer support', price: 6000, icon: MessageSquare },
  { id: 'ai', title: 'AI Integration', description: 'Chatbot or AI features', price: 15000, icon: Bot },
  { id: 'seo', title: 'SEO Optimization', description: 'Search engine optimization', price: 3000, icon: Search },
  { id: 'mobile', title: 'Mobile App', description: 'iOS/Android companion', price: 25000, icon: Smartphone },
]

const teamRoles = [
  {
    role: 'Lead Developer',
    levels: [
      { level: 'Pro (10+ yrs)', price: 40000, usdPrice: 480 },
      { level: 'Senior (5+ yrs)', price: 25000, usdPrice: 300 },
      { level: 'Mid-Level (3+ yrs)', price: 15000, usdPrice: 180 },
    ]
  },
  {
    role: 'Developer',
    levels: [
      { level: 'Mid-Level', price: 10000, usdPrice: 120 },
      { level: 'Junior', price: 5000, usdPrice: 60 },
    ]
  },
  {
    role: 'UI Designer',
    levels: [
      { level: 'Senior', price: 12000, usdPrice: 144 },
      { level: 'Mid-Level', price: 8000, usdPrice: 96 },
    ]
  },
  {
    role: 'QA Tester',
    levels: [
      { level: 'Senior', price: 6000, usdPrice: 72 },
      { level: 'Junior', price: 4000, usdPrice: 48 },
    ]
  },
  {
    role: 'Project Manager',
    levels: [
      { level: 'Senior', price: 8000, usdPrice: 96 },
    ]
  },
]

const addOns = [
  { id: 'seo-setup', title: 'SEO Setup', description: 'Complete SEO optimization', price: 5000 },
  { id: 'hosting', title: 'Domain + Hosting', description: '1 year hosting included', price: 3000 },
  { id: 'branding', title: 'Logo / Branding', description: 'Professional logo design', price: 8000 },
  { id: 'email', title: 'Email Setup', description: 'Professional email accounts', price: 2000 },
  { id: 'animations', title: 'Custom Animations', description: 'Advanced animations', price: 6000 },
  { id: 'api', title: 'API Integration', description: 'Third-party integrations', price: 10000 },
]

const themes = [
  { id: 'minimal', title: 'Clean / Minimal', description: 'Simple and elegant', preview: '/api/placeholder/300/200' },
  { id: 'modern', title: 'Modern / Vibrant', description: 'Bold and contemporary', preview: '/api/placeholder/300/200' },
  { id: 'retro', title: 'Retro / Vintage', description: 'Classic and timeless', preview: '/api/placeholder/300/200' },
  { id: 'animated', title: 'Animation Heavy', description: 'Dynamic and interactive', preview: '/api/placeholder/300/200' },
]

const defaultPages = ['Home', 'About', 'Services', 'Contact']

const studentPackages = [
  {
    id: 'starter',
    title: 'Starter',
    price: 3000,
    usdPrice: 36,
    description: 'Perfect for students and small projects',
    features: ['3 Pages', 'Basic Design', 'Mobile Responsive', '1 Month Support'],
    pages: ['Home', 'About', 'Contact'],
    timeline: 5
  },
  {
    id: 'growth',
    title: 'Growth',
    price: 7500,
    usdPrice: 90,
    description: 'Great for growing businesses',
    features: ['5 Pages', 'Custom Design', 'SEO Basic', '3 Months Support'],
    pages: ['Home', 'About', 'Services', 'Portfolio', 'Contact'],
    timeline: 8,
    popular: true
  },
  {
    id: 'pro',
    title: 'Pro',
    price: 15000,
    usdPrice: 180,
    description: 'Complete solution with premium features',
    features: ['Unlimited Pages', 'Premium Design', 'AI Chat', 'Admin Panel', '6 Months Support'],
    pages: ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'],
    timeline: 12
  },
]

export function AddProject() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<ProjectData>({
    type: '',
    industry: '',
    features: [],
    teamRoles: [],
    addOns: [],
    theme: '',
    pages: [...defaultPages],
    customPages: '',
    budget: { inr: 0, usd: 0 },
    timeline: 0,
  })

  const [showPackages, setShowPackages] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('')

  useEffect(() => {
    calculateBudget()
  }, [projectData.type, projectData.industry, projectData.features, projectData.teamRoles, projectData.addOns, projectData.pages])

  useEffect(() => {
    setShowPackages(projectData.industry === 'student')
  }, [projectData.industry])

  const calculateBudget = () => {
    if (!projectData.type || !projectData.industry) return

    const baseType = projectTypes.find(t => t.id === projectData.type)
    const industryData = industries.find(i => i.id === projectData.industry)
    
    if (!baseType || !industryData) return

    let total = baseType.basePrice * industryData.multiplier

    // Add features cost
    projectData.features.forEach(featureId => {
      const feature = features.find(f => f.id === featureId)
      if (feature) total += feature.price
    })

    // Add team roles cost
    projectData.teamRoles.forEach(role => {
      total += role.price
    })

    // Add add-ons cost
    projectData.addOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId)
      if (addOn) total += addOn.price
    })

    // Add pages cost (₹1000 per additional page beyond 4)
    const additionalPages = Math.max(0, projectData.pages.length - 4)
    total += additionalPages * 1000

    // Calculate timeline (base 7 days + features + pages)
    let timeline = 7
    timeline += projectData.features.length * 2
    timeline += projectData.teamRoles.length * 1
    timeline += additionalPages * 1

    setProjectData(prev => ({
      ...prev,
      budget: {
        inr: Math.round(total),
        usd: Math.round(total * 0.012)
      },
      timeline
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      await clientApi.createProject({
        title: `${projectData.type} for ${projectData.industry}`,
        description: `Custom ${projectData.type} with ${projectData.features.length} features`,
        projectType: projectData.type,
        budget: projectData.budget.inr,
        features: projectData.features,
        timeline: projectData.timeline,
        customRequirements: {
          industry: projectData.industry,
          teamRoles: projectData.teamRoles,
          addOns: projectData.addOns,
          theme: projectData.theme,
          pages: projectData.pages,
          packageType: selectedPackage
        }
      })
      
      toast.success('Project submitted successfully!')
      navigate('/client/projects')
    } catch (error) {
      toast.error('Failed to submit project')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProjectType projectData={projectData} setProjectData={setProjectData} />
      case 2:
        return <StepIndustry projectData={projectData} setProjectData={setProjectData} showPackages={showPackages} selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />
      case 3:
        return <StepFeatures projectData={projectData} setProjectData={setProjectData} />
      case 4:
        return <StepTeamRoles projectData={projectData} setProjectData={setProjectData} />
      case 5:
        return <StepAddOns projectData={projectData} setProjectData={setProjectData} />
      case 6:
        return <StepTheme projectData={projectData} setProjectData={setProjectData} />
      case 7:
        return <StepPages projectData={projectData} setProjectData={setProjectData} />
      case 8:
        return <StepSummary projectData={projectData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/client')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Project</h1>
                <p className="text-gray-600">Let's build something amazing together</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-2 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === steps.length ? (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  Submit Project
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Budget Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <BudgetPanel projectData={projectData} selectedPackage={selectedPackage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Components
function StepProjectType({ projectData, setProjectData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
          What type of project are you building?
        </CardTitle>
        <CardDescription>Choose the category that best describes your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  projectData.type === type.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setProjectData((prev: any) => ({ ...prev, type: type.id }))}
              >
                <CardContent className="p-6 text-center">
                  <type.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                  <Badge variant="outline">From {formatCurrency(type.basePrice)}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StepIndustry({ projectData, setProjectData, showPackages, selectedPackage, setSelectedPackage }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-6 w-6 mr-2 text-blue-600" />
            What industry or category best describes you?
          </CardTitle>
          <CardDescription>This helps us recommend the right features and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry) => (
              <motion.div
                key={industry.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    projectData.industry === industry.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setProjectData((prev: any) => ({ ...prev, industry: industry.id }))}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{industry.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{industry.description}</p>
                    <Badge variant="outline">
                      {industry.multiplier < 1 ? 'Budget Friendly' : 
                       industry.multiplier > 1.5 ? 'Premium' : 'Standard'}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Packages */}
      {showPackages && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Recommended Packages for Students
            </CardTitle>
            <CardDescription>Simple, affordable packages perfect for students and small projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studentPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all relative ${
                      selectedPackage === pkg.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-500 text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-xl mb-2">{pkg.title}</h3>
                        <div className="mb-2">
                          <span className="text-3xl font-bold text-blue-600">{formatCurrency(pkg.price)}</span>
                          <span className="text-gray-500 ml-2">${pkg.usdPrice}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{pkg.description}</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <Badge variant="outline">{pkg.timeline} days delivery</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setSelectedPackage('')}>
                Or continue with custom project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StepFeatures({ projectData, setProjectData }: any) {
  const toggleFeature = (featureId: string) => {
    setProjectData((prev: any) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f: string) => f !== featureId)
        : [...prev.features, featureId]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-6 w-6 mr-2 text-blue-600" />
          What features do you need?
        </CardTitle>
        <CardDescription>Select all the features you want in your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  projectData.features.includes(feature.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleFeature(feature.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <feature.icon className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{formatCurrency(feature.price)}</Badge>
                      <div className="mt-2">
                        <Switch 
                          checked={projectData.features.includes(feature.id)}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StepTeamRoles({ projectData, setProjectData }: any) {
  const addTeamRole = (role: string, level: string, price: number) => {
    setProjectData((prev: any) => ({
      ...prev,
      teamRoles: [...prev.teamRoles, { role, level, price }]
    }))
  }

  const removeTeamRole = (index: number) => {
    setProjectData((prev: any) => ({
      ...prev,
      teamRoles: prev.teamRoles.filter((_: any, i: number) => i !== index)
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          What team do you need?
        </CardTitle>
        <CardDescription>Select the roles and experience levels for your project team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamRoles.map((roleGroup) => (
            <div key={roleGroup.role}>
              <h3 className="font-semibold text-lg mb-3">{roleGroup.role}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {roleGroup.levels.map((level) => (
                  <Card 
                    key={`${roleGroup.role}-${level.level}`}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => addTeamRole(roleGroup.role, level.level, level.price)}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium">{level.level}</h4>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(level.price)}</span>
                        <span className="text-gray-500 text-sm ml-2">${level.usdPrice}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Selected Team */}
          {projectData.teamRoles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Selected Team</h3>
              <div className="space-y-2">
                {projectData.teamRoles.map((role: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium">{role.role}</span>
                      <span className="text-gray-600 ml-2">({role.level})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>{formatCurrency(role.price)}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeTeamRole(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StepAddOns({ projectData, setProjectData }: any) {
  const toggleAddOn = (addOnId: string) => {
    setProjectData((prev: any) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter((a: string) => a !== addOnId)
        : [...prev.addOns, addOnId]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-6 w-6 mr-2 text-blue-600" />
          Additional Services
        </CardTitle>
        <CardDescription>Enhance your project with these optional services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addOns.map((addOn) => (
            <motion.div
              key={addOn.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  projectData.addOns.includes(addOn.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleAddOn(addOn.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{addOn.title}</h3>
                      <p className="text-gray-600 text-sm">{addOn.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{formatCurrency(addOn.price)}</Badge>
                      <div className="mt-2">
                        <Switch 
                          checked={projectData.addOns.includes(addOn.id)}
                          onCheckedChange={() => toggleAddOn(addOn.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StepTheme({ projectData, setProjectData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-6 w-6 mr-2 text-blue-600" />
          Design Preferences
        </CardTitle>
        <CardDescription>Choose the style that matches your vision</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  projectData.theme === theme.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setProjectData((prev: any) => ({ ...prev, theme: theme.id }))}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Palette className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-lg">{theme.title}</h3>
                  <p className="text-gray-600 text-sm">{theme.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <Label htmlFor="reference">Upload Reference Images (Optional)</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Drag and drop images or click to browse</p>
            <Button variant="outline" className="mt-2">Choose Files</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StepPages({ projectData, setProjectData }: any) {
  const [customPage, setCustomPage] = useState('')

  const addPage = (page: string) => {
    if (page && !projectData.pages.includes(page)) {
      setProjectData((prev: any) => ({
        ...prev,
        pages: [...prev.pages, page]
      }))
    }
  }

  const removePage = (page: string) => {
    setProjectData((prev: any) => ({
      ...prev,
      pages: prev.pages.filter((p: string) => p !== page)
    }))
  }

  const addCustomPage = () => {
    if (customPage.trim()) {
      addPage(customPage.trim())
      setCustomPage('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-600" />
          What pages do you need?
        </CardTitle>
        <CardDescription>Select the pages for your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Pages */}
          <div>
            <h3 className="font-semibold mb-3">Selected Pages ({projectData.pages.length})</h3>
            <div className="flex flex-wrap gap-2">
              {projectData.pages.map((page: string) => (
                <Badge 
                  key={page} 
                  variant="secondary" 
                  className="px-3 py-1 cursor-pointer hover:bg-red-100"
                  onClick={() => removePage(page)}
                >
                  {page} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Add Custom Page */}
          <div>
            <Label htmlFor="custom-page">Add Custom Page</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="custom-page"
                placeholder="e.g., FAQ, Pricing, Blog"
                value={customPage}
                onChange={(e) => setCustomPage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomPage()}
              />
              <Button onClick={addCustomPage}>Add</Button>
            </div>
          </div>

          {/* Common Pages */}
          <div>
            <h3 className="font-semibold mb-3">Common Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {['FAQ', 'Pricing', 'Blog', 'Portfolio', 'Team', 'Testimonials', 'Privacy Policy', 'Terms of Service'].map((page) => (
                <Button
                  key={page}
                  variant={projectData.pages.includes(page) ? "default" : "outline"}
                  size="sm"
                  onClick={() => projectData.pages.includes(page) ? removePage(page) : addPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Each additional page beyond 4 pages adds ₹1,000 to the total cost.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StepSummary({ projectData }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="h-6 w-6 mr-2 text-green-600" />
            Project Summary
          </CardTitle>
          <CardDescription>Review your project details before submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Project Type & Industry */}
            <div>
              <h3 className="font-semibold mb-2">Project Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <p className="capitalize">{projectData.type}</p>
                </div>
                <div>
                  <Label>Industry</Label>
                  <p className="capitalize">{projectData.industry}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {projectData.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Features ({projectData.features.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {projectData.features.map((featureId: string) => {
                    const feature = features.find(f => f.id === featureId)
                    return (
                      <Badge key={featureId} variant="outline">
                        {feature?.title}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Team */}
            {projectData.teamRoles.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Team ({projectData.teamRoles.length})</h3>
                <div className="space-y-2">
                  {projectData.teamRoles.map((role: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{role.role} ({role.level})</span>
                      <Badge>{formatCurrency(role.price)}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {projectData.addOns.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Add-ons ({projectData.addOns.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {projectData.addOns.map((addOnId: string) => {
                    const addOn = addOns.find(a => a.id === addOnId)
                    return (
                      <Badge key={addOnId} variant="outline">
                        {addOn?.title}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pages */}
            <div>
              <h3 className="font-semibold mb-2">Pages ({projectData.pages.length})</h3>
              <div className="flex flex-wrap gap-2">
                {projectData.pages.map((page: string) => (
                  <Badge key={page} variant="outline">{page}</Badge>
                ))}
              </div>
            </div>

            {/* Theme */}
            {projectData.theme && (
              <div>
                <h3 className="font-semibold mb-2">Design Theme</h3>
                <Badge variant="outline" className="capitalize">{projectData.theme}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Final Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Final Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <span className="text-4xl font-bold text-blue-600">{formatCurrency(projectData.budget.inr)}</span>
              <span className="text-gray-500 ml-4">${projectData.budget.usd}</span>
            </div>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {projectData.timeline} days
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {projectData.teamRoles.length} team members
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BudgetPanel({ projectData, selectedPackage }: any) {
  const selectedPkg = studentPackages.find(p => p.id === selectedPackage)

  if (selectedPkg) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-center">Selected Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedPkg.title}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(selectedPkg.price)}</span>
                <span className="text-gray-500 block">${selectedPkg.usdPrice}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2 text-sm">
              {selectedPkg.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-sm">
              <span>Timeline:</span>
              <span className="font-medium">{selectedPkg.timeline} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-center">Live Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Budget Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(projectData.budget.inr)}</div>
            <div className="text-gray-500">${projectData.budget.usd}</div>
          </div>

          <Separator />

          {/* Selected Items */}
          <div className="space-y-3 text-sm">
            {projectData.type && (
              <div className="flex justify-between">
                <span>Project Type:</span>
                <span className="font-medium capitalize">{projectData.type}</span>
              </div>
            )}
            
            {projectData.features.length > 0 && (
              <div className="flex justify-between">
                <span>Features:</span>
                <span className="font-medium">{projectData.features.length}</span>
              </div>
            )}
            
            {projectData.teamRoles.length > 0 && (
              <div className="flex justify-between">
                <span>Team Members:</span>
                <span className="font-medium">{projectData.teamRoles.length}</span>
              </div>
            )}
            
            {projectData.addOns.length > 0 && (
              <div className="flex justify-between">
                <span>Add-ons:</span>
                <span className="font-medium">{projectData.addOns.length}</span>
              </div>
            )}
            
            {projectData.pages.length > 0 && (
              <div className="flex justify-between">
                <span>Pages:</span>
                <span className="font-medium">{projectData.pages.length}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Timeline */}
          <div className="flex justify-between items-center">
            <span className="text-sm">Estimated Timeline:</span>
            <Badge variant="outline">{projectData.timeline} days</Badge>
          </div>

          {/* Progress Indicator */}
          <div className="text-center text-xs text-gray-500">
            Complete all steps to get accurate pricing
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
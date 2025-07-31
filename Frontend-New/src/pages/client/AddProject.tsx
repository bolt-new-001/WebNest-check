// Required libraries and installation commands:
// npm install react react-router-dom framer-motion lucide-react sonner @radix-ui/react-progress @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-slider
// UI Components used: Card, Button, Input, Label, Textarea, Badge, Switch, Separator (from shadcn/ui), Progress, Tabs, Tooltip, Select, Slider (from @radix-ui)

// Updated AddProject.jsx with enhanced UI/UX, clickable steps, and detailed data collection

import { useState, useEffect, useRef } from 'react'
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
  Upload,
  Info,
  Calendar,
  Layout,
  Database,
  Settings,
  Lock,
  Image as ImageIcon,
  BarChart,
  Link,
  Eye,
  Edit,
  Trash
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@radix-ui/react-progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Slider } from '@radix-ui/react-slider'
import { clientApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface ProjectData {
  type: string
  industry: string
  features: string[]
  teamRoles: { role: string; level: string; price: number; quantity: number }[]
  addOns: string[]
  theme: string
  pages: string[]
  customPages: string
  budget: { inr: number; usd: number }
  timeline: number
  packageType?: string
  projectName: string
  description: string
  targetAudience: string
  priorityLevel: string
  maintenancePlan: string
  contentProvided: boolean
  domainStatus: string
  inspirationLinks: string[]
  colorPreferences: { primary: string; secondary: string }
  performanceGoals: { loadTime: number; seoScore: number }
  accessibilityLevel: string
}

const steps = [
  { id: 1, title: 'Basic Info', description: 'Project name and description' },
  { id: 2, title: 'Type', description: 'What are you building?' },
  { id: 3, title: 'Industry', description: 'Who is it for?' },
  { id: 4, title: 'Features', description: 'What features do you need?' },
  { id: 5, title: 'Team', description: 'Who will build it?' },
  { id: 6, title: 'Add-ons', description: 'Extra services?' },
  { id: 7, title: 'Design', description: 'How should it look?' },
  { id: 8, title: 'Pages', description: 'What pages do you need?' },
  { id: 9, title: 'Technical', description: 'Performance and accessibility' },
  { id: 10, title: 'Summary', description: 'Review and submit' },
]

const projectTypes = [
  { id: 'website', title: 'Website', description: 'Business or personal website', icon: Globe, basePrice: 15000 },
  { id: 'saas', title: 'SaaS Platform', description: 'Software as a Service', icon: Code, basePrice: 50000 },
  { id: 'webapp', title: 'Web App', description: 'Interactive web application', icon: Monitor, basePrice: 35000 },
  { id: 'ecommerce', title: 'eCommerce', description: 'Online store or marketplace', icon: ShoppingCart, basePrice: 25000 },
  { id: 'portfolio', title: 'Portfolio', description: 'Showcase your work', icon: Briefcase, basePrice: 10000 },
  { id: 'landing', title: 'Landing Page', description: 'Single-page marketing site', icon: Layout, basePrice: 8000 },
]

const industries = [
  { id: 'student', title: 'Student / Small Shop', description: 'Simple, affordable solutions', multiplier: 0.6 },
  { id: 'professional', title: 'Professional / Freelancer', description: 'Professional presence', multiplier: 1.0 },
  { id: 'startup', title: 'Startup', description: 'Growing business needs', multiplier: 1.3 },
  { id: 'business', title: 'Large Business', description: 'Enterprise solutions', multiplier: 1.8 },
  { id: 'personal', title: 'Personal Use', description: 'Personal projects', multiplier: 0.8 },
  { id: 'agency', title: 'Agency', description: 'Agency or consultancy', multiplier: 1.5 },
  { id: 'nonprofit', title: 'Non-Profit', description: 'Charitable organizations', multiplier: 0.7 },
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
  { id: 'analytics', title: 'Analytics Dashboard', description: 'Track user behavior', price: 7000, icon: BarChart },
  { id: 'api', title: 'API Development', description: 'Custom API endpoints', price: 10000, icon: Link },
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
  {
    role: 'DevOps Engineer',
    levels: [
      { level: 'Senior', price: 15000, usdPrice: 180 },
      { level: 'Mid-Level', price: 10000, usdPrice: 120 },
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
  { id: 'security', title: 'Enhanced Security', description: 'SSL, backups, and monitoring', price: 4000 },
  { id: 'maintenance', title: 'Maintenance Plan', description: 'Monthly updates and support', price: 6000 },
]

const themes = [
  { id: 'minimal', title: 'Clean / Minimal', description: 'Simple and elegant', preview: '/api/placeholder/300/200' },
  { id: 'modern', title: 'Modern / Vibrant', description: 'Bold and contemporary', preview: '/api/placeholder/300/200' },
  { id: 'retro', title: 'Retro / Vintage', description: 'Classic and timeless', preview: '/api/placeholder/300/200' },
  { id: 'animated', title: 'Animation Heavy', description: 'Dynamic and interactive', preview: '/api/placeholder/300/200' },
  { id: 'corporate', title: 'Corporate', description: 'Professional and sleek', preview: '/api/placeholder/300/200' },
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

const priorityLevels = ['Low', 'Medium', 'High', 'Urgent']
const maintenancePlans = ['None', 'Basic (Monthly)', 'Premium (Weekly)', 'Enterprise (Daily)']
const domainStatuses = ['I have a domain', 'Need to purchase', 'Not sure']
const accessibilityLevels = ['Basic (WCAG 2.0 A)', 'Standard (WCAG 2.0 AA)', 'Advanced (WCAG 2.0 AAA)']

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
    projectName: '',
    description: '',
    targetAudience: '',
    priorityLevel: 'Medium',
    maintenancePlan: 'None',
    contentProvided: false,
    domainStatus: 'Not sure',
    inspirationLinks: [],
    colorPreferences: { primary: '#3B82F6', secondary: '#10B981' },
    performanceGoals: { loadTime: 2, seoScore: 80 },
    accessibilityLevel: 'Standard (WCAG 2.0 AA)'
  })
  const [showPackages, setShowPackages] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('')
  const [inspirationLink, setInspirationLink] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    calculateBudget()
    // Improved scroll behavior
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        window.scrollTo({
          top: scrollRef.current.offsetTop - 100,
          behavior: 'smooth'
        })
      }
    }, 100) // Small delay to ensure content is rendered
    return () => clearTimeout(timer)
  }, [currentStep])

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
      total += role.price * role.quantity
    })

    // Add add-ons cost
    projectData.addOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId)
      if (addOn) total += addOn.price
    })

    // Add pages cost (₹1000 per additional page beyond 4)
    const additionalPages = Math.max(0, projectData.pages.length - 4)
    total += additionalPages * 1000

    // Maintenance plan cost
    const maintenanceCosts = {
      'None': 0,
      'Basic (Monthly)': 2000,
      'Premium (Weekly)': 5000,
      'Enterprise (Daily)': 10000
    }
    total += maintenanceCosts[projectData.maintenancePlan]

    // Priority level multiplier
    const priorityMultipliers = {
      'Low': 0.9,
      'Medium': 1.0,
      'High': 1.2,
      'Urgent': 1.5
    }
    total *= priorityMultipliers[projectData.priorityLevel]

    // Accessibility level cost
    const accessibilityCosts = {
      'Basic (WCAG 2.0 A)': 1000,
      'Standard (WCAG 2.0 AA)': 3000,
      'Advanced (WCAG 2.0 AAA)': 6000
    }
    total += accessibilityCosts[projectData.accessibilityLevel]

    // Calculate timeline
    let timeline = 7
    timeline += projectData.features.length * 2
    timeline += projectData.teamRoles.length * 1
    timeline += additionalPages * 1
    timeline += priorityMultipliers[projectData.priorityLevel] === 1.5 ? -3 : 0 // Urgent projects get faster delivery

    setProjectData(prev => ({
      ...prev,
      budget: {
        inr: Math.round(total),
        usd: Math.round(total * 0.012)
      },
      timeline
    }))
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || (projectData.type && projectData.industry)) {
      setCurrentStep(stepId)
    }
  }

  const validateStep = (step: number) => {
    switch(step) {
      case 1:
        return !!projectData.projectName && !!projectData.description;
      case 2:
        return !!projectData.type;
      case 3:
        return !!projectData.industry;
      case 4:
        return projectData.features.length > 0;
      case 5:
        return projectData.teamRoles.length > 0;
      default:
        return true;
    }
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields before proceeding');
      return;
    }
    
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
      // Form validation
      if (!projectData.projectName) {
        toast.error('Project name is required');
        return;
      }
      if (!projectData.type) {
        toast.error('Project type is required');
        return;
      }
      if (!projectData.industry) {
        toast.error('Industry is required');
        return;
      }

      // Transform features into required format
      const formattedFeatures = projectData.features.map(featureId => {
        const feature = features.find(f => f.id === featureId);
        return {
          id: featureId,
          name: feature?.title || '',
          description: feature?.description || '',
          price: feature?.price || 0
        };
      });

      // Validate required fields according to backend schema
      if (projectData.budget.inr < 1000) {
        toast.error('Minimum budget should be ₹1,000');
        return;
      }

      const validProjectTypes = ['website', 'ecommerce', 'webapp', 'portfolio', 'landing', 'custom'];
      if (!validProjectTypes.includes(projectData.type)) {
        toast.error('Invalid project type selected');
        return;
      }

      const response = await clientApi.createProject({
        title: projectData.projectName,
        description: projectData.description || `Custom ${projectData.type} with ${projectData.features.length} features`,
        projectType: projectData.type, // Changed from type to projectType
        budget: projectData.budget.inr, // Changed from object to number
        selectedTheme: projectData.theme || null,
        features: formattedFeatures,
        priority: projectData.priorityLevel?.toLowerCase() || 'medium',
        timeline: {
          estimatedDays: projectData.timeline
        },
        status: 'pending',
        industry: projectData.industry,
        requirements: {
          targetAudience: projectData.targetAudience,
          teamRoles: projectData.teamRoles,
          addOns: projectData.addOns,
          theme: projectData.theme,
          pages: projectData.pages,
          packageType: selectedPackage,
          targetAudience: projectData.targetAudience,
          priorityLevel: projectData.priorityLevel,
          maintenancePlan: projectData.maintenancePlan,
          contentProvided: projectData.contentProvided,
          domainStatus: projectData.domainStatus,
          inspirationLinks: projectData.inspirationLinks,
          colorPreferences: projectData.colorPreferences,
          performanceGoals: projectData.performanceGoals,
          accessibilityLevel: projectData.accessibilityLevel
        }
      })

      if (response.status === 201 || response.status === 200) {
        toast.success('Project submitted successfully!')
        navigate('/client/projects')
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error: any) {
      console.error('Project submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit project. Please try again.')
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error('Invalid project data. Please check all required fields.');
      } else if (error.response?.status === 401) {
        toast.error('Please log in again to submit your project.');
        navigate('/auth');
      } else if (error.response?.status === 404) {
        toast.error('Project creation service is currently unavailable.');
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo projectData={projectData} setProjectData={setProjectData} />
      case 2:
        return <StepProjectType projectData={projectData} setProjectData={setProjectData} />
      case 3:
        return <StepIndustry projectData={projectData} setProjectData={setProjectData} showPackages={showPackages} selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />
      case 4:
        return <StepFeatures projectData={projectData} setProjectData={setProjectData} />
      case 5:
        return <StepTeamRoles projectData={projectData} setProjectData={setProjectData} />
      case 6:
        return <StepAddOns projectData={projectData} setProjectData={setProjectData} />
      case 7:
        return <StepTheme projectData={projectData} setProjectData={setProjectData} inspirationLink={inspirationLink} setInspirationLink={setInspirationLink} />
      case 8:
        return <StepPages projectData={projectData} setProjectData={setProjectData} />
      case 9:
        return <StepTechnical projectData={projectData} setProjectData={setProjectData} />
      case 10:
        return <StepSummary projectData={projectData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" ref={scrollRef}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/client')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Project</h1>
                <p className="text-gray-600">Build your vision with precision and detail</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Progress: {Math.round((currentStep / steps.length) * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {steps.map((step, index) => (
              <TooltipProvider key={step.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center cursor-pointer ${currentStep < step.id && (!projectData.type || !projectData.industry) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-500'
                        }`}>
                        {currentStep > step.id ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="ml-3 hidden md:block">
                        <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{step.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <div className="mt-4">
            <Progress value={(currentStep / steps.length) * 100} className="w-full h-2 bg-gray-200" />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Submit Project
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex items-center">
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
function StepBasicInfo({ projectData, setProjectData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="h-6 w-6 mr-2 text-blue-600" />
          Basic Project Information
        </CardTitle>
        <CardDescription>Provide essential details about your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="projectName">Project Name <span className="text-red-500">*</span></Label>
            <Input
              id="projectName"
              placeholder="e.g., My Business Website"
              value={projectData.projectName}
              onChange={(e) => setProjectData((prev: any) => ({ ...prev, projectName: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project goals and vision..."
              value={projectData.description}
              onChange={(e) => setProjectData((prev: any) => ({ ...prev, description: e.target.value }))}
              className="mt-1 h-32"
            />
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Young professionals, Students, Small businesses"
              value={projectData.targetAudience}
              onChange={(e) => setProjectData((prev: any) => ({ ...prev, targetAudience: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="priorityLevel">Priority Level</Label>
            <Select
              value={projectData.priorityLevel}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, priorityLevel: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StepProjectType({ projectData, setProjectData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
          Project Type
        </CardTitle>
        <CardDescription>Choose the category that best describes your project</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="complex">Complex</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map((type) => (
                <ProjectTypeCard key={type.id} type={type} projectData={projectData} setProjectData={setProjectData} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="business">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.filter(t => ['website', 'ecommerce', 'saas'].includes(t.id)).map((type) => (
                <ProjectTypeCard key={type.id} type={type} projectData={projectData} setProjectData={setProjectData} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.filter(t => ['portfolio', 'landing'].includes(t.id)).map((type) => (
                <ProjectTypeCard key={type.id} type={type} projectData={projectData} setProjectData={setProjectData} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="complex">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.filter(t => ['saas', 'webapp'].includes(t.id)).map((type) => (
                <ProjectTypeCard key={type.id} type={type} projectData={projectData} setProjectData={setProjectData} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ProjectTypeCard({ type, projectData, setProjectData }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`cursor-pointer transition-all ${projectData.type === type.id
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
  )
}

function StepIndustry({ projectData, setProjectData, showPackages, selectedPackage, setSelectedPackage }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-6 w-6 mr-2 text-blue-600" />
            Industry/Category
          </CardTitle>
          <CardDescription>This helps us tailor features and pricing</CardDescription>
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
                  className={`cursor-pointer transition-all ${projectData.industry === industry.id
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

      {showPackages && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Student Packages
            </CardTitle>
            <CardDescription>Affordable packages for students and small projects</CardDescription>
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
                    className={`cursor-pointer transition-all relative ${selectedPackage === pkg.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-lg'
                      }`}
                    onClick={() => {
                      setSelectedPackage(pkg.id)
                      setProjectData((prev: any) => ({
                        ...prev,
                        pages: pkg.pages,
                        features: pkg.features.includes('AI Chat') ? ['ai'] : [],
                        budget: { inr: pkg.price, usd: pkg.usdPrice },
                        timeline: pkg.timeline
                      }))
                    }}
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
                Continue with custom project
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
          Features
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
                className={`cursor-pointer transition-all ${projectData.features.includes(feature.id)
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
                  }`}
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
    setProjectData((prev: any) => {
      const existingRoleIndex = prev.teamRoles.findIndex((r: any) => r.role === role && r.level === level)
      if (existingRoleIndex !== -1) {
        const updatedRoles = [...prev.teamRoles]
        updatedRoles[existingRoleIndex].quantity += 1
        return { ...prev, teamRoles: updatedRoles }
      }
      return {
        ...prev,
        teamRoles: [...prev.teamRoles, { role, level, price, quantity: 1 }]
      }
    })
  }

  const updateTeamRoleQuantity = (index: number, quantity: number) => {
    setProjectData((prev: any) => {
      const updatedRoles = [...prev.teamRoles]
      updatedRoles[index].quantity = quantity
      return { ...prev, teamRoles: updatedRoles }
    })
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
          Team Composition
        </CardTitle>
        <CardDescription>Select roles and experience levels for your project team</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 mb-6">
            <TabsTrigger value="all">All Roles</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {teamRoles.map((roleGroup) => (
                <TeamRoleGroup key={roleGroup.role} roleGroup={roleGroup} addTeamRole={addTeamRole} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="development">
            <div className="space-y-6">
              {teamRoles.filter(r => ['Lead Developer', 'Developer', 'DevOps Engineer'].includes(r.role)).map((roleGroup) => (
                <TeamRoleGroup key={roleGroup.role} roleGroup={roleGroup} addTeamRole={addTeamRole} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="design">
            <div className="space-y-6">
              {teamRoles.filter(r => ['UI Designer'].includes(r.role)).map((roleGroup) => (
                <TeamRoleGroup key={roleGroup.role} roleGroup={roleGroup} addTeamRole={addTeamRole} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

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
                    <Input
                      type="number"
                      min="1"
                      value={role.quantity}
                      onChange={(e) => updateTeamRoleQuantity(index, parseInt(e.target.value))}
                      className="w-16"
                    />
                    <Badge>{formatCurrency(role.price * role.quantity)}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamRole(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TeamRoleGroup({ roleGroup, addTeamRole }: any) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">{roleGroup.role}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {roleGroup.levels.map((level: any) => (
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
        <CardDescription>Enhance your project with optional services</CardDescription>
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
                className={`cursor-pointer transition-all ${projectData.addOns.includes(addOn.id)
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
                  }`}
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

function StepTheme({ projectData, setProjectData, inspirationLink, setInspirationLink }: any) {
  const addInspirationLink = () => {
    if (inspirationLink.trim()) {
      setProjectData((prev: any) => ({
        ...prev,
        inspirationLinks: [...prev.inspirationLinks, inspirationLink.trim()]
      }))
      setInspirationLink('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-6 w-6 mr-2 text-blue-600" />
          Design Preferences
        </CardTitle>
        <CardDescription>Define the visual style and inspiration for your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Theme Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <motion.div
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${projectData.theme === theme.id
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
          </div>

          <div>
            <h3 className="font-semibold mb-3">Color Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    id="primaryColor"
                    value={projectData.colorPreferences.primary}
                    onChange={(e) => setProjectData((prev: any) => ({
                      ...prev,
                      colorPreferences: { ...prev.colorPreferences, primary: e.target.value }
                    }))}
                  />
                  <Input
                    value={projectData.colorPreferences.primary}
                    onChange={(e) => setProjectData((prev: any) => ({
                      ...prev,
                      colorPreferences: { ...prev.colorPreferences, primary: e.target.value }
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    id="secondaryColor"
                    value={projectData.colorPreferences.secondary}
                    onChange={(e) => setProjectData((prev: any) => ({
                      ...prev,
                      colorPreferences: { ...prev.colorPreferences, secondary: e.target.value }
                    }))}
                  />
                  <Input
                    value={projectData.colorPreferences.secondary}
                    onChange={(e) => setProjectData((prev: any) => ({
                      ...prev,
                      colorPreferences: { ...prev.colorPreferences, secondary: e.target.value }
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Inspiration Links</h3>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., https://example.com"
                value={inspirationLink}
                onChange={(e) => setInspirationLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInspirationLink()}
              />
              <Button onClick={addInspirationLink}>Add Link</Button>
            </div>
            {projectData.inspirationLinks.length > 0 && (
              <div className="mt-3 space-y-2">
                {projectData.inspirationLinks.map((link: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600">{link}</a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProjectData((prev: any) => ({
                        ...prev,
                        inspirationLinks: prev.inspirationLinks.filter((_: string, i: number) => i !== index)
                      }))}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="reference">Upload Reference Images (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Drag and drop images or click to browse (max 5MB)</p>
              <Button variant="outline" className="mt-2">Choose Files</Button>
            </div>
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
          Pages
        </CardTitle>
        <CardDescription>Select and customize pages for your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          <div>
            <h3 className="font-semibold mb-3">Common Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {['FAQ', 'Pricing', 'Blog', 'Portfolio', 'Team', 'Testimonials', 'Privacy Policy', 'Terms of Service', 'Careers', 'Events'].map((page) => (
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

function StepTechnical({ projectData, setProjectData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-6 w-6 mr-2 text-blue-600" />
          Technical Requirements
        </CardTitle>
        <CardDescription>Specify performance and accessibility needs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="maintenancePlan">Maintenance Plan</Label>
            <Select
              value={projectData.maintenancePlan}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, maintenancePlan: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select maintenance plan" />
              </SelectTrigger>
              <SelectContent>
                {maintenancePlans.map((plan) => (
                  <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contentProvided">Will you provide content?</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="contentProvided"
                checked={projectData.contentProvided}
                onCheckedChange={(checked) => setProjectData((prev: any) => ({ ...prev, contentProvided: checked }))}
              />
              <span>{projectData.contentProvided ? 'Yes, I will provide content' : 'No, I need content creation'}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="domainStatus">Domain Status</Label>
            <Select
              value={projectData.domainStatus}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, domainStatus: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select domain status" />
              </SelectTrigger>
              <SelectContent>
                {domainStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Performance Goals</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="loadTime">Target Page Load Time (seconds)</Label>
                <Slider
                  id="loadTime"
                  min={1}
                  max={5}
                  step={0.1}
                  value={[projectData.performanceGoals.loadTime]}
                  onValueChange={(value) => setProjectData((prev: any) => ({
                    ...prev,
                    performanceGoals: { ...prev.performanceGoals, loadTime: value[0] }
                  }))}
                  className="mt-2"
                />
                <span className="text-sm text-gray-600">{projectData.performanceGoals.loadTime} seconds</span>
              </div>
              <div>
                <Label htmlFor="seoScore">Target SEO Score (%)</Label>
                <Slider
                  id="seoScore"
                  min={50}
                  max={100}
                  step={1}
                  value={[projectData.performanceGoals.seoScore]}
                  onValueChange={(value) => setProjectData((prev: any) => ({
                    ...prev,
                    performanceGoals: { ...prev.performanceGoals, seoScore: value[0] }
                  }))}
                  className="mt-2"
                />
                <span className="text-sm text-gray-600">{projectData.performanceGoals.seoScore}%</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="accessibilityLevel">Accessibility Compliance</Label>
            <Select
              value={projectData.accessibilityLevel}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, accessibilityLevel: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select accessibility level" />
              </SelectTrigger>
              <SelectContent>
                {accessibilityLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <CardDescription>Review all details before submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <p>{projectData.projectName || 'Not specified'}</p>
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <p>{projectData.targetAudience || 'Not specified'}</p>
                </div>
                <div>
                  <Label>Priority Level</Label>
                  <p>{projectData.priorityLevel}</p>
                </div>
                <div>
                  <Label>Maintenance Plan</Label>
                  <p>{projectData.maintenancePlan}</p>
                </div>
              </div>
              <div className="mt-4">
                <Label>Description</Label>
                <p className="text-gray-600">{projectData.description || 'No description provided'}</p>
              </div>
            </div>

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

            {projectData.teamRoles.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Team ({projectData.teamRoles.reduce((sum: number, role: any) => sum + role.quantity, 0)})</h3>
                <div className="space-y-2">
                  {projectData.teamRoles.map((role: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{role.role} ({role.level}) × {role.quantity}</span>
                      <Badge>{formatCurrency(role.price * role.quantity)}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            <div>
              <h3 className="font-semibold mb-2">Pages ({projectData.pages.length})</h3>
              <div className="flex flex-wrap gap-2">
                {projectData.pages.map((page: string) => (
                  <Badge key={page} variant="outline">{page}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Design Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Theme</Label>
                  <p className="capitalize">{projectData.theme || 'Not specified'}</p>
                </div>
                <div>
                  <Label>Colors</Label>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: projectData.colorPreferences.primary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: projectData.colorPreferences.secondary }} />
                  </div>
                </div>
              </div>
              {projectData.inspirationLinks.length > 0 && (
                <div className="mt-4">
                  <Label>Inspiration Links</Label>
                  <div className="space-y-2">
                    {projectData.inspirationLinks.map((link: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600">{link}</a>
                        <Eye className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Technical Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Domain Status</Label>
                  <p>{projectData.domainStatus}</p>
                </div>
                <div>
                  <Label>Content Provided</Label>
                  <p>{projectData.contentProvided ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label>Performance Goals</Label>
                  <p>Load Time: {projectData.performanceGoals.loadTime}s, SEO Score: {projectData.performanceGoals.seoScore}%</p>
                </div>
                <div>
                  <Label>Accessibility</Label>
                  <p>{projectData.accessibilityLevel}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                {projectData.teamRoles.reduce((sum: number, role: any) => sum + role.quantity, 0)} team members
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
      <Card className="sticky top-4 shadow-lg">
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
    <Card className="sticky top-4 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Live Budget</CardTitle>
        <CardDescription className="text-center">Real-time cost estimation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(projectData.budget.inr)}</div>
            <div className="text-gray-500">${projectData.budget.usd}</div>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            {projectData.projectName && (
              <div className="flex justify-between">
                <span>Project:</span>
                <span className="font-medium">{projectData.projectName}</span>
              </div>
            )}
            {projectData.type && (
              <div className="flex justify-between">
                <span>Type:</span>
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
                <span>Team:</span>
                <span className="font-medium">{projectData.teamRoles.reduce((sum: number, role: any) => sum + role.quantity, 0)}</span>
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
            {projectData.maintenancePlan !== 'None' && (
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="font-medium">{projectData.maintenancePlan}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-sm">Estimated Timeline:</span>
            <Badge variant="outline">{projectData.timeline} days</Badge>
          </div>

          <div className="text-center text-xs text-gray-500">
            Complete all steps for accurate pricing
          </div>
        </div>
      </CardContent>  
    </Card>
  )
}

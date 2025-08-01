import { motion } from 'framer-motion';
import { ArrowRight, Users, Code2, Shield, Award, TrendingUp, BarChart2, CheckCircle, Sparkles, Globe, Calendar, Clock, Phone, Mail, Building2, Building, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from 'react-router-dom';

export function Careers () {
  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Careers', href: '/careers' },
  ];

  const footerSections = [
    {
      title: 'Services',
      links: [
        { title: 'Web Development', href: '/services/web' },
        { title: 'E-commerce', href: '/services/ecommerce' },
        { title: 'Mobile Apps', href: '/services/mobile' },
        { title: 'Consulting', href: '/services/consulting' },
      ]
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '/about' },
        { title: 'Portfolio', href: '/portfolio' },
        { title: 'Careers', href: '/careers' },
        { title: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Support',
      links: [
        { title: 'Help Center', href: '/help' },
        { title: 'Documentation', href: '/doc' },
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
      ]
    },
  ];

  const developerRoles = [
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' },
    { value: 'fullstack', label: 'Full Stack Developer' },
    { value: 'mobile', label: 'Mobile Developer' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'qa', label: 'QA Engineer' },
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const experienceYears = [
    { value: '0-1', label: '0-1 Year' },
    { value: '1-3', label: '1-3 Years' },
    { value: '3-5', label: '3-5 Years' },
    { value: '5-10', label: '5-10 Years' },
    { value: '10+', label: '10+ Years' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient from-blue-600 to-purple-600">WebNest</span>
          </Link>
        }
        items={navItems}
        actions={
          <>
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="gradient" size="sm">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative px-4 py-16 mx-auto max-w-7xl"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
              Start Your Developer Journey
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Join our community of talented developers and grow your career with expert guidance and opportunities.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create Developer Account
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Join WebNest
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We provide a platform for developers to showcase their skills and grow professionally.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${benefit.bgColor}`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.color}`} aria-hidden="true" />
                    </div>
                    <p className="text-base font-semibold leading-7 text-gray-900">{benefit.title}</p>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{benefit.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Developer Registration Form */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Create Your Developer Profile
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Share your expertise and connect with potential clients and employers.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input type="text" className="w-full mt-1" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input type="email" className="w-full mt-1" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input type="tel" className="w-full mt-1" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <Input type="text" className="w-full mt-1" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Preferred Role
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your preferred role" />
                      </SelectTrigger>
                      <SelectContent>
                        {developerRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceYears.map((exp) => (
                          <SelectItem key={exp.value} value={exp.value}>
                            {exp.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700">
                      Skill Level
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                      Key Skills
                    </label>
                    <Textarea placeholder="List your key technical skills" className="w-full mt-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Professional Portfolio
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                    Portfolio URL
                  </label>
                  <Input type="url" className="w-full mt-1" />
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                    GitHub Profile
                  </label>
                  <Input type="url" className="w-full mt-1" />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <Input type="url" className="w-full mt-1" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Availability
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                    Available Hours per Week
                  </label>
                  <Input type="number" className="w-full mt-1" />
                </div>
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate ($)
                  </label>
                  <Input type="number" className="w-full mt-1" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to WebNest's Terms of Service and Privacy Policy
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Submit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient from-blue-600 to-purple-600">WebNest</span>
          </Link>
        }
        sections={footerSections}
        social={[
          {
            icon: <Globe className="h-5 w-5" />,
            href: "https://webnest.netlify.app",
            label: "Website"
          },
          {
            icon: <div className="p-1 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-soft">
              <img src="/logo.png" alt="WebNest Icon" className="h-5 w-5 object-cover rounded-sm" />
            </div>,
            href: "https://github.com/webnestpro",
            label: "GitHub"
          },
        ]}
      />
    </div>
  );
};

const benefits = [
  {
    title: 'Expert Guidance',
    description: 'Receive personalized career guidance from industry experts to help you grow professionally.',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Skill Assessment',
    description: 'Get comprehensive skill evaluation and recommendations for improvement.',
    icon: BarChart2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Role Matching',
    description: 'Matched with suitable projects based on your skills and experience.',
    icon: Users2,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Professional Growth',
    description: 'Continuous learning opportunities and career development resources.',
    icon: TrendingUp,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    title: 'Community Support',
    description: 'Join a network of talented developers and industry professionals.',
    icon: Users2,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Recommendations',
    description: 'Earn recommendations and endorsements from satisfied clients.',
    icon: Award,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
];
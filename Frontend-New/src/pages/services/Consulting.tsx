import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Users, Phone, Mail, CheckCircle, Shield, Globe, TrendingUp, Sparkles, Award, BarChart2, Settings, Clock2, MapPin, CalendarDays, Clock, Clock12, Clock9, Clock3, Clock6, Clock90, Clock180, Clock270, Clock30, Clock45, Clock60, Clock75, Clock105, Clock120, Clock135, Clock150, Clock165, Clock180, Clock195, Clock210, Clock225, Clock240, Clock255, Clock270, Clock285, Clock300, Clock315, Clock330, Clock345 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from 'react-router-dom';

const Consulting = () => {
  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Consulting', href: '/services/consulting' },
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

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'CST', label: 'CST (Central Standard Time)' },
    { value: 'MST', label: 'MST (Mountain Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'IST', label: 'IST (India Standard Time)' },
    { value: 'CET', label: 'CET (Central European Time)' },
    { value: 'JST', label: 'JST (Japan Standard Time)' },
  ];

  const meetingTypes = [
    { value: 'general', label: 'General Consultation' },
    { value: 'technical', label: 'Technical Assessment' },
    { value: 'project', label: 'Project Planning' },
    { value: 'strategy', label: 'Business Strategy' },
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
              Expert Technical Consulting Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Get personalized guidance from our industry experts to solve your most complex technical challenges.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Book a Consultation
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Consulting Services
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We offer comprehensive consulting services to help you achieve your technical and business goals.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {services.map((service) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${service.bgColor}`}>
                      <service.icon className={`h-6 w-6 ${service.color}`} aria-hidden="true" />
                    </div>
                    <p className="text-base font-semibold leading-7 text-gray-900">{service.title}</p>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{service.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Meeting Booking Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Schedule Your Consultation
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Have questions? Schedule a meeting with our expert team to get personalized guidance.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Meeting Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700">
                      Type of Consultation
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {meetingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Your Timezone
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Preferred Date
                    </label>
                    <Input type="date" className="w-full mt-1" />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Preferred Time
                    </label>
                    <Input type="time" className="w-full mt-1" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Your Question or Concern
                    </label>
                    <Textarea className="w-full mt-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Schedule Meeting
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

const services = [
  {
    title: 'Technical Assessment',
    description: 'Get a comprehensive analysis of your current technical infrastructure and receive actionable recommendations for improvement.',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Project Planning',
    description: 'Expert guidance in planning and executing your technical projects from concept to completion.',
    icon: BarChart2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Business Strategy',
    description: 'Align your technical solutions with your business goals through strategic planning and consultation.',
    icon: Award,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Security Audit',
    description: 'Comprehensive security assessment and recommendations to protect your digital assets.',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    title: 'Performance Optimization',
    description: 'Expert analysis and optimization of your systems for maximum efficiency and scalability.',
    icon: Rocket,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Technical Training',
    description: 'Customized training programs to enhance your team's technical capabilities.',
    icon: Users,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
];

export default Consulting;

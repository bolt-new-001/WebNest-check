import { motion } from 'framer-motion';
import { Phone, Tablet, Code, Rocket, Users, Shield, BarChart2, Database, Cloud, Settings, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MobileApps = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative px-4 py-16 mx-auto max-w-7xl"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
              Craft Exceptional Mobile Applications
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Create native, cross-platform, and hybrid mobile apps that deliver seamless user experiences across iOS and Android.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Start Your Project
              </Button>
              <Button variant="outline" size="lg">
                View Case Studies
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mobile App Development Services
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We specialize in creating mobile applications that engage users and drive business growth.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-2">
                    <feature.icon className="h-10 w-10 flex-none text-green-600" aria-hidden="true" />
                    <p className="text-base font-semibold leading-7 text-gray-900">{feature.title}</p>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <a href="#" className="text-sm font-semibold leading-6 text-green-600">
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mobile Development Stack
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We utilize the latest technologies to build robust and performant mobile applications.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <tech.icon className="h-6 w-6 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.title}</h3>
                  <p className="text-gray-600">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const features = [
  {
    title: 'Native App Development',
    description: 'Build iOS and Android apps using Swift and Kotlin for optimal performance and native features.',
    icon: Phone,
  },
  {
    title: 'Cross-Platform Solutions',
    description: 'Develop React Native and Flutter apps that run seamlessly across multiple platforms.',
    icon: Tablet,
  },
  {
    title: 'Progressive Web Apps',
    description: 'Create PWA experiences that work offline and can be installed on devices.',
    icon: Rocket,
  },
  {
    title: 'Backend Integration',
    description: 'Implement secure APIs and scalable backend services for your mobile applications.',
    icon: Settings,
  },
  {
    title: 'Performance Optimization',
    description: 'Ensure smooth animations and quick loading times through code optimization.',
    icon: Clock,
  },
  {
    title: 'User Experience Design',
    description: 'Create intuitive interfaces that provide exceptional user experiences.',
    icon: Gift,
  },
];

const technologies = [
  {
    title: 'iOS Development',
    description: 'Swift, SwiftUI, UIKit, Core Data',
    icon: Phone,
  },
  {
    title: 'Android Development',
    description: 'Kotlin, Jetpack Compose, Room Database',
    icon: Tablet,
  },
  {
    title: 'Cross-Platform',
    description: 'React Native, Flutter, Expo',
    icon: Rocket,
  },
  {
    title: 'Backend',
    description: 'Node.js, Firebase, AWS Amplify',
    icon: Database,
  },
  {
    title: 'Cloud Services',
    description: 'AWS, Google Cloud, Azure',
    icon: Cloud,
  },
  {
    title: 'Testing',
    description: 'Jest, Detox, Espresso',
    icon: Shield,
  },
];

export default MobileApps;

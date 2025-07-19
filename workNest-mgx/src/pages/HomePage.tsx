import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Code, 
  FileText, 
  LucideIcon, 
  LayoutDashboard, 
  Users,
  CheckCircle,
  DollarSign
} from "lucide-react";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg p-6 h-full">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features: FeatureProps[] = [
    {
      icon: LayoutDashboard,
      title: "Comprehensive Dashboard",
      description: "Intuitive dashboard with real-time updates on projects, milestones, and communications."
    },
    {
      icon: Users,
      title: "Client Portal",
      description: "Dedicated client area to manage projects, communicate with developers, and track progress."
    },
    {
      icon: Code,
      title: "Developer Workspace",
      description: "Powerful tools for developers to manage projects, track time, and showcase their portfolio."
    },
    {
      icon: FileText,
      title: "Project Management",
      description: "Advanced project management with milestones, revisions, and file sharing capabilities."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Built-in review and approval workflows to ensure project quality at every step."
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description: "Milestone-based payment system with escrow protection for both clients and developers."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header/Nav */}
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              WebNest
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Features
            </Link>
            <Link to="#how-it-works" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              How It Works
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Web Development Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300">
              Connect with top developers, manage your projects, and bring your web ideas to life.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register?role=developer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Join as Developer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Platform Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to create, manage, and deliver web projects successfully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Our simple process helps you get your project from concept to completion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-medium mb-2">Create Your Project</h3>
              <p className="text-muted-foreground">
                Define your project requirements, budget, and timeline through our intuitive project creation wizard.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-medium mb-2">Connect with Developers</h3>
              <p className="text-muted-foreground">
                Browse profiles or get matched with the perfect developer for your specific project needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-medium mb-2">Manage & Complete</h3>
              <p className="text-muted-foreground">
                Track progress, review milestones, and communicate in real-time until your project is successfully delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of clients and developers already using our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:text-blue-600 hover:bg-white">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                WebNest
              </span>
              <p className="mt-2 text-muted-foreground max-w-xs">
                Connecting clients and developers for successful web projects.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">Features</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">For Clients</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">For Developers</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">About</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">Blog</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">Careers</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">Help Center</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">Contact</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-blue-600">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-muted-foreground">
            <p>© 2025 WebNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
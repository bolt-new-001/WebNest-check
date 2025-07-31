import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Book, FileText, Lock, Clock, User, TrendingUp, TrendingDown, Sparkles, CircleDashed, CircleWavy, CircleDashed2, CircleWavy2, CircleDot, CircleDot2, ArrowRight, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'


export function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('1');

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Privacy Policy', href: '/privacy' },
  ]

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
  ]

  return (
    <div className="" >
      <Navbar
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient">WebNest</span>
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

      <div className="container mx-auto py-8 px-4 max-w-4xl bg-white rounded-2xl shadow-lg">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#8b70cd] to-[#aa96da] text-white p-8 rounded-t-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Shield className="h-8 w-8 mr-2" />
              <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-lg">Last Updated: July 24, 2025</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white/10 text-white">
                <Sparkles className="h-4 w-4 mr-2" /> Version 2.0
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white">
                <Clock className="h-4 w-4 mr-2" /> Effective: July 24, 2025
              </Badge>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-8">
            {/* Table of Contents */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-[#8b70cd]" />
                  <a href="#1" className="text-[#8b70cd] hover:text-[#aa96da]">Introduction</a>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-blue-600" />
                  <a href="#2" className="text-[#8b70cd] hover:text-[#aa96da]">Information We Collect</a>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-blue-600" />
                  <a href="#3" className="text-[#8b70cd] hover:text-[#aa96da]">How We Use Your Information</a>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-blue-600" />
                  <a href="#4" className="text-[#8b70cd] hover:text-[#aa96da]">Information Sharing and Disclosure</a>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-blue-600" />
                  <a href="#5" className="text-[#8b70cd] hover:text-[#aa96da]">Data Security</a>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-blue-600" />
                  <a href="#6" className="text-[#8b70cd] hover:text-[#aa96da]">Your Data Protection Rights</a>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <section id="1" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">1. Introduction</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>At WebNest, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.</p>
                <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our platform.</p>
              </div>
            </section>

            <section id="2" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-medium mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and contact information</li>
                  <li>Email address and password</li>
                  <li>Billing and payment information</li>
                  <li>Company details (if applicable)</li>
                  <li>Profile information and preferences</li>
                </ul>

                <h3 className="text-xl font-medium mb-2 mt-6">Usage Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of visits</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </section>

            <section id="3" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <TrendingUp className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We use the collected information for various purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To provide and maintain our services</li>
                  <li>To notify you about changes to our services</li>
                  <li>To provide customer support</li>
                  <li>To process payments and prevent fraud</li>
                  <li>To send administrative information</li>
                  <li>To improve our services and user experience</li>
                  <li>To send marketing and promotional communications (with consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section id="4" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold">4. Information Sharing and Disclosure</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Service providers and business partners</li>
                  <li>Payment processors and financial institutions</li>
                  <li>Law enforcement agencies when required</li>
                  <li>Other users (only with your consent)</li>
                </ul>
                <p className="mt-4">
                  We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent.
                </p>
              </div>
            </section>

            <section id="5" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">5. Data Security</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We implement appropriate technical and organizational security measures to protect your information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data storage and backup systems</li>
                  <li>Employee training on data security</li>
                </ul>
              </div>
            </section>

            <section id="6" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold">6. Your Data Protection Rights</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
                <p>
                  See our Cookie Policy for more information about how we use these technologies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li>Email: privacy@webnest.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Address: WebNest Privacy Office, Tech District, Innovation City</li>
                </ul>
              </div>
            </section>

            <div className="text-sm text-muted-foreground mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <Footer
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img 
                src="/logo.png" 
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient">WebNest</span>
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
            icon: <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img src="/logo.png" alt="WebNest Icon" className="h-5 w-5 object-cover rounded-sm" />
            </div>,
            href: "https://github.com/webnestpro",
            label: "GitHub"
          },
        ]}
      />
      
    </div>
  );
}
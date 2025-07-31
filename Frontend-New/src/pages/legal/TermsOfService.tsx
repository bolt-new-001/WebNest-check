import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Book, FileText, User, TrendingUp, TrendingDown, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Link } from 'react-router-dom'

export function TermsOfService() {
  const [activeSection, setActiveSection] = useState('1');

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Terms of Service', href: '/terms' },
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-8">
            <section id="1" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <Book className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">1. Introduction</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Welcome to WebNest. By accessing or using our platform and services, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services.</p>
                <p>If you do not agree to all the terms and conditions of this agreement, you may not access or use our services.</p>
              </div>
            </section>

            <section id="2" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <FileText className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">2. Definitions</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>"Platform" refers to WebNest's website, applications, and services</li>
                  <li>"User," "you," and "your" refer to individuals or entities using our services</li>
                  <li>"Content" includes text, images, code, and other materials</li>
                  <li>"Services" means all products, features, and functionalities offered by WebNest</li>
                </ul>
              </div>
            </section>

            <section id="3" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <User className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">3. Account Registration</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>To access certain features of our platform, you must register for an account. You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update any changes to your information</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
            </section>

            <section id="4" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <Shield className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">4. User Responsibilities</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>As a user of our platform, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respect intellectual property rights</li>
                  <li>Maintain appropriate conduct and communication</li>
                  <li>Not engage in unauthorized access or use</li>
                  <li>Not interfere with platform operation</li>
                  <li>Not distribute malicious code or content</li>
                </ul>
              </div>
            </section>

            <section id="5" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <TrendingUp className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">5. Service Usage</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-medium mb-2">Acceptable Use</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use services for intended purposes only</li>
                  <li>Follow platform guidelines and documentation</li>
                  <li>Respect system resources and limitations</li>
                  <li>Maintain appropriate security measures</li>
                </ul>

                <h3 className="text-xl font-medium mb-2 mt-6">Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Unauthorized access or hacking attempts</li>
                  <li>Distribution of malware or harmful content</li>
                  <li>Interference with platform operation</li>
                  <li>Violation of user privacy or rights</li>
                </ul>
              </div>
            </section>

            <section id="6" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <TrendingDown className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  All content, features, and functionality of our platform are owned by WebNest and protected by intellectual property laws.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Platform content and code ownership</li>
                  <li>User-generated content licenses</li>
                  <li>Trademark and copyright protection</li>
                  <li>Permitted use and restrictions</li>
                </ul>
              </div>
            </section>

            <section id="7" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#e7e1f5] rounded-full">
                  <Shield className="h-6 w-6 text-[#8b70cd]" />
                </div>
                <h2 className="text-2xl font-semibold">7. Privacy</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Your use of our platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Payment Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Subscription and pricing details</li>
                  <li>Payment processing and billing cycles</li>
                  <li>Refund and cancellation policies</li>
                  <li>Tax responsibilities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We may terminate or suspend your account and access to our services:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>For violations of these terms</li>
                  <li>For illegal or harmful activities</li>
                  <li>For non-payment of fees</li>
                  <li>At our discretion with notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Disclaimers</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our services are provided "as is" and "as available" without warranties of any kind, either express or implied.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>No guarantee of uninterrupted service</li>
                  <li>No warranty of results or outcomes</li>
                  <li>Limitation of implied warranties</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  WebNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes and continued use of our services constitutes acceptance of modified terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  For questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li>Email: legal@webnest.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Address: WebNest Legal Department, Tech District, Innovation City</li>
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
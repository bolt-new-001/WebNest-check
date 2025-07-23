import { ScrollArea } from '@/components/ui/scroll-area';

export function TermsOfService() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to WebNest. By accessing or using our platform and services, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services.
            </p>
            <p className="text-muted-foreground">
              If you do not agree to all the terms and conditions of this agreement, you may not access or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <div className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>"Platform" refers to WebNest's website, applications, and services</li>
                <li>"User," "you," and "your" refer to individuals or entities using our services</li>
                <li>"Content" includes text, images, code, and other materials</li>
                <li>"Services" means all products, features, and functionalities offered by WebNest</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Service Usage</h2>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
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
  );
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to WebNest. By accessing and using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
            </p>
            <p className="text-muted-foreground">
              These terms constitute a legally binding agreement between you and WebNest regarding your use of our website, services, and platform (collectively, the "Services").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>"Platform" refers to the WebNest website and all related services</li>
              <li>"User" refers to any individual or entity that accesses or uses our Services</li>
              <li>"Content" refers to any information, data, text, software, music, sound, photographs, graphics, videos, or messages</li>
              <li>"Account" refers to your registered account on the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Security</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                To access certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update your account information if it changes</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>As a user of our Platform, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not engage in any unauthorized or illegal activities</li>
                <li>Not interfere with the proper functioning of the Platform</li>
                <li>Not attempt to gain unauthorized access to any part of the Services</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Service Usage and Limitations</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our Services are provided "as is" and "as available." We may modify, suspend, or discontinue any aspect of the Services at any time.
              </p>
              <p>
                Usage limitations may apply based on your account type and subscription level. Premium features may require additional payment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                All content and materials available through our Services are protected by intellectual property rights. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or logos without authorization</li>
                <li>Reverse engineer or decompile our software</li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Privacy and Data Protection</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We collect and process personal information as described in our Privacy Policy. By using our Services, you consent to such processing and warrant that all data provided by you is accurate.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Payment Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Certain Services may require payment. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pay all applicable fees and charges</li>
                <li>Provide valid payment information</li>
                <li>Keep your billing information up to date</li>
                <li>Accept our refund and cancellation policies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your access to the Services at any time, without prior notice, for any reason, including if we believe you have violated these Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimer of Warranties</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                THE SERVICES ARE PROVIDED "AS IS" WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes. Your continued use of the Services after such modifications constitutes acceptance of the updated Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: support@webnest.com</li>
                <li>Address: WebNest Headquarters, Tech District, Innovation City</li>
              </ul>
            </div>
          </section>

          <div className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
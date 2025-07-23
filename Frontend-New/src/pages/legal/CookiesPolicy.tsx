import { ScrollArea } from '@/components/ui/scroll-area';

export function CookiesPolicy() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookies Policy</h1>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              This Cookies Policy explains how WebNest uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or work more efficiently, as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, WebNest) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Why Do We Use Cookies?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We use first-party and third-party cookies for several reasons:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Essential cookies: Necessary for the website to function properly</li>
                <li>Performance cookies: Help us understand how visitors interact with our website</li>
                <li>Functionality cookies: Enable personalized features and preferences</li>
                <li>Analytics cookies: Collect data about website usage and performance</li>
                <li>Advertising cookies: Deliver relevant advertisements and track campaign performance</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Types of Cookies We Use</h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                <p>These cookies are strictly necessary for the website to function and cannot be switched off in our systems. They include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Authentication cookies</li>
                  <li>Session state cookies</li>
                  <li>Security cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Performance Cookies</h3>
                <p>These cookies allow us to count visits and traffic sources to measure and improve site performance. They help us know which pages are the most and least popular. They include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analytics cookies</li>
                  <li>Load balancing cookies</li>
                  <li>Response time monitoring cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Functionality Cookies</h3>
                <p>These cookies enable enhanced functionality and personalization. They may be set by us or third-party providers. They include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Language preference cookies</li>
                  <li>Theme preference cookies</li>
                  <li>Customization cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Targeting Cookies</h3>
                <p>These cookies may be set through our site by our advertising partners to build a profile of your interests. They include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Advertising cookies</li>
                  <li>Social media cookies</li>
                  <li>Behavioral tracking cookies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. How to Control Cookies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in the following ways:</p>
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium mb-2">Browser Settings</h3>
                <p>Most web browsers allow you to control cookies through their settings preferences. Common browsers include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google Chrome</li>
                  <li>Mozilla Firefox</li>
                  <li>Safari</li>
                  <li>Microsoft Edge</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-medium mb-2">Cookie Management Tools</h3>
                <p>We provide a cookie management tool that allows you to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>View cookies used on our website</li>
                  <li>Accept or reject cookie categories</li>
                  <li>Update preferences at any time</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. What Happens If You Disable Cookies?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you disable or reject cookies, please note that some parts of our website may become inaccessible or not function properly. For example:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may not be able to log in to your account</li>
                <li>Personalized features may not work</li>
                <li>Your preferences may not be saved</li>
                <li>Some services and functionalities may be unavailable</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or as we otherwise determine is necessary or appropriate. When we make changes, we'll update the "Last Updated" date at the bottom of this policy and post the updated policy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about our use of cookies or this Cookies Policy, please contact us:
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
  );
}
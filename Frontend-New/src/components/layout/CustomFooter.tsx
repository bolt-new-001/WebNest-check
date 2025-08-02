import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'

export function CustomFooter() {
  return (
    <footer className="bg-background/95 border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">WebNest</h3>
            <p className="text-muted-foreground">
              Your trusted partner in web development and digital solutions
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@webnest.com" className="text-muted-foreground hover:text-primary">
                  contact@webnest.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-muted-foreground">+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-muted-foreground">123 Web Street, Digital City</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                About Us
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Services
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Portfolio
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Blog
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon">
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WebNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
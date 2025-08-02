import { useNavigate } from 'react-router-dom'
import { CustomNavbar, CustomFooter } from '@/components/layout'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomNavbar title="404 - Not Found" />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-muted/20 rounded-full blur-3xl animate-pulse delay-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl font-bold text-muted-foreground/50">404</div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist. Let's get you back on track!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/')}>
                Go Home
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  )
}

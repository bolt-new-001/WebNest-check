import { useNavigate } from 'react-router-dom'
import { CustomNavbar, CustomFooter } from '@/components/layout'
import { Button } from '@/components/ui/button'

export function Maintenance() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomNavbar title="Under Maintenance" />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="relative w-80 h-80 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-muted/20 rounded-full blur-3xl animate-pulse delay-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl font-bold text-muted-foreground/50">🛠️</div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">We're Under Maintenance</h1>
            <p className="text-muted-foreground mb-8">
              Our team is working hard to improve the platform. We'll be back soon with even better features!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-muted/20 rounded-full">
                    <div className="h-2 bg-primary rounded-full animate-progress"></div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated time remaining: 15 minutes
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/')}>
                Go Home
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button variant="ghost" size="lg" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  )
}

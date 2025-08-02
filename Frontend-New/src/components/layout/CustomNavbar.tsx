import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface CustomNavbarProps {
  title: string
  showBackButton?: boolean
  onBack?: () => void
}

export function CustomNavbar({ title, showBackButton = true, onBack }: CustomNavbarProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigate('/help')}>
            Help
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contact')}>
            Contact
          </Button>
        </div>
      </div>
    </nav>
  )
}

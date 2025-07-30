import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  description?: string
  items?: NavItem[]
}

interface NavbarProps {
  logo?: React.ReactNode
  items: NavItem[]
  actions?: React.ReactNode
  className?: string
}

export function Navbar({ logo, items, actions, className }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const location = useLocation()

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md shadow-soft",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {logo}
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {items.map((item, index) => (
              <div key={item.title} className="relative">
                {item.items ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center space-x-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-neutral-100",
                        isActive(item.href) && "text-primary bg-primary/10"
                      )}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.title && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft-lg"
                        >
                          <div className="space-y-2">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="block rounded-xl p-3 hover:bg-neutral-50 transition-colors duration-200"
                              >
                                <div className="font-medium text-gray-900">{subItem.title}</div>
                                {subItem.description && (
                                  <div className="text-sm text-gray-600">{subItem.description}</div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-neutral-100",
                      isActive(item.href) && "text-primary bg-primary/10"
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {actions}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-neutral-200 bg-white"
            >
              <div className="space-y-2 px-4 py-6">
                {items.map((item) => (
                  <div key={item.title}>
                    <Link
                      to={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-base font-medium transition-colors duration-200 hover:bg-neutral-100",
                        isActive(item.href) && "text-primary bg-primary/10"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.items && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.href}
                            className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-neutral-50 hover:text-gray-900"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-6 space-y-2">
                  {actions}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
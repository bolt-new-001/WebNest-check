import * as React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FooterSection {
  title: string
  links: {
    title: string
    href: string
  }[]
}

interface FooterProps {
  logo?: React.ReactNode
  sections: FooterSection[]
  social?: {
    icon: React.ReactNode
    href: string
    label: string
  }[]
  copyright?: string
  className?: string
}

export function Footer({ logo, sections, social, copyright, className }: FooterProps) {
  return (
    <footer className={cn("bg-gradient-to-br from-soft to-secondary border-t border-neutral-200", className)}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              {logo}
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Professional web development services that help your business grow and succeed in the digital world.
            </p>
            {social && (
              <div className="flex space-x-4">
                {social.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/50 hover:bg-white transition-all duration-300 hover:scale-110 shadow-soft hover:shadow-soft-lg"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Footer Sections */}
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (sectionIndex + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 mb-6 text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-primary transition-colors duration-300 hover:underline"
                    >
                      {link.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-neutral-300/50 text-center"
        >
          <p className="text-gray-600">
            {copyright || `© ${new Date().getFullYear()} WebNest. All rights reserved.`}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
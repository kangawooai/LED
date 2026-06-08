"use client"

import { motion } from "framer-motion"
import { ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const popularLinks = [
  { title: "Services", href: "/services", description: "Explore our lead generation services" },
  { title: "About Us", href: "/about", description: "Learn about Leads Everyday" },
  { title: "Book a Call", href: "/book-a-call", description: "Book a free consultation" },
  { title: "FAQs", href: "/faqs", description: "Frequently asked questions" },
  { title: "Contact", href: "/book-a-call", description: "Get in touch with our team" },
]

export default function Error404Split() {
  return (
    <section className="mx-auto w-full max-w-4xl p-4">
      <motion.div
        className="overflow-hidden rounded-lg border bg-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div
            className="flex flex-col justify-center border-b px-6 py-12 md:border-r md:border-b-0"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          >
            <h1 className="mb-4 font-semibold tabular-nums text-5xl tracking-tight">404</h1>
            <h2 className="mb-2 font-medium text-xl">Page not found</h2>
            <p className="mb-8 text-muted-foreground text-sm">
              The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or the
              URL might be incorrect.
            </p>
            <div>
              <Button size="sm" className="h-8 gap-2 text-xs" render={<Link href="/" />}>
                <Home className="size-3.5" />
                Go to homepage
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="px-6 py-12"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="mb-4 font-medium text-sm">Popular pages</h3>
            <div className="space-y-1">
              {popularLinks.map((link, index) => (
                <motion.div
                  key={link.href + link.title}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15 + index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 font-medium text-sm">{link.title}</div>
                      <div className="text-muted-foreground text-xs">{link.description}</div>
                    </div>
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

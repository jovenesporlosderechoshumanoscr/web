import { createFileRoute } from '@tanstack/react-router'
import About from '@/components/landing/About'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Newsletter from '@/components/landing/Newsletter'
import Resources from '@/components/landing/Resources'
import Stats from '@/components/landing/Stats'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Resources />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

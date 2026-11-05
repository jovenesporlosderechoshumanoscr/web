import { createFileRoute } from '@tanstack/react-router'
import About from '@/components/landing/About'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import JoinUs from '@/components/landing/JoinUs'
import Law from '@/components/landing/Law'
import NewsSummary from '@/components/landing/NewsSummary'
import Purpose from '@/components/landing/Purpose'
import Stats from '@/components/landing/Stats'
import WhatWeDo from '@/components/landing/WhatWeDo'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Purpose />
        <WhatWeDo />
        <Law />
        <Stats />
        <NewsSummary />
        <JoinUs />
      </main>
      <Footer />
    </div>
  )
}

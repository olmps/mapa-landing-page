import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Method } from "@/components/method";
import { WhatItIs } from "@/components/what-it-is";
import { SocialProof } from "@/components/social-proof";
import { Testimonials } from "@/components/testimonials";
import { QualifyCTA } from "@/components/qualify-cta";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { About } from "@/components/about";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      {/* Floating particles */}
      <div className="floating-particle" aria-hidden="true" />
      <div className="floating-particle" aria-hidden="true" />
      <div className="floating-particle" aria-hidden="true" />
      <div className="floating-particle" aria-hidden="true" />

      <Nav />
      <main>
        <Hero />
        <Problem />
        <Method />
        <WhatItIs />
        <SocialProof />
        <Testimonials />
        <QualifyCTA />
        <Pricing />
        <FAQ />
        <About />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

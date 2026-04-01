export const dynamic = "force-dynamic";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Transformation } from "@/components/transformation";
import { Method } from "@/components/method";
import { Methodology } from "@/components/methodology";
import { WhatItIs } from "@/components/what-it-is";
import { SocialProof } from "@/components/social-proof";
import { Testimonials } from "@/components/testimonials";
import { QualifyCTA } from "@/components/qualify-cta";
import { Qualify } from "@/components/qualify";
import { ValueStack } from "@/components/value-stack";
import { Pricing } from "@/components/pricing";
import { Guarantee } from "@/components/guarantee";
import { FAQ } from "@/components/faq";
import { About } from "@/components/about";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { getVagasRestantes } from "@/lib/edge-config";

export default async function Home() {
  const vagasRestantes = await getVagasRestantes();

  return (
    <>
      {/* Floating particles */}
      <div className="floating-particle" aria-hidden="true" />
      <div className="floating-particle" aria-hidden="true" />
      <div className="floating-particle" aria-hidden="true" />
      <div className="floating-particle" aria-hidden="true" />

      <Nav />
      <FloatingWhatsApp />
      <main>
        <Hero />
        <Problem />
        <Transformation />
        <Method />
        <Methodology />
        <WhatItIs />
        <SocialProof />
        <Testimonials />
        <QualifyCTA />
        <Qualify />
        <ValueStack />
        <Pricing vagasRestantes={vagasRestantes} />
        <Guarantee />
        <FAQ />
        <About />
        <FinalCTA vagasRestantes={vagasRestantes} />
      </main>
      <Footer />
    </>
  );
}

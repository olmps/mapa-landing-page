export const dynamic = "force-dynamic";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Method } from "@/components/method";
import { Methodology } from "@/components/methodology";
import { WhatItIs } from "@/components/what-it-is";
import { SocialProof } from "@/components/social-proof";
import { Testimonials } from "@/components/testimonials";
import { QualifyCTA } from "@/components/qualify-cta";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { About } from "@/components/about";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";
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
      <main>
        <Hero />
        <Problem />
        <Method />
        <Methodology />
        <WhatItIs />
        <SocialProof />
        <Testimonials />
        <QualifyCTA />
        <Pricing vagasRestantes={vagasRestantes} />
        <FAQ />
        <About />
        <FinalCTA vagasRestantes={vagasRestantes} />
      </main>
      <Footer />
    </>
  );
}

import { Header } from './sections/header'
import { Footer } from './sections/footer'
import { Hero } from './sections/hero'
import { About } from './sections/about'
import { Values } from './sections/values'
import { Team } from './sections/team'
import { Process } from './sections/process'
import { Certifications } from './sections/certifications'
import { ContactFormSection } from './sections/contact'
import { ScanOverlay } from './components/dossier/scan-overlay'
import { MarqueeTicker } from './components/dossier/marquee-ticker'
import { CustomCursor } from './components/dossier/custom-cursor'
import { ChapterRail } from './components/dossier/chapter-rail'
import { SectionDivider } from './components/dossier/section-divider'
import { BackToTop } from './components/dossier/back-to-top'

function App() {
  return (
    <>
      <ScanOverlay />
      <MarqueeTicker />
      <CustomCursor />
      <ChapterRail />
      <BackToTop />

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <SectionDivider n={1} />
          <About />
          <SectionDivider n={2} />
          <Values />
          <SectionDivider n={3} />
          <Process />
          <SectionDivider n={4} />
          <Team />
          <SectionDivider n={5} />
          <Certifications />
          <SectionDivider n={6} />
          <ContactFormSection />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App

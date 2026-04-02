import { Header } from './sections/header'
import { Footer } from './sections/footer'
import { Hero } from './sections/hero'
import { About } from './sections/about'
import { Values } from './sections/values'
import { Team } from './sections/team'
import { Process } from './sections/process'
import { ContactFormSection } from './sections/contact'
import { BackgroundController } from './components/background-controller'

function App() {
  return (
    <>
      <BackgroundController />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <Values />
          <Process />
          <Team />
          <ContactFormSection />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App

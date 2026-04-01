import { Header } from './sections/header'
import { Footer } from './sections/footer'
import { Hero } from './sections/hero'
import { About } from './sections/about'
import { Values } from './sections/values'
import { Services } from './sections/services'
import { Team } from './sections/team'
import { Process } from './sections/process'
import { Testimonials } from './sections/testimonials'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Values />
        <Services />
        <Team />
        <Process />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}

export default App

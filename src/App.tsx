import { Header } from './sections/header'
import { Footer } from './sections/footer'
import { Hero } from './sections/hero'
import { About } from './sections/about'
import { Values } from './sections/values'
import { Team } from './sections/team'
import { Process } from './sections/process'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Values />
        <Process />
        <Team />
      </main>
      <Footer />
    </>
  )
}

export default App

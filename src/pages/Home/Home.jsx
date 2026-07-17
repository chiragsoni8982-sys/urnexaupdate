import { Helmet } from 'react-helmet-async'
import Hero from '../../components/Hero/Hero'
import ConstructionExperience from '../../components/ConstructionExperience/ConstructionExperience'
import Services from '../../components/Services/Services'
import Projects from '../../components/Projects/Projects'
import About from '../../components/About/About'
import Testimonials from '../../components/Testimonials/Testimonials'
import Contact from '../../components/Contact/Contact'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>URBNEXA — Constructing Possibilities. Delivering Excellence.</title>
        <meta
          name="description"
          content="URBNEXA is a luxury construction studio delivering residential, commercial, and villa projects with architectural precision."
        />
      </Helmet>
      <Hero />
      <ConstructionExperience />
      <Services />
      <Projects />
      <About />
      <Testimonials />
      <Contact />
    </>
  )
}

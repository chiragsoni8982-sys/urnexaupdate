import { Helmet } from 'react-helmet-async'
import PageHeader from '../../components/PageHeader'
import AboutSection from '../../components/About/About'
import Testimonials from '../../components/Testimonials/Testimonials'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Studio — URBNEXA</title>
      </Helmet>
      <PageHeader
        eyebrow="The Studio"
        title="Craft, held to an engineering standard."
        description="Founded in 1998, URBNEXA has grown into a studio trusted with some of the most demanding private and commercial builds in the country."
      />
      <AboutSection />
      <Testimonials />
    </>
  )
}

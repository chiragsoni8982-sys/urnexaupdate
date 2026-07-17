import { Helmet } from 'react-helmet-async'
import PageHeader from '../../components/PageHeader'
import ServicesSection from '../../components/Services/Services'

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Services — URBNEXA</title>
      </Helmet>
      <PageHeader
        eyebrow="Capabilities"
        title="Every phase, one point of accountability."
        description="From feasibility through final walkthrough, our teams carry a project without handoffs that dilute quality."
      />
      <ServicesSection />
    </>
  )
}

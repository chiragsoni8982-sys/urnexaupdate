import { Helmet } from 'react-helmet-async'
import PageHeader from '../../components/PageHeader'
import ProjectsSection from '../../components/Projects/Projects'

export default function ProjectsPage() {
  return (
    <>
      <Helmet>
        <title>Work — URBNEXA</title>
      </Helmet>
      <PageHeader
        eyebrow="Portfolio"
        title="Landmarks in the making."
        description="A selection of residential, commercial, and civic projects delivered by our studio."
      />
      <ProjectsSection />
    </>
  )
}

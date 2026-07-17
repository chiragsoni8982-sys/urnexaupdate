import { Helmet } from 'react-helmet-async'
import PageHeader from '../../components/PageHeader'
import ContactSection from '../../components/Contact/Contact'

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact — URBNEXA</title>
      </Helmet>
      <PageHeader eyebrow="Get in Touch" title="Start a conversation." />
      <ContactSection />
    </>
  )
}

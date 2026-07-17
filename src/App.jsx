import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Loader from './components/Loader/Loader'
import Cursor from './components/Cursor/Cursor'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import ProjectsPage from './pages/Projects/Projects'
import AboutPage from './pages/About/About'
import ServicesPage from './pages/Services/Services'
import ContactPage from './pages/Contact/Contact'
import { useLenis } from './hooks/useLenis'

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  useLenis()

  return (
    <>
      {loading && <Loader onFinish={() => setLoading(false)} />}
      <Cursor />
      <Navbar />
      <main key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

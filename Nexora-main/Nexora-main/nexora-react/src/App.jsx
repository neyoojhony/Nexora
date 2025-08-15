import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Contact from './pages/Contact.jsx'
import Chat from './pages/Chat.jsx'
import ChatBox from './components/ChatBox.jsx'

export default function App(){
  return (
    <div className="layout">
      <Header/>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      </main>
      <ChatBox />
      <Footer/>
    </div>
  )
}

import { NavLink } from 'react-router-dom'

export default function Header(){
  return (
    <header className="header">
      <div className="brand">
        <img src="/favicon.svg" width="28" height="28" alt="Nexora logo" />
        <span>Nexora</span>
      </div>
      <nav className="nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </header>
  )
}

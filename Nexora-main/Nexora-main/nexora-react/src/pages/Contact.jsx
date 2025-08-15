import { useState } from 'react'

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)

  function onChange(e){
    setForm(f => ({...f, [e.target.name]: e.target.value}))
  }

  function onSubmit(e){
    e.preventDefault()
    setTimeout(()=> setSent(true), 600)
  }

  if(sent) return <section><h1>Thanks!</h1><p>We’ll get back to you soon.</p></section>

  return (
    <section>
      <h1>Contact</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>Name<input name="name" value={form.name} onChange={onChange} required/></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={onChange} required/></label>
        <label>Message<textarea name="message" rows="4" value={form.message} onChange={onChange} required/></label>
        <button className="btn primary" type="submit">Send</button>
      </form>
    </section>
  )
}

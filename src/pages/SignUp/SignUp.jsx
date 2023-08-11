import { useState } from "react";
import { Link } from "react-router-dom";
import visibilityIcon from '../../assets/svg/visibilityIcon.svg' 
import { useSignup } from "../../hooks/useSignup";
import './SignUp.scss'


export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const { name, email, password } = formData
  const { signup, isPending } = useSignup()

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, name, formData)
  } 

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {isPending && <p className="signing-up">Signing up...</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-div">
          <input 
            type="text" 
            minLength="4" 
            maxLength="8"
            placeholder="Name(4-8文字)" 
            id="name" 
            value={name} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="input-div">
          <input 
            type="email" 
            placeholder="Email" 
            id="email" 
            value={email} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="input-div">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            id="password" 
            value={password} 
            onChange={handleChange} 
            required
          />
          <img src={visibilityIcon} alt="show password" onClick={() => setShowPassword(prev => !prev)} />
        </div>
        {!isPending && <button className="signup-button">Sign Up</button>}
        {isPending && <button className="signup-button" disabled style={{borderColor: '#eee', color: '#ccc'}}>Signing up...</button>}
        
      </form>


      <Link to="/sign-in" className="signin-link">Sign In</Link>
    </div>
  )
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import visibilityIcon from '../../assets/svg/visibilityIcon.svg' 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.scss'

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = formData
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
      if(userCredential.user) {
        navigate('/')
      }
      refreshPage()

    } catch(error) {
      switch(error.code) {
        case 'auth/wrong-password':
          toast.error('パスワードが間違っています');
          break;
        case 'auth/user-not-found':
          toast.error('アカウントが見つかりません');
          break;
        case 'auth/too-many-requests':
          toast.error('ログインに複数回失敗したためログインを一時的に無効にしました');
          break;
        default:
          toast.error('エラーが発生しました')
      }
    }
  }

  return (
    <div className="signin-form">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-div">
          <input 
            type="email" 
            placeholder="Email" 
            id="email" 
            value={email} 
            onChange={handleChange} 
          />
        </div>
        <div className="input-div">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            id="password" 
            value={password} 
            onChange={handleChange} 
          />
          <img src={visibilityIcon} alt="show password" onClick={() => setShowPassword(prev => !prev)} />
        </div>

        <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link><br />

        <button className="signin-button">Sign In</button>
      </form>

      <Link to="/sign-up" className="signup-link">Sign Up</Link>
    </div>
  )
}
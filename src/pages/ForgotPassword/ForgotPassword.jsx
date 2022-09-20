import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../firebase/config"
import { toast } from "react-toastify"
import './ForgotPassword.scss'


export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()

      try {
        await sendPasswordResetEmail(auth, email)
        toast.success('パスワードリセットのEmailが送信されました')
        navigate('/sign-in')
      } catch (error) {
        toast.error('パスワードリセットのEmailが送信できませんでした')
      }
    }


  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          id="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <button>Send Reset Link</button>
      </form>
        <Link to="/sign-in">Sign In</Link>
    </div>
  )
}
import { Link } from 'react-router-dom'
import './Footer.scss'

export const Footer = () => {
  return (
    <footer>
      <div className='footer-links'>
        <Link to="/about">About</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
      <p className='copyright'><small>&copy;FS 2022</small></p>
    </footer>
  )
}

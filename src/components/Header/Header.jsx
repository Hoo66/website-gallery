import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Header.scss'
import { auth } from "../../firebase/config";
import { useLogout } from '../../hooks/useLogout';
import titleLogo from '../../assets/png/title.png' 

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [user, setUser] = useState(null)
  const { handleLogout } = useLogout()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    unsubscribe()
  }, [user])

  useEffect(() => {
    const handleClick = (e) => {
        if (!e.target.classList.contains('openbtn')) {
          setShowMenu(false)
        } 
    };

    if(showMenu) {  
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick)
    }
    
  }, [showMenu])

  return (
    <header>
      <div className="container">
        <div className="header-flex">
          <Link to="/"><img className='title-logo' src={titleLogo} alt="" /></Link>
            <button 
              className={`openbtn ${showMenu ? "active" : ""}`}
              onClick={() => setShowMenu(!showMenu)}
            >
              {user ? user.displayName : <>Guest</>}
            </button>
        
          <nav className={`g-nav ${showMenu ? "panel-active" : ""}`}>
            <div className="nav-list">
              <ul>
                {auth.currentUser && <li><Link to="/mypage">My Page</Link></li>}

                {auth.currentUser ? 
                  <>
                    <li><Link to="/addwebsite">Add Website</Link></li>
                    <li><button onClick={handleLogout}>Log Out</button></li>
                  </>:
                  <>
                    <li><Link to="/sign-in">Sign In</Link></li>
                    <li><Link to="/sign-up">Sign Up</Link></li>
                  </>
                }
              </ul>           
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
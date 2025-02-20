
import { useEffect } from 'react'
import { UserMsg } from './UserMsg'
import { NavLink } from 'react-router-dom'
import { LoginSignup } from './LoginSignup.jsx'
import { userService } from '../services/user.service.js'

export function AppHeader() {
  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  async function login( userToLog ) {
    try{
      await userService.login(userToLog)
    }catch(err){
      throw(err)
    }
  }

  function signup( userToSign ) {
    userService.signup(userToSign)
  }

  function logout(){
    userService.logout()
  }

  return (
    <header className='app-header '>
      <UserMsg />
      <div className='header-container'>
      <nav className='app-nav'>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      <LoginSignup onLogin={login} onSignup={signup} onLogout={logout}/>
      <h1>Bugs are Forever</h1>
      </div>
    </header>
  )
}

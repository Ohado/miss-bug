import { useEffect, useState } from "react"
import { userService } from "../services/user.service.js"

export function LoginSignup({onLogin, onSignup, onLogout}) {

    const [userToLog, setUserToLog] = useState(userService.getEmptyUser())
    const [loggedUser, setLoggedUser] = useState(userService.getEmptyUser())
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        async function fetchData () {
            const currentLogged = await userService.getLoggedinUser()
            if(currentLogged)
                setLoggedUser(JSON.parse(currentLogged))
                setIsLogged(true)
        }
        fetchData()
    },[])

    async function handleLogin(ev) {
        ev.preventDefault()
        if(userToLog.username === "" || userToLog.password === "")
            return
        try {
            await onLogin(userToLog)
            setLoggedUser(JSON.parse(await userService.getLoggedinUser()))
            setIsLogged(true)
        }
        catch(err) {
            console.error('cannot log user: ' + err)
        }
    }
    
    async function handleSignup(ev) {
        ev.preventDefault()
        if(userToLog.username === "" || userToLog.password === "")
            return
        try {
            const fullname = prompt("Welcome to the website! Please fill in your full name:")
            setUserToLog({...userToLog, fullname})
            await onSignup(userToLog)
            setLoggedUser(JSON.parse(await userService.getLoggedinUser()))
            setIsLogged(true)
        }
        catch(err) {
            console.error('cannot sign up user: ' + err)
        }
    }

    async function handleLogout() {
        try {
            await onLogout()
            setLoggedUser( userService.getEmptyUser())
            setIsLogged(false)
        }
        catch(err) {
            console.error('cannot log out user: ' + err)
        }
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        setUserToLog(prevUserToLog => ({ ...prevUserToLog, [field]: value }))
    }


    return (
        <div className="login-signup">
            {isLogged ?
                <div>
                    {loggedUser.fullname}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            :
                <form>
                    <div className="form-part-container nogap">
                        <input type="text" id="username" name="username" placeholder="user name" onChange={handleChange} />
                        <input type="text" id="password" name="password" placeholder="password" onChange={handleChange} />
                    </div>
                    <div className="form-part-container">
                        <button onClick={handleLogin}>Login</button>
                        <button onClick={handleSignup}>Signup</button>
                    </div>
                </form>
            }
        </div>
    )
}
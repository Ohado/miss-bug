import axios from "axios"

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyUser,
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user'
const BASE_AUTH_URL = BASE_URL + 'auth'


async function login(userToLog) {
    const {username, password} = userToLog
    try {
        const { data: user } = await axios.post(BASE_AUTH_URL + '/login', {username, password})
        if(user) {
            return saveLoggedUser(user)
        }
    }
    catch(err){
        console.error('login failed: '+err);
        alert('Wrong username or password')
        throw err
    }
}

async function signup(userToSign) {
    const {username, password, fullname} = userToSign
    try {
        const { data: user } = await axios.post(BASE_AUTH_URL + '/signup', {username, password, fullname})
        if(user) {
            console.log('u'+user);
            return saveLoggedUser(user)
        }
    }
    catch(err){
        console.error('signup failed: '+err);
        throw err
    }
}

async function logout() {
    try{
        await axios.post(BASE_AUTH_URL + '/logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    }
    catch(err){
        console.error('logout failed: '+err);
        throw err
    }
}

async function getLoggedinUser() {
    return sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
    return {
        username: "",
        fullname: "",
        password: "",
        score: 0
    }
}

async function saveLoggedUser(user) {
    const { _id, fullname } = user
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify({ _id, fullname }))
    return user
}
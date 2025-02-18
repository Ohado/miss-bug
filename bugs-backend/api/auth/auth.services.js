import {loggerService} from '../../services/logger.service.js'
import {userService} from '../user/user.service.js'
import bcrypt from 'bcrypt'
import Cryptr from 'cryptr'

const cryptr = new Cryptr(process.env.SECRET1 || 'my-crypt-1010')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function signup({username, fullname, password}) {
    
    const saltRound = 10
    try {
        if(!username || !fullname || !password) {
            throw(`missing details!`)
        }
        const userExists = await userService.getByUsername(username)
        if(userExists) {
            throw(`user name exists!`)
        }
        const hash = await bcrypt.hash(password, saltRound)
        return userService.save({
            username: username,
            fullname: fullname,
            password: hash,
        })
    }
    catch (err) {
        loggerService.error("Couldn't sign up: " +err);
    }
}

async function login(username, password) {
    const user = await userService.getByUsername(username)
    if(!user) throw 'unknown user'
    const match = await bcrypt.compare(password, user.password)
    if(!match) throw `user name and password don't match`
    const miniuser = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        score: user.score
    }
    return miniuser
}

async function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encrypted = cryptr.encrypt(str)
    return encrypted
}

async function validateToken(token) {
    try {
        const loggedInUser = JSON.parse(cryptr.decrypt(token))
        return loggedInUser
    }
    catch(err) {
        console.log('incalid login token');
    }
    return null
}
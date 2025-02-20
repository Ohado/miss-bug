import {loggerService} from '../../services/logger.service.js'
import { authService } from './auth.services.js'

export async function signup(req, res) {
    try {
        const credentials = req.body
        loggerService.debug(`taking credentials: ${JSON.stringify(credentials)}`)
        const account = await authService.signup(credentials)
        loggerService.debug(`new account: ${JSON.stringify(account)}`)
        login({...req, body:{username: credentials.username, password: credentials.password}}, res)
    } catch(err) {
        res.status(400).send({err: 'Failed to signup '})
    }
}

export async function login(req, res) {
    const { username, password } = req.body 
    try {
        const user = await authService.login(username, password)
        loggerService.debug(`new login: ${JSON.stringify(user)}`)
        const loginToken = await authService.getLoginToken(user)
        loggerService.debug(`login token: ${JSON.stringify(loginToken)}`)
        res.cookie('loginToken', loginToken, { samesite: 'None', secure: true })
        res.json(user)
    } catch(err) {
        console.error('Failed to login: '+err.msg)
        res.status(401).send({err: 'Failed to login '})
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch(err) {
        res.status(400).send({err: 'Failed to logout '})
    }
}
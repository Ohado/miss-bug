import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:3030', 'http://127.0.0.1:3030'],
    credentials: true
}
const app = express()
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => res.send('Hello there'))

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(3030, () => {console.log('Server ready at port 3030')})

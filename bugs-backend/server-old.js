import cors from 'cors'
import express from 'express'
import { bugService } from './api/bug/bug.service.js'

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:3030', 'http://127.0.0.1:3030'],
    credentials: true
}
const app = express()
app.use(express.static('public'))
app.use(cors(corsOptions))

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {
    res.send(bugService.query())
})

app.get('/api/bug/print', (req, res) => {
    const pdfFile = bugService.exportPDF()
    res.json({path: '/bugs.pdf'})
})

app.get('/api/bug/save', (req, res) => {
    const {_id, title, severity, createdAt} = req.query
    const bugToSave = {_id:_id, title, severity: +severity, createdAt: createdAt}
    try{
        res.send(bugService.save(bugToSave))
    }
    catch {
        res.status(4000, `couldn't save bug`)
    }
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    try {
        res.send(bugService.getById(bugId))
    }
    catch {
        res.status(4000, `couldn't get bug`)
    }
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params

    try {
        bugService.remove(bugId)
        res.send('bug removed')
    }
    catch {
        res.status(4000, `couldn't remove bug`)
    }
})


app.listen(3030, () => {console.log('Server ready at port 3030')})

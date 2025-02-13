import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"

const BUG_LIMIT = 3
const BUG_LIMIT_TIME = 7000

export async function getBugs(req, res) {
    
    const { txt, min_severity, labels, pageIdx, sortBy, sortDir } = req.query
    const filterBy = {
        txt,
        minSeverity: +min_severity,
        labels: labels
    }

    if (pageIdx) filterBy.pageIdx = +pageIdx

    try {
        const bugs = await bugService.query(filterBy, sortBy, pageIdx)

        if(sortDir && sortDir==-1)
            bugs.reverse()

        res.send(bugs)
    } catch (err) {
        loggerService.error('Cannot get bugs', err)
        res.status(400).send('Cannot get bugs')
    }
}

export async function getBug(req, res) {
    const { bugId } = req.params
    try {
        const bug = await bugService.getById(bugId)

        // cookie handling
        const visitedBugsCookie = req.cookies['visitedBugs']
        const visitedBugs = visitedBugsCookie ? [...JSON.parse(visitedBugsCookie), bugId] : [bugId]
        if(visitedBugs.length > BUG_LIMIT) {
            return res.status(401).send('Wait for a bit')
        }
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), {maxAge: BUG_LIMIT_TIME})

        res.send(bug)
        console.log('User visited at the following bugs: ' + visitedBugs);
    } catch (err) {
        console.error(err);
        loggerService.error('Cannot get bug', err)
        res.status(400).send('Cannot get bug')
    }

}
export async function addBug(req, res) {

    const { title, severity } = req.body
    const bugToSave = { title, severity: +severity }
    try {
        const savedbug = await bugService.save(bugToSave)
        res.send(savedbug)
    } catch (err) {
        loggerService.error('Cannot add bug', err)
        res.status(400).send('Cannot add bug')
    }
}

export async function updateBug(req, res) {

    const { _id, title, severity } = req.body
    const bugToSave = { _id, title, severity: +severity }
    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error('Cannot update bug', err)
        res.status(400).send('Cannot update bug')
    }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId)
        res.send('bug Deleted')
    } catch (err) {
        loggerService.error('Cannot remove bug', err)
        res.status(400).send('Cannot remove bug')
    }

}
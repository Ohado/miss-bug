// import { loggerService } from "../../services/logger.service.js";
import { log } from "console";
import { makeId, readJsonFile } from "../../services/util.service.js";
import fs from "fs";

const bugs = readJsonFile('./data/bugs.json')
const PAGE_SIZE = 2

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query(filterBy, sortBy, pageIdx) {
    let bugsToDisplay = bugs
    try {
        // filtering
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        if(filterBy.labels) {
            console.log(filterBy.labels);
            console.log(bugsToDisplay[0].labels);
            bugsToDisplay = bugsToDisplay.filter(bug => bug.labels?.some(label => filterBy.labels.includes(label)))
            console.log(bugsToDisplay[0].labels.some(label => filterBy.labels.includes(label)))
        }

        // sorting
        if(sortBy && bugs[0][sortBy]) {
            if(typeof(bugs[0][sortBy])=='string'){
                bugs.sort((bug1, bug2) => {
                    if (bug1[sortBy] < bug2[sortBy]) {
                        return -1;
                    }
                    return 1;
                })
            }
            else {
                bugs.sort((bug1, bug2) => bug1[sortBy] - bug2[sortBy])
            }
        }

        // paging
        if (pageIdx) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return bugsToDisplay
    } catch (err) {
        // loggerService.error(`Couldn't get bugs`, err);
        console.error(`Couldn't get bugs`, err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        // loggerService.error(`Couldn't get bug`, err);
        throw err
    }
}

async function remove(bugId) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw `Couldn't remove bug with _id ${bugId}`
        bugs.splice(bugIdx, 1)
        return _saveBugsToFile()
    } catch (err) {
        // loggerService.error(`Couldn't get bug`, err);
        throw err
    }
}

async function save(bugToSave) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Couldn't update bug with _id ${bugToSave._id}`
            bugs[idx] = {...bugs[idx], bugToSave}
        } else {
            bugToSave._id = makeId()
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (err) {
        // loggerService.error(`Couldn't get bug`, err);
        throw err
    }
}


function _saveBugsToFile(path = './data/bugs.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}


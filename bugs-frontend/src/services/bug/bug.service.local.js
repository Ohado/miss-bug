import { storageService } from "../async-storage.service.js"
import { loadFromStorage, makeId, saveToStorage } from "../util.service.js"

const BUG_KEY = 'bugDB'
_createBugs()

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
}

async function query(filterBy = {}) {

    try {
        var bugs = await storageService.query(BUG_KEY)

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugs = bugs.filter(bug => regExp.test(bug.vendor))
        }

        if (filterBy.minSeverity) {
            bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }
        return bugs
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

function getById(bugId) {
    return storageService.get(BUG_KEY, bugId)
}

function remove(bugId) {
    return storageService.remove(BUG_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(BUG_KEY, bug)
    } else {
        return storageService.post(BUG_KEY, bug)
    }
}

function getEmptyBug(vendor = '', severity = '') {
    return { vendor, severity }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '' }
}

function _createBugs() {
    let bugs = loadFromStorage(BUG_KEY) || []
    if (bugs.length) return

    bugs.push(_createBug('audu', 300))
    bugs.push(_createBug('fiak', 120))
    bugs.push(_createBug('subali', 50))
    bugs.push(_createBug('mitsu', 150))

    saveToStorage(BUG_KEY, bugs)
}

function _createBug(vendor, severity = 250) {
    const bug = getEmptyBug(vendor, severity)
    bug._id = makeId()
    return bug
}

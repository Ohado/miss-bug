import PDFDocument from 'pdfkit'
import fs from 'fs'
import { utilService } from './util.service.js'


export const bugService = {
    query,
    getById,
    save,
    remove,
    exportPDF
}

const bugs = JSON.parse(fs.readFileSync('./data/bugs.json'))

function query() {
    return bugs
}
function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if(!bug) throw `bug not found: ${bugId}`
    return bug
}
function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if(bugIdx === -1) throw `bug not found: ${bugId}`
    bugs.splice(bugIdx, 1)
}
function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        if(bugIdx === -1) throw `bug not found: ${bug._id}`
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = new Date()
        bugs.push(bug)
    }
    return bug
}
async function exportPDF() {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('./bugs.pdf'));
    doc
    .fontSize(27)
    .text( bugs.map(bug => 
        `**** ${bug.title} ****
** severity: ${bug.severity} **
** ${new Date(bug.createdAt).toUTCString()} **

`
    ) )
    doc.end();
    return doc;
}
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = `//localhost:3030/api/bug/`

export const bugService = {
    query,
    getById,
    save,
    remove,
    exportPDF
}

async function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

async function getById(bugId) {
    try {
        const response = await axios.get(BASE_URL + bugId)
        const bug = response.data
        if(!bug){
            throw new Error (`bug not found: ${bugId}`)
        } 
        return bug

    } catch(err) {
        console.log(err);
        throw new Error (`didn't get the bug: ${err.response.data}`)
    }
}

async function remove(bugId) {
    const { data } = await axios.delete(BASE_URL + bugId)
    return data
}

async function save(bugToSave) {
    if (bugToSave._id) {
        const { data: savedBug } = await axios.put(BASE_URL + bugToSave._id, bugToSave)
        return savedBug
    }
    else {
        const { data: savedBug } = await axios.post(BASE_URL, bugToSave)
        return savedBug
    }
}

async function exportPDF() {
    return axios.get(BASE_URL + `print`).then(res => window.open(res.data.path, '_blank'))
}
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = `//localhost:3030/api/bug`

export const bugService = {
    query,
    getById,
    save,
    remove,
}

async function query() {
    return axios.get(BASE_URL).then(res => res.data)
}
async function getById(bugId) {
    const bug = await axios.get(BASE_URL + '/' + bugId).then(res => res.data)
    console.log(BASE_URL + bugId);
    console.log(bug);
    if(!bug) throw `bug not found: ${bugId}`
    return bug
}
async function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + `/remove`).then(res => res.data)
}
async function save(bug) {
    const baseUrl = BASE_URL + `/save`
    const queryParams = `?title=${bug.title}&severity=${bug.severity}` + (bug._id ? `&_id=${bug._id}` : '')
    console.log(baseUrl + queryParams);
    return axios.get( baseUrl + queryParams ).then(res => res.data)
}
import express from 'express'
import { bugService } from "./bug.service.js";
// import { loggerService } from "../../services/logger.service.js";
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js';

const router = express.Router()

function jo() {
    console.log('jo');
}

router.get('/', getBugs)
router.get('/jo/', jo)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.post('/', addBug)
router.put('/:bugId', updateBug)

export const bugRoutes = router
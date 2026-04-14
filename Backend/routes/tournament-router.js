import express from 'express';
import { verifyAdmin } from '../middlewares/auth-middleware.js';
import { getAllTournaments,addTournament,createEntries, updateTournament } from '../controllers/tournament-controller.js';
const router = express.Router()

//tournament?type=["upcoming","ongoing","history"]
router.get('/',verifyAdmin,getAllTournaments)
router.post('/',verifyAdmin,addTournament)
router.put('/:id',verifyAdmin,updateTournament)
router.post('/createEntry',createEntries)

export default router
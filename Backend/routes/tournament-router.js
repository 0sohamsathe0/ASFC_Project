import express from 'express';
import { verifyAdmin } from '../middlewares/auth-middleware.js';
import { getAllTournaments,addTournament,createEntries, updateTournament,getTournamentEntries } from '../controllers/tournament-controller.js';
const router = express.Router()

//tournament?type=["upcoming","ongoing","history"]
router.get('/',verifyAdmin,getAllTournaments)
router.post('/',verifyAdmin,addTournament)
router.put('/:id',verifyAdmin,updateTournament)

//all tournament Entry realted routes
router.post('/createEntry',createEntries)
router.get('/entry/:tid',getTournamentEntries)

export default router
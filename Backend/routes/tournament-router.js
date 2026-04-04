import express from 'express';
import { verifyAdmin } from '../middlewares/auth-middleware.js';
import { getAllTournaments,addTournament,createEntry } from '../controllers/tournament-controller.js';
const router = express.Router()

//tournament?type=["upcoming","ongoing","history"]
router.get('/',verifyAdmin,getAllTournaments)

router.post('/',verifyAdmin,addTournament)
router.post('/createEntry',createEntry)

export default router
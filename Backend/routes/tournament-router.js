import express from 'express';
import verifyJWT from '../middlewares/auth-middleware.js';
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { getAllTournaments,addTournament,createEntries, updateTournament,getTournamentEntries } from '../controllers/tournament-controller.js';
const router = express.Router()

//tournament?type=["upcoming","ongoing","completed"]
router.get('/',verifyJWT,authorizeRoles('admin'),getAllTournaments)
router.post('/',verifyJWT,authorizeRoles('admin'),addTournament)
router.put('/:id',verifyJWT,authorizeRoles('admin'),updateTournament)

//all tournament Entry realted routes
router.post('/createEntry',verifyJWT,authorizeRoles('admin'),createEntries)
router.get('/entry/:tid',verifyJWT,authorizeRoles('admin'),getTournamentEntries)

export default router
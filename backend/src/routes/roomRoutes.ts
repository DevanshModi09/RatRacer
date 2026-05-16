import express from 'express';
import { RoomControllers } from '../controllers/roomControllers.js';

const router = express.Router();

router.post('/create', RoomControllers.createRoom);
router.post('/join/:roomCode', RoomControllers.joinRoom);
router.get('/public', RoomControllers.getPublicRooms);
router.get('/:roomId', RoomControllers.getRoom);
router.get('/:roomId/players', RoomControllers.getRoomPlayers);

export default router;

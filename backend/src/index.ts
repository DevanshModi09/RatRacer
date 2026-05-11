import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { initSocket } from './socket/initOrGetSocket.js';
import express, { Request, Response } from 'express';
import { socketHandler } from './socket/socketHandler.js';
dotenv.config();
const app = express();
app.use(cors());
const server = createServer(app);
const io = initSocket(server);
socketHandler(io);






const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is running on port : ' + port);
});

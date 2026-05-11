import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { initializeSocket } from './socket/socket.js';
import express, { Request, Response } from 'express';
dotenv.config();
const app = express();
const server = createServer(app);

app.use(express.json());
const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);
initializeSocket(io);
server.listen(port, () => {
  console.log('Server is running on port : ' + port);
});

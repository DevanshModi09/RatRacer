import { createServer } from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { initSocket } from './socket/initOrGetSocket.js';
import express, { Request, Response } from 'express';
import { socketHandler } from './socket/socketHandler.js';
const __dirname = path.resolve();
dotenv.config();
const app = express();
app.use(cors());
const server = createServer(app);
const io = initSocket(server);
socketHandler(io);
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is running on port : ' + port);
});

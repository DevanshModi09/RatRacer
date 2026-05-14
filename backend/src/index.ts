import { createServer } from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { initSocket } from './socket/initOrGetSocket.js';
import express from 'express';
import { socketHandler } from './socket/socketHandler.js';
import authRouter from './routes/authRoutes.js';
dotenv.config();
const app = express();
const server = createServer(app);
const io = initSocket(server);
socketHandler(io);

//Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

//Routes
app.use('/api/v1/auth', authRouter);
//Prod setup
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('/{*path}', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is running on port : ' + port);
});

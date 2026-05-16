import { initSocket } from './socket/initOrGetSocket.js';
import { socketHandler } from './socket/socketHandler.js';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
//Importing middlewares
import { errorHandlerMiddleware } from './middlewares/errorhandler.js';
//Importing Routers
import authRouter from './routes/authRoutes.js';

//Creating a ws server and httpServer
const app = express();
const server = createServer(app);
const io = initSocket(server);
socketHandler(io);
//Other packages
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//Routes
app.use('/api/v1/auth', authRouter);

//Middlewares
app.use(errorHandlerMiddleware);

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

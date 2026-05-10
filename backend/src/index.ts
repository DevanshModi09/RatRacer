import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import express, { Request, Response } from 'express';
dotenv.config();
const app = express();
const server = createServer(app);

app.use(cors());
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

// extending socket type
interface CustomSocket extends Socket {
  username?: string;
}

io.on('connection', (socket: CustomSocket) => {
  console.log('User connected with id : ' + socket.id);

  socket.on('user-connected', (name: string) => {
    socket.username = name;

    io.emit('user-joined', `${name} has joined the website`);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    io.emit('user-left', `${socket.username} has disconnected`);
  });
});
server.listen(port, () => {
  console.log('Server is running on port : ' + port);
});

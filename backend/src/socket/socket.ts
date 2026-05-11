import { Server, Socket } from 'socket.io';
// extending socket type
interface CustomSocket extends Socket {
  username?: string;
}
export const initializeSocket = (io: Server) => {
  io.on('connection', (socket: CustomSocket) => {
    console.log('User connected with id : ' + socket.id);

    socket.on('user-connected', (name: string) => {
      socket.username = name;

      io.emit('user-joined', `${name} has joined the website`);
    });
    socket.on('msg-receive', (msg:string) => {
      io.emit('showmsg', `${msg}`);
    });
    socket.on('disconnect', () => {
      console.log(`${socket.username} disconnected`);

      io.emit('user-left', `${socket.username} has disconnected`);
    });
  });
};

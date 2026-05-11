import { Server, Socket } from 'socket.io';
// extending socket type
interface CustomSocket extends Socket {
  username?: string;
}
export const socketHandler = (io: Server) => {

};

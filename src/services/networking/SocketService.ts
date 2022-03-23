import * as http from 'http';
import * as https from 'https';
import { Server } from 'socket.io';
import UserSocketService from './UserSocketService';

export default class SocketService {
  public engine: Server;
  constructor(server: http.Server | https.Server) {
    this.engine = new Server(server, {
      cors: {
        origin: '*', //https://monoponline.skydonald.com
        optionsSuccessStatus: 200
      },
      transports: ['websocket']
    });
  }

  public start() {
    this.engine.on('connection', (socket) =>
      new UserSocketService(socket).checkError()?.setup()
    );
  }
}

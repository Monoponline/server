import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ['websocket', 'polling']
});

app.use(express.static(__dirname + '/public'));
server.listen(3000, () => {
    console.log('Listening to port: 3000');
});

io.on('connection', (socket) => {
    console.log('A user has connected');
});

import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import Game from './Game';
import Utils from './Utils';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ['websocket']
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*'
  })
);
server.listen(8080, () => {
  console.log('Listening to port: 8080');
});

const games: Game[] = [];
const takenUsername: string[] = [];

app.get('/is-username-taken', (req, res) => {
  res.json(takenUsername.includes(req.query.username as string));
});

io.on('connection', (socket) => {
  if (!Utils.isSocketValid(socket)) return socket.disconnect(true);
  takenUsername.push(socket.handshake.query.username as string);
  socket.on('disconnect', () =>
    takenUsername.splice(
      takenUsername.indexOf(socket.handshake.query.username as string),
      1
    )
  );
  const requestJoinGameListener = (gameId: string) => {
    let game = games.find((g) => g.getId() === gameId);
    if (!game) {
      game = new Game(gameId);
      games.push(game);
    }

    game.join(socket.handshake.query.username as string, socket);
    game.on('start', () => {
      socket.removeListener('player-start', playerStartListener);
      socket.removeListener('request-join-game', requestJoinGameListener);
    });
    game.on('stop', () => {
      games.splice(games.indexOf(game!), 1);
      socket.once('request-join-game', requestJoinGameListener);
    });
    socket.on('leave-game', () => {
      game!.leave(socket.handshake.query.username as string);
      socket.once('request-join-game', requestJoinGameListener);
    });
    socket.on('disconnect', () => {
      game!.leave(socket.handshake.query.username as string);
    });

    const playerStartListener = () => {
      if (game!.canStart()) {
        socket.removeListener('player-start', playerStartListener);
        game!.start();
      }
    };
    socket.once('player-start', playerStartListener);
  };
  socket.once('request-join-game', requestJoinGameListener);
});

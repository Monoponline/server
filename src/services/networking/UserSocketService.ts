import { Socket } from 'socket.io';
import { DefaultEventsMap } from '../../../node_modules/socket.io/dist/typed-events';
import Utils from '../../utils/Utils';
import Game from '../game/Game';
import GameService from '../game/GameService';
import Logger from '../logger/Logger';
import PlayerService from '../player/PlayerService';

export default class UserSocketService {
  private socket: UserSocket;
  private username: string;
  private game?: Game;

  constructor(socket: UserSocket) {
    this.socket = socket;
    this.username = socket.handshake.query['username'] as string;
  }

  public checkError() {
    if (!Utils.isSocketValid(this.socket))
      return void this.socket.disconnect(true);
    return this;
  }

  public setup() {
    PlayerService.instance.add(this.username);
    this.socket.on('disconnect', this.onDisconnect);
    this.socket.on('error', this.onError);
    this.socket.on('request-join-game', this.requestJoinGameListener);
    this.socket.on('player-start', this.playerStartListener);
  }

  private playerStartListener = () => {
    if (this.game.canStart()) {
      this.game.start();
    }
  };

  private requestJoinGameListener = (gameId: string) => {
    this.game = GameService.instance.get(gameId);
    if (!this.game) {
      this.game = new Game(gameId);
      GameService.instance.add(this.game);
    }

    this.game.join(this.username, this.socket);
    this.game.on('stop', () => {
      this.game = null;
    });
    this.socket.on('leave-game', () => {
      this.game.leave(this.username);
      this.game = null;
    });
  };

  private onDisconnect = () => {
    this.game?.leave(this.username);
    PlayerService.instance.remove(this.username);
  };

  private onError = (err: Error) => {
    this.socket.disconnect(true);
    this.game?.leave(this.username);
    PlayerService.instance.remove(this.username);
    Logger.log(
      'ERROR:'.red,
      err.message.magenta,
      ','.magenta,
      err.stack.magenta
    );
  };
}

export type UserSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap
>;

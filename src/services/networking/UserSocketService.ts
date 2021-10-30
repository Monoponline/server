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
    if (
      !Utils.isSocketValid(this.socket) ||
      PlayerService.instance.contains(
        this.socket.handshake.query['username'] as string
      )
    )
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
    if (this.game) return;
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
  UserSocketListenEventsMap,
  UserSocketEmitEventsMap
>;

export interface UserSocketListenEventsMap {
  'roll-dice': () => void;
  'leave-game': () => void;
  'player-start': () => void;
  'buy-property': (cell: number) => void;
  'sell-property': (cell: number) => void;
  'response-trade': (accept: boolean) => void;
  'response-choice': (choice: number) => void;
  'mortgage-property': (cell: number) => void;
  'trade-request': (tradeJSON: string) => void;
  'request-join-game': (gameId: string) => void;
  'unmortgage-property': (cell: number) => void;
}

export interface UserSocketEmitEventsMap {
  win: () => void;
  start: () => void;
  'cant-sell': () => void;
  'cant-upgrade': () => void;
  'canceled-trade': () => void;
  'trade-req-sent': () => void;
  'cc-card': (title: string) => void;
  'user-join': (player: string) => void;
  'left-game': (player: string) => void;
  'exit-jail': (player: string) => void;
  'paid-taxes': (player: string) => void;
  'is-in-jail': (player: string) => void;
  'chance-card': (title: string) => void;
  'friend-gift': (player: string) => void;
  'player-broke': (player: string) => void;
  'player-in-jail': (player: string) => void;
  'not-mortgaged': (property: string) => void;
  'sold-house': (propertyName: string) => void;
  'paid-luxury-taxe': (player: string) => void;
  'game-state': (gameStateJSON: string) => void;
  fine: (player: string, money: number) => void;
  'already-mortgaged': (property: string) => void;
  'buy-house': (player: string, cell: string) => void;
  'player-move': (player: string, cell: string) => void;
  'cant-afford': (player: string, cell: string) => void;
  earn: (player: string, money: number | string) => void;
  'dice-roll': (player: string, dices: number[]) => void;
  'trade-req': (name: string, tradeJSON: string) => void;
  choice: (question: string, responses: string[]) => void;
  'bought-house': (player: string, property: string) => void;
  'joined-game': (gameId: string, asSpectator?: boolean) => void;
  'mortgage-property': (player: string, property: string) => void;
  'unmortgage-property': (player: string, property: string) => void;
  'paid-rent': (player: string, renter: string, rent: number) => void;
}

export type Callback<T extends any[]> = Function<T, void>;
export type Function<T extends any[], K extends any> = (...args: T) => K;
export type AsyncFunction<T extends any[], K extends any> = Function<
  T,
  Promise<K>
>;

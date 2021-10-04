import { Socket } from 'socket.io/dist/socket';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Player from './Player';
import Utils from './Utils';
import Eventable from './utils/Eventable';

export default class Game extends Eventable {
  private takenAvatars = [];
  private id: string;
  private players: Player[] = [];
  private spectators: string[] = [];
  private started: boolean = false;
  private turn: number = 0;
  private houses: Houses[] = [];
  private socket: {
    [username: string]: Socket<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap
    >;
  } = {};

  constructor(id: string) {
    super();
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public isStarted() {
    return this.started;
  }

  public getTurn() {
    return this.turn + 1;
  }

  public getPlayerTurn() {
    return this.getPlayers()[this.turn];
  }

  public getPlayers() {
    return this.players;
  }

  public getPlayerList() {
    return this.players.map((p) => p.getName());
  }

  public join(
    player: string,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
  ) {
    if (this.getPlayerList().includes(player)) return;
    if (this.players.length < 4 && !this.isStarted()) {
      this.players.push(new Player(player));
      socket.emit('joined-game', this.id);
    } else {
      this.spectators.push(player);
      socket.emit('joined-game', this.id, true);
    }
    this.socket[player] = socket;
    this.update();
    if (this.players.length === 4) {
      this.start();
    }
  }

  public leave(player: string) {
    const isAPlayer = this.getPlayerList().includes(player);
    if (this.started && isAPlayer) {
      this.handleDisconnect(this.players[this.getPlayerList().indexOf(player)]);
    }
    if (isAPlayer) this.players.splice(this.getPlayerList().indexOf(player), 1);
    if (this.spectators.includes(player))
      this.spectators.splice(this.spectators.indexOf(player), 1);
    delete this.socket[player];
    if (this.players.length < 2) return this.stop();
    this.update();
  }

  public handleDisconnect(player: Player) {
    for (const p in this.socket) {
      const socket = this.socket[p];
      socket.emit('left-game', player.getName());
      player.getProperties().forEach((property) => {
        this.houses.forEach((house) => {
          if (property === house.cell)
            delete this.houses[
              this.houses.map((h) => h.cell).indexOf(property)
            ];
        });
      });
    }
  }

  public getCellState(cell: number) {
    for (const player of this.players) {
      if (player.getProperties().includes(cell)) return player;
    }
    return null;
  }

  public getSocket(player: string) {
    return this.socket[player];
  }

  public start() {
    this.started = true;
    for (const player of this.players) {
      const avatars = Player.AVATARS.filter(
        (a) => !this.takenAvatars.includes(a)
      );
      const avatar = avatars[Math.floor(Math.random() * avatars.length)];
      this.takenAvatars.push(avatar);
      player.setAvatar(avatar);
    }
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('game-state', this.toString());
    }
    this.emit('start');
    this.socket[this.getPlayerTurn().getName()].once('roll-dicer', this.diceRolled);
  }

  public diceRoll(dices: number[]) {
    const player = this.getPlayerTurn();
    player.setPosition(player.getPosition() + Utils.sum(...dices));
    this.handlePlayerLand();
    this.nextTurn();
  }

  public handlePlayerLand() {
    const player = this.getPlayerTurn();
    const position = player.getPosition();
  }

  public getCellHouses(position: number) {
    const state = this.getGameState();
    for (const house of state.houses) {
      if (house.cell === position) return house.houses;
    }
    return null;
  }

  public emitToEveryone(event: string, ...args: any[]) {
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit(event, ...args);
    }
  }

  public stop() {
    this.started = false;
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('win');
      delete this.socket[player];
    }
    this.emit('stop');
  }

  public update() {
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('game-state', this.toString());
    }
  }

  public nextTurn() {
    const current = this.getTurn();
    if (current < this.players.length) this.turn++;
    else this.turn = 0;
    this.socket[this.getPlayerTurn().getName()].once('roll-dice', this.diceRolled);
  }

  public diceRolled() {
    const dices = Utils.rollDice(2);
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('dice-roll', this.getPlayerTurn(), dices);
    }
    this.diceRoll(dices);
  }

  public toString() {
    return JSON.stringify(this.getGameState());
  }

  public getGameState(): GameState {
    return {
      houses: this.houses,
      players: this.players.map((p) => JSON.parse(p.toJSON())),
      spectating: this.spectators.length,
      turn: this.getPlayerTurn().getName(),
      id: this.id,
      started: this.started
    };
  }

  public defaultString() {
    return JSON.stringify({
      houses: [],
      players: [],
      spectating: 0,
      turn: '',
      id: this.id,
      started: false
    } as GameState);
  }

  public canJoin() {
    return this.players.length < 4 && !this.started;
  }

  public canStart() {
    if (this.players.length <= 4 && this.players.length >= 2 && !this.started) {
      return true;
    } else {
      return false;
    }
  }
}

export interface GameState {
  houses: Houses[];
  players: string[];
  spectating: number;
  turn: string;
  id: string;
  started: boolean;
}

export interface Houses {
  cell: number;
  houses: number;
}

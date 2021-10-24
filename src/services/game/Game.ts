import { Socket } from 'socket.io/dist/socket';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Utils from '../../utils/Utils';
import Eventable from '../../utils/Eventable';
import Board from '../board/Board';
import BoardService, { runDice } from '../board/BoardService';
import Player from '../player/Player';
import BankService from '../bank/BankService';

export default class Game extends Eventable {
  public takenAvatars = [] as string[];
  public id: string;
  public players = [] as Player[];
  public spectators = [] as string[];
  public started = false;
  public turn = 0;
  public houses = [] as Houses[];
  public socket: {
    [username: string]: Socket<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap
    >;
  } = {};

  public bankService: BankService;

  constructor(id: string) {
    super();
    this.id = id;
    this.bankService = new BankService();
  }

  public getTurn() {
    return this.turn + 1;
  }

  public getPlayerTurn() {
    return this.players[this.turn];
  }

  public getPlayerList() {
    return this.players.map((p) => p.name);
  }

  public join(
    player: string,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
  ) {
    if (this.getPlayerList().includes(player)) return;
    if (this.players.length < 4 && !this.started) {
      this.players.push(new Player(player));
      socket.emit('joined-game', this.id);
    } else {
      this.spectators.push(player);
      socket.emit('joined-game', this.id, true);
    }
    this.socket[player] = socket;
    this.update();
    if (this.players.length === 4) this.start();
  }

  public leave(player: string) {
    const isAPlayer = this.getPlayerList().includes(player);
    if (this.started && isAPlayer)
      this.handleDisconnect(this.players[this.getPlayerList().indexOf(player)]);
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
      socket.emit('left-game', player.name);
      player.properties.forEach((property) => {
        this.houses.forEach((house) => {
          if (property === house.cell)
            delete this.houses[
              this.houses.map((h) => h.cell).indexOf(property)
            ];
        });
      });
    }
    this.update();
  }

  public getCellState(cell: number) {
    for (const player of this.players) {
      if (player.properties.includes(cell)) return player;
    }
    return null;
  }

  public start() {
    this.started = true;
    for (const player of this.players) {
      const avatars = Player.AVATARS.filter(
        (a) => !this.takenAvatars.includes(a)
      );
      const avatar = avatars[Math.floor(Math.random() * avatars.length)];
      this.takenAvatars.push(avatar);
      player.avatar = avatar;
    }
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('game-state', this.toString());
    }
    this.emit('start');
    this.socket[this.getPlayerTurn().name].once('roll-dice', () =>
      this.diceRolled()
    );
    this.setupListeners();
  }

  public setupListeners() {
    for (const p in this.socket) {
      const socket = this.socket[p];
      const player = this.getPlayer(p);
      socket.on('trade-request', player.tradeRequest);
      socket.on('buy-property', player.buyProperty);
      socket.on('sell-property', player.sellProperty);
    }
  }

  public getPlayer(player: string) {
    return this.players[this.players.map((p) => p.name).indexOf(player)];
  }

  public handlePlayerLand(oldPos: number, dice: number) {
    const player = this.getPlayerTurn();
    const position = player.position;
    if (oldPos > position) player.account += 200;
    return BoardService(
      this,
      Board.cells.find((cell) => cell.position === position)!,
      dice
    );
  }

  public getCellHouses(position: number) {
    const state = this.getGameState();
    for (const house of state.houses) {
      if (house.cell === position) return house.houses;
    }
    return 0;
  }

  public emitToEveryone(event: string, ...args: any[]) {
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit(event, ...args);
    }
  }

  public emitToUser(player: string, event: string, ...args: any[]) {
    const socket = this.socket[player];
    socket?.emit(event, ...args);
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
    this.emitToEveryone('game-state', this.toString());
  }

  public nextTurn() {
    const current = this.getTurn();
    if (current < this.players.length) this.turn++;
    else this.turn = 0;
    this.update();
    this.socket[this.getPlayerTurn().name].once('roll-dice', () =>
      this.diceRolled()
    );
  }

  public diceRolled() {
    const dices = Utils.rollDice(2);
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('dice-roll', this.getPlayerTurn().name, dices);
    }
    runDice(this, dices);
  }

  public toString() {
    return JSON.stringify(this.getGameState());
  }

  public getGameState(): GameState {
    return {
      houses: this.houses,
      players: this.players.map((p) => JSON.parse(p.toJSON())),
      spectating: this.spectators.length,
      turn: this.getPlayerTurn().name,
      id: this.id,
      started: this.started
    };
  }

  public getDefaultState() {
    return {
      houses: [],
      players: [],
      spectating: 0,
      turn: '',
      id: this.id,
      started: false
    } as GameState;
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

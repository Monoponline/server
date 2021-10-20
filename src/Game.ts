import { Socket } from 'socket.io/dist/socket';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Player from './Player';
import Utils from './Utils';
import Actions from './utils/Actions';
import Board from './utils/Board';
import Eventable from './utils/Eventable';

export default class Game extends Eventable {
  private takenAvatars = [] as string[];
  private id: string;
  private players = [] as Player[];
  private spectators = [] as string[];
  private started = false;
  private turn = 0;
  private houses = [] as Houses[];
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
    this.socket[this.getPlayerTurn().getName()].once('roll-dice', () =>
      this.diceRolled()
    );
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.on('trade-request', (json: string) => {
        const trade = JSON.parse(json);
        const s = this.socket[trade.player];
        if (s) {
          s.emit('trade-req', player, JSON.stringify(trade));
          socket.emit('trade-req-sent');
          s.on('response-trade', (accept: boolean) => {
            if (accept) {
              for (const property of trade.cardToGive) {
                this.getPlayer(player).removeProperty(property.value);
                this.getPlayer(trade.player).addProperty(property.value);
              }
              for (const property of trade.cardToReceive) {
                this.getPlayer(player).addProperty(property.value);
                this.getPlayer(trade.player).removeProperty(property.value);
              }
              this.getPlayer(player).setAccount(
                this.getPlayer(player).getAccount() + trade.moneyToReceive
              );
              this.getPlayer(trade.player).setAccount(
                this.getPlayer(trade.player).getAccount() - trade.moneyToReceive
              );
              this.getPlayer(player).setAccount(
                this.getPlayer(player).getAccount() - trade.moneyToGive
              );
              this.getPlayer(trade.player).setAccount(
                this.getPlayer(trade.player).getAccount() + trade.moneyToGive
              );
              this.update();
            } else {
              socket.emit('canceled-trade');
            }
          });
        }
      });
      socket.on('buy-property', (cell: number) => {
        if (
          Board.cells
            .filter((c) => c.color === Board.cells[cell].color)
            .find(
              (c) => this.getCellHouses(c.position) < this.getCellHouses(cell)
            ) ||
          this.getCellHouses(cell) <= 5
        ) {
          return socket.emit('cant-upgrade');
        }
        const price = Board.housesPrice[Board.cells[cell].color];
        if (this.getPlayerTurn().getName() !== player) return;
        if (
          Board.cells.filter((c) => c.color === Board.cells[cell].color)
            .length ===
          this.getCellState(cell)
            .getProperties()
            .filter((p) => Board.cells[cell].color === Board.cells[p].color)
            .length
        )
          return;
        if (this.getPlayer(player).canAfford(price)) {
          const house = this.houses.find((h) => h.cell === cell);
          house ? house.houses++ : this.houses.push({
            houses: 1,
            cell
          });
          socket.emit('bought-house', Board.cells[cell].name);
          this.update();
        } else {
          this.emitToEveryone('cant-afford', player, `${cell} maisons`);
        }
      });
      socket.on('sell-property', () => {
        // TODO
      });
    }
  }

  public getPlayer(player: string) {
    return this.players[this.players.map((p) => p.getName()).indexOf(player)];
  }

  public diceRoll(dices: number[]) {
    const player = this.getPlayerTurn();
    const oldPos = player.getPosition();
    let newPos = player.getPosition() + Utils.sum(...dices);
    if (newPos > 39) newPos = newPos - 40;
    let did = true;
    if (player.isInJail()) {
      player.setJailTurn(player.getJailTurn() - 1);

      if (player.getJailTurn() <= 0) {
        player.setJailTurn(0);
        player.setInJail(false);
        this.emitToEveryone('exit-jail', player.getName());
      } else if (player.getExitJailCards() >= 1) {
        this.socket[player.getName()].emit(
          'choice',
          'Voulez vous utilisez la carte "Sortir de Prison" ?',
          ['Oui', 'Non']
        );
        did = false;
        this.socket[player.getName()].once(
          'response-choice',
          (response: number) => {
            if (response === 0) {
              player.setJailTurn(0);
              player.setInJail(false);
              this.emitToEveryone('exit-jail', player.getName());
              player.setExitJailCards(player.getExitJailCards() - 1);
            } else {
              newPos = 10;
              this.emitToEveryone('is-in-jail', player.getName());
            }
            player.setPosition(newPos);
            const done = this.handlePlayerLand(oldPos, Utils.sum(...dices));
            if (done) {
              if (player.isBroke()) {
                this.emitToEveryone('player-broke', player.getName());
                this.players.splice(this.players.indexOf(player), 1);
                this.turn--;
                this.spectators.push(player.getName());
              }
              this.nextTurn();
            } else {
              this.once('done', () => {
                if (player.isBroke()) {
                  this.emitToEveryone('player-broke', player.getName());
                  this.players.splice(this.players.indexOf(player), 1);
                  this.turn--;
                  this.spectators.push(player.getName());
                }
                this.nextTurn();
              });
            }
          }
        );
      } else {
        newPos = 10;
        this.emitToEveryone('is-in-jail', player.getName());
      }
    }
    if (did) {
      player.setPosition(newPos);
      const done = this.handlePlayerLand(oldPos, Utils.sum(...dices));
      if (done) {
        if (player.isBroke()) {
          this.emitToEveryone('player-broke', player.getName());
          this.players.splice(this.players.indexOf(player), 1);
          this.turn--;
          this.spectators.push(player.getName());
        }
        this.nextTurn();
      } else {
        this.once('done', () => {
          if (player.isBroke()) {
            this.emitToEveryone('player-broke', player.getName());
            this.players.splice(this.players.indexOf(player), 1);
            this.turn--;
            this.spectators.push(player.getName());
          }
          this.nextTurn();
        });
      }
    }
  }

  public handlePlayerLand(oldPos: number, dice: number) {
    const player = this.getPlayerTurn();
    const position = player.getPosition();
    if (oldPos > position) player.setAccount(player.getAccount() + 200);
    return Actions.execute(
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
    this.socket[this.getPlayerTurn().getName()].once('roll-dice', () =>
      this.diceRolled()
    );
  }

  public diceRolled() {
    const dices = Utils.rollDice(2);
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit('dice-roll', this.getPlayerTurn().getName(), dices);
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

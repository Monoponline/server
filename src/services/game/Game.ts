import { Socket } from 'socket.io/dist/socket';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Utils from '../../utils/Utils';
import Eventable from '../../utils/Eventable';
import Board from '../board/Board';
import BoardService from '../board/BoardService';
import Player from '../player/Player';
import { UserSocket } from '../networking/UserSocketService';
import Type from '../board/Type';

export default class Game extends Eventable {
  public takenAvatars = [] as string[];
  public id: string;
  public players = [] as Player[];
  public spectators = [] as string[];
  public started = false;
  public turn = 0;
  public houses = [] as Houses[];
  public socket: {
    [username: string]: UserSocket;
  } = {};

  constructor(id: string) {
    super();
    this.id = id;
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
              this.getPlayer(player).account =
                this.getPlayer(player).account + trade.moneyToReceive;
              this.getPlayer(trade.player).account =
                this.getPlayer(trade.player).account - trade.moneyToReceive;
              this.getPlayer(player).account =
                this.getPlayer(player).account - trade.moneyToGive;
              this.getPlayer(trade.player).account =
                this.getPlayer(trade.player).account + trade.moneyToGive;
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
          this.getCellHouses(cell) === 5
        )
          return socket.emit('cant-upgrade');
        const price = Board.housesPrice[Board.cells[cell].color];
        if (this.getPlayerTurn().name !== player) return;
        if (
          Board.cells.filter((c) => c.color === Board.cells[cell].color)
            .length !==
          this.getCellState(cell).properties.filter(
            (p) => Board.cells[cell].color === Board.cells[p].color
          ).length
        )
          return;
        if (this.getPlayer(player).canAfford(price)) {
          const house = this.houses.find((h) => h.cell === cell);
          house
            ? house.houses++
            : this.houses.push({
                houses: 1,
                cell
              });
          this.getPlayer(player).account =
            this.getPlayer(player).account - price;
          socket.emit('bought-house', Board.cells[cell].name);
          this.update();
        } else {
          this.emitToEveryone(
            'cant-afford',
            player,
            `${Board.cells[cell].name} maisons`
          );
        }
      });
      socket.on('sell-property', (cell: number) => {
        if (this.getCellHouses(cell) === 0) return socket.emit('cant-sell');
        const price = Board.housesPrice[Board.cells[cell].color] / 2;
        if (this.getPlayerTurn().name !== player) return;
        this.houses.find((h) => h.cell === cell).houses -= 1;
        this.getPlayer(player).account = this.getPlayer(player).account + price;
        socket.emit('sold-house', Board.cells[cell].name);
        this.update();
      });
    }
  }

  public getPlayer(player: string) {
    return this.players[this.players.map((p) => p.name).indexOf(player)];
  }

  public async handlePlayerBroke() {
    const player = this.getPlayerTurn();

    while (player.isBroke) {
      this.socket[player.name].emit(
        'choice',
        `Vous êtes ruiné, que voulez-vous vendre ?`,
        ['Des maisons', 'Des propriétés', 'Abandonner']
      );

      const response = await Utils.waitForResponseChoice(
        this.socket[player.name]
      );
      if (response == 0) {
        const houses = player.properties
          .filter((p) => this.getCellHouses(p) > 0)
          .filter((p) => Board.cells[p].type == Type.PROPERTY);
        this.socket[player.name].emit(
          'choice',
          `Sur quel propriété voulez vous vendre une maison ?`,
          [...houses.map((p) => Board.cells[p].name), 'Annuler']
        );

        const r = await Utils.waitForResponseChoice(this.socket[player.name]);
        if (r != houses.length) {
          const property = houses[r];
          const house = this.houses.find((h) => h.cell === property);
          house.houses -= 1;
          const price = Board.housesPrice[Board.cells[property].color];
          player.account += price / 2;
        }
      } else if (response == 1) {
        const houses = player.properties
          .filter((p) => this.getCellHouses(p) > 0)
          .filter((p) =>
            [Type.PROPERTY, Type.STATION, Type.UTILITY].includes(
              Board.cells[p].type
            )
          );
        this.socket[player.name].emit(
          'choice',
          `Quel propriété voulez-vous vendre ? (Seule les propriétés sans maisons peuvent être hypothèqué)`,
          [...houses.map((p) => Board.cells[p].name), 'Annuler']
        );

        const r = await Utils.waitForResponseChoice(this.socket[player.name]);
        if (r != houses.length) {
          const house = houses[r];
          player.removeProperty(house);
          player.mortgageProperty(house);
          player.account += Board.cells[house].price / 2;
        }
      } else {
        break;
      }
    }

    if (player.isBroke) {
      this.emitToEveryone('player-broke', player.name);
      this.players.splice(this.players.indexOf(player), 1);
      this.turn -= 1;
      this.spectators.push(player.name);
    }
  }

  public async endTurn(newPos: number, dices: number[]) {
    const player = this.getPlayerTurn();
    const oldPos = player.position;
    player.position = newPos;

    await this.handlePlayerLand(oldPos, Utils.sum(...dices));
    if (player.isBroke) {
      await this.handlePlayerBroke();
    }
    this.nextTurn();
  }

  public async diceRoll(dices: number[]) {
    const player = this.getPlayerTurn();
    let newPos = player.position + Utils.sum(...dices);
    if (newPos > 39) newPos = newPos - 40;
    let did = true;
    if (player.inJail) {
      player.jailTurn -= 1;

      if (player.jailTurn <= 0) {
        player.jailTurn = 0;
        player.inJail = false;
        this.emitToEveryone('exit-jail', player.name);
      } else if (player.exitJailCards >= 1) {
        this.socket[player.name].emit(
          'choice',
          'Voulez vous utilisez la carte "Sortir de Prison" ?',
          ['Oui', 'Non']
        );
        did = false;
        this.socket[player.name].once(
          'response-choice',
          async (response: number) => {
            if (response === 0) {
              player.jailTurn = 0;
              player.inJail = false;
              this.emitToEveryone('exit-jail', player.name);
              player.exitJailCards -= 1;
            } else {
              newPos = 10;
              this.emitToEveryone('is-in-jail', player.name);
            }
            await this.endTurn(newPos, dices);
          }
        );
      } else {
        newPos = 10;
        this.emitToEveryone('is-in-jail', player.name);
      }
    }
    if (did) {
      await this.endTurn(newPos, dices);
    }
  }

  public async handlePlayerLand(oldPos: number, dice: number) {
    const player = this.getPlayerTurn();
    const position = player.position;
    if (oldPos > position) player.account += 200;
    return await BoardService(
      this,
      Board.cells.find((cell) => cell.position === position)!,
      dice
    );
  }

  public getCellHouses(position: number): number {
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

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  default: () => Game
});
var import_Player = __toModule(require("./Player"));
var import_Utils = __toModule(require("./Utils"));
var import_Actions = __toModule(require("./utils/Actions"));
var import_Board = __toModule(require("./utils/Board"));
var import_Eventable = __toModule(require("./utils/Eventable"));
class Game extends import_Eventable.default {
  constructor(id) {
    super();
    this.takenAvatars = [];
    this.players = [];
    this.spectators = [];
    this.started = false;
    this.turn = 0;
    this.houses = [];
    this.socket = {};
    this.id = id;
  }
  getId() {
    return this.id;
  }
  isStarted() {
    return this.started;
  }
  getTurn() {
    return this.turn + 1;
  }
  getPlayerTurn() {
    return this.getPlayers()[this.turn];
  }
  getPlayers() {
    return this.players;
  }
  getPlayerList() {
    return this.players.map((p) => p.getName());
  }
  join(player, socket) {
    if (this.getPlayerList().includes(player))
      return;
    if (this.players.length < 4 && !this.isStarted()) {
      this.players.push(new import_Player.default(player));
      socket.emit("joined-game", this.id);
    } else {
      this.spectators.push(player);
      socket.emit("joined-game", this.id, true);
    }
    this.socket[player] = socket;
    this.update();
    if (this.players.length === 4) {
      this.start();
    }
  }
  leave(player) {
    const isAPlayer = this.getPlayerList().includes(player);
    if (this.started && isAPlayer) {
      this.handleDisconnect(this.players[this.getPlayerList().indexOf(player)]);
    }
    if (isAPlayer)
      this.players.splice(this.getPlayerList().indexOf(player), 1);
    if (this.spectators.includes(player))
      this.spectators.splice(this.spectators.indexOf(player), 1);
    delete this.socket[player];
    if (this.players.length < 2)
      return this.stop();
    this.update();
  }
  handleDisconnect(player) {
    for (const p in this.socket) {
      const socket = this.socket[p];
      socket.emit("left-game", player.getName());
      player.getProperties().forEach((property) => {
        this.houses.forEach((house) => {
          if (property === house.cell)
            delete this.houses[this.houses.map((h) => h.cell).indexOf(property)];
        });
      });
    }
  }
  getCellState(cell) {
    for (const player of this.players) {
      if (player.getProperties().includes(cell))
        return player;
    }
    return null;
  }
  getSocket(player) {
    return this.socket[player];
  }
  start() {
    this.started = true;
    for (const player of this.players) {
      const avatars = import_Player.default.AVATARS.filter((a) => !this.takenAvatars.includes(a));
      const avatar = avatars[Math.floor(Math.random() * avatars.length)];
      this.takenAvatars.push(avatar);
      player.setAvatar(avatar);
    }
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit("game-state", this.toString());
    }
    this.emit("start");
    this.socket[this.getPlayerTurn().getName()].once("roll-dice", () => this.diceRolled());
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.on("trade-request", (json) => {
        const trade = JSON.parse(json);
        const s = this.socket[trade.player];
        if (s) {
          s.emit("trade-req", player, JSON.stringify(trade));
          socket.emit("trade-req-sent");
          s.on("response-trade", (accept) => {
            if (accept) {
              for (const property of trade.cardToGive) {
                this.getPlayer(player).removeProperty(property.value);
                this.getPlayer(trade.player).addProperty(property.value);
              }
              for (const property of trade.cardToReceive) {
                this.getPlayer(player).addProperty(property.value);
                this.getPlayer(trade.player).removeProperty(property.value);
              }
              this.getPlayer(player).setAccount(this.getPlayer(player).getAccount() + trade.moneyToReceive);
              this.getPlayer(trade.player).setAccount(this.getPlayer(trade.player).getAccount() - trade.moneyToReceive);
              this.getPlayer(player).setAccount(this.getPlayer(player).getAccount() - trade.moneyToGive);
              this.getPlayer(trade.player).setAccount(this.getPlayer(trade.player).getAccount() + trade.moneyToGive);
              this.update();
            } else {
              socket.emit("canceled-trade");
            }
          });
        }
      });
      socket.on("buy-property", (cell) => {
        if (import_Board.default.cells.filter((c) => c.color === import_Board.default.cells[cell].color).find((c) => this.getCellHouses(c.position) < this.getCellHouses(cell)) || this.getCellHouses(cell) === 5)
          return socket.emit("cant-upgrade");
        const price = import_Board.default.housesPrice[import_Board.default.cells[cell].color];
        if (this.getPlayerTurn().getName() !== player)
          return;
        if (import_Board.default.cells.filter((c) => c.color === import_Board.default.cells[cell].color).length !== this.getCellState(cell).getProperties().filter((p) => import_Board.default.cells[cell].color === import_Board.default.cells[p].color).length)
          return;
        if (this.getPlayer(player).canAfford(price)) {
          const house = this.houses.find((h) => h.cell === cell);
          house ? house.houses++ : this.houses.push({
            houses: 1,
            cell
          });
          this.getPlayer(player).setAccount(this.getPlayer(player).getAccount() - price);
          socket.emit("bought-house", import_Board.default.cells[cell].name);
          this.update();
        } else {
          this.emitToEveryone("cant-afford", player, `${cell} maisons`);
        }
      });
      socket.on("sell-property", (cell) => {
        if (this.getCellHouses(cell) === 5)
          return socket.emit("cant-sell");
        const price = import_Board.default.housesPrice[import_Board.default.cells[cell].color] / 2;
        if (this.getPlayerTurn().getName() !== player)
          return;
        this.houses.find((h) => h.cell === cell).houses -= 1;
        this.getPlayer(player).setAccount(this.getPlayer(player).getAccount() + price);
        socket.emit("sold-house", import_Board.default.cells[cell].name);
        this.update();
      });
    }
  }
  getPlayer(player) {
    return this.players[this.players.map((p) => p.getName()).indexOf(player)];
  }
  diceRoll(dices) {
    const player = this.getPlayerTurn();
    const oldPos = player.getPosition();
    let newPos = player.getPosition() + import_Utils.default.sum(...dices);
    if (newPos > 39)
      newPos = newPos - 40;
    let did = true;
    if (player.isInJail()) {
      player.setJailTurn(player.getJailTurn() - 1);
      if (player.getJailTurn() <= 0) {
        player.setJailTurn(0);
        player.setInJail(false);
        this.emitToEveryone("exit-jail", player.getName());
      } else if (player.getExitJailCards() >= 1) {
        this.socket[player.getName()].emit("choice", 'Voulez vous utilisez la carte "Sortir de Prison" ?', ["Oui", "Non"]);
        did = false;
        this.socket[player.getName()].once("response-choice", (response) => {
          if (response === 0) {
            player.setJailTurn(0);
            player.setInJail(false);
            this.emitToEveryone("exit-jail", player.getName());
            player.setExitJailCards(player.getExitJailCards() - 1);
          } else {
            newPos = 10;
            this.emitToEveryone("is-in-jail", player.getName());
          }
          player.setPosition(newPos);
          const done = this.handlePlayerLand(oldPos, import_Utils.default.sum(...dices));
          if (done) {
            if (player.isBroke()) {
              this.emitToEveryone("player-broke", player.getName());
              this.players.splice(this.players.indexOf(player), 1);
              this.turn--;
              this.spectators.push(player.getName());
            }
            this.nextTurn();
          } else {
            this.once("done", () => {
              if (player.isBroke()) {
                this.emitToEveryone("player-broke", player.getName());
                this.players.splice(this.players.indexOf(player), 1);
                this.turn--;
                this.spectators.push(player.getName());
              }
              this.nextTurn();
            });
          }
        });
      } else {
        newPos = 10;
        this.emitToEveryone("is-in-jail", player.getName());
      }
    }
    if (did) {
      player.setPosition(newPos);
      const done = this.handlePlayerLand(oldPos, import_Utils.default.sum(...dices));
      if (done) {
        if (player.isBroke()) {
          this.emitToEveryone("player-broke", player.getName());
          this.players.splice(this.players.indexOf(player), 1);
          this.turn--;
          this.spectators.push(player.getName());
        }
        this.nextTurn();
      } else {
        this.once("done", () => {
          if (player.isBroke()) {
            this.emitToEveryone("player-broke", player.getName());
            this.players.splice(this.players.indexOf(player), 1);
            this.turn--;
            this.spectators.push(player.getName());
          }
          this.nextTurn();
        });
      }
    }
  }
  handlePlayerLand(oldPos, dice) {
    const player = this.getPlayerTurn();
    const position = player.getPosition();
    if (oldPos > position)
      player.setAccount(player.getAccount() + 200);
    return import_Actions.default.execute(this, import_Board.default.cells.find((cell) => cell.position === position), dice);
  }
  getCellHouses(position) {
    const state = this.getGameState();
    for (const house of state.houses) {
      if (house.cell === position)
        return house.houses;
    }
    return 0;
  }
  emitToEveryone(event, ...args) {
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit(event, ...args);
    }
  }
  emitToUser(player, event, ...args) {
    const socket = this.socket[player];
    socket == null ? void 0 : socket.emit(event, ...args);
  }
  stop() {
    this.started = false;
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit("win");
      delete this.socket[player];
    }
    this.emit("stop");
  }
  update() {
    this.emitToEveryone("game-state", this.toString());
  }
  nextTurn() {
    const current = this.getTurn();
    if (current < this.players.length)
      this.turn++;
    else
      this.turn = 0;
    this.update();
    this.socket[this.getPlayerTurn().getName()].once("roll-dice", () => this.diceRolled());
  }
  diceRolled() {
    const dices = import_Utils.default.rollDice(2);
    for (const player in this.socket) {
      const socket = this.socket[player];
      socket.emit("dice-roll", this.getPlayerTurn().getName(), dices);
    }
    this.diceRoll(dices);
  }
  toString() {
    return JSON.stringify(this.getGameState());
  }
  getGameState() {
    return {
      houses: this.houses,
      players: this.players.map((p) => JSON.parse(p.toJSON())),
      spectating: this.spectators.length,
      turn: this.getPlayerTurn().getName(),
      id: this.id,
      started: this.started
    };
  }
  getDefaultState() {
    return {
      houses: [],
      players: [],
      spectating: 0,
      turn: "",
      id: this.id,
      started: false
    };
  }
  canJoin() {
    return this.players.length < 4 && !this.started;
  }
  canStart() {
    if (this.players.length <= 4 && this.players.length >= 2 && !this.started) {
      return true;
    } else {
      return false;
    }
  }
}

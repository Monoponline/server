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
  default: () => Actions
});
var import_Board = __toModule(require("./Board"));
var import_Type = __toModule(require("./Type"));
class Actions {
  static execute(game, cell, dice) {
    const player = game.getPlayerTurn();
    const renter = game.getCellState(cell.position);
    switch (cell.type) {
      case import_Type.default.PROPERTY:
        if (!renter) {
          if (player.canAfford(cell.price)) {
            game.getSocket(player.getName()).emit("choice", `Voulez vous acheter ${cell.name} ?`, [
              "Oui",
              "Non"
            ]);
            game.getSocket(player.getName()).once("response-choice", (choice) => {
              if (choice === 0) {
                player.addProperty(cell.position);
                player.setAccount(player.getAccount() - cell.price);
                game.emitToEveryone("buy-house", player.getName(), cell.name);
              }
              game.emit("done");
            });
            return false;
          } else {
            game.emitToEveryone("cant-afford", player.getName(), cell.name);
          }
        } else {
          if (renter.getName() === player.getName())
            return true;
          const houses = game.getCellHouses(cell.position);
          const rent = cell.rent[houses];
          renter.setAccount(renter.getAccount() + rent);
          player.setAccount(player.getAccount() - rent);
          game.emitToEveryone("paid-rent", player.getName(), renter.getName(), rent);
        }
        break;
      case import_Type.default.STATION:
        if (!renter) {
          if (player.canAfford(200)) {
            game.getSocket(player.getName()).emit("choice", `Voulez vous acheter ${cell.name} ?`, [
              "Oui",
              "Non"
            ]);
            game.getSocket(player.getName()).once("response-choice", (choice) => {
              if (choice === 0) {
                player.addProperty(cell.position);
                player.setAccount(player.getAccount() - 200);
                game.emitToEveryone("buy-house", player.getName(), cell.name);
              }
              game.emit("done");
            });
            return false;
          } else {
            game.emitToEveryone("cant-afford", player.getName(), cell.name);
          }
        } else {
          if (renter.getName() === player.getName())
            return true;
          const houses = renter.getStationsOwned() - 1;
          const rent = [25, 50, 100, 200][houses];
          renter.setAccount(renter.getAccount() + rent);
          player.setAccount(player.getAccount() - rent);
          game.emitToEveryone("paid-rent", player.getName(), renter.getName(), rent);
        }
        break;
      case import_Type.default.UTILITY:
        if (!renter) {
          if (player.canAfford(150)) {
            game.getSocket(player.getName()).emit("choice", `Voulez vous acheter ${cell.name} ?`, [
              "Oui",
              "Non"
            ]);
            game.getSocket(player.getName()).once("response-choice", (choice) => {
              if (choice === 0) {
                player.addProperty(cell.position);
                player.setAccount(player.getAccount() - 150);
                game.emitToEveryone("buy-house", player.getName(), cell.name);
              }
              game.emit("done");
            });
            return false;
          } else {
            game.emitToEveryone("cant-afford", player.getName(), cell.name);
          }
        } else {
          if (renter.getName() === player.getName())
            return true;
          const houses = renter.getUtilitiesOwned() - 1;
          const rent = [dice * 4, dice * 10][houses];
          renter.setAccount(renter.getAccount() + rent);
          player.setAccount(player.getAccount() - rent);
          game.emitToEveryone("paid-rent", player.getName(), renter.getName(), rent);
        }
        break;
      case import_Type.default.SPECIAL:
        cell.action(game, player);
        break;
      case import_Type.default.CHANCE:
        const chanceCard = import_Board.default.chanceDeck[Math.floor(Math.random() * import_Board.default.chanceDeck.length)];
        game.emitToUser(player.getName(), "chance-card", chanceCard.title);
        return chanceCard.action(game, player);
      case import_Type.default.COMMUNITY_CHEST:
        const ccCard = import_Board.default.communityChestDeck[Math.floor(Math.random() * import_Board.default.communityChestDeck.length)];
        game.emitToUser(player.getName(), "cc-card", ccCard.title);
        return ccCard.action(game, player);
    }
    return true;
  }
}

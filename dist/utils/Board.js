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
  default: () => Board_default
});
var import_Type = __toModule(require("./Type"));
const Board = {
  cells: [
    {
      name: "Go",
      type: import_Type.default.SPECIAL,
      position: 0,
      action: (game, player) => {
        player.setAccount(player.getAccount() + 200);
      }
    },
    {
      name: "Boulevard de Belleville",
      type: import_Type.default.PROPERTY,
      position: 1,
      color: "dark-purple",
      rent: [2, 10, 30, 90, 160, 250],
      price: 60
    },
    {
      name: "Caisse de Communaut\xE9",
      type: import_Type.default.COMMUNITY_CHEST,
      position: 2
    },
    {
      name: "Rue Lecourbe",
      type: import_Type.default.PROPERTY,
      position: 3,
      color: "dark-purple",
      rent: [4, 20, 60, 180, 320, 450],
      price: 60
    },
    {
      name: "Imp\xF4ts sur le revenu",
      type: import_Type.default.SPECIAL,
      position: 4,
      action: (game, player) => {
        player.setAccount(player.getAccount() - 200);
        game.emitToEveryone("paid-taxes", player.getName());
      }
    },
    {
      name: "Gare Montparnasse",
      type: import_Type.default.STATION,
      position: 5
    },
    {
      name: "Rue de Vaugirard",
      type: import_Type.default.PROPERTY,
      position: 6,
      color: "light-blue",
      rent: [6, 30, 90, 270, 400, 550],
      price: 100
    },
    {
      name: "Chance",
      type: import_Type.default.CHANCE,
      position: 7
    },
    {
      name: "Rue de Courcelles",
      type: import_Type.default.PROPERTY,
      position: 8,
      color: "light-blue",
      rent: [6, 30, 90, 270, 400, 550],
      price: 100
    },
    {
      name: "Avenue de la R\xE9publique",
      type: import_Type.default.PROPERTY,
      position: 9,
      color: "light-blue",
      rent: [8, 40, 100, 300, 450, 600],
      price: 120
    },
    {
      name: "En Prison/Simple Visite",
      type: import_Type.default.SPECIAL,
      position: 10,
      action: (game, player) => {
      }
    },
    {
      name: "Boulevard de la Villette",
      type: import_Type.default.PROPERTY,
      position: 11,
      color: "purple",
      rent: [10, 50, 150, 450, 625, 750],
      price: 140
    },
    {
      name: "Compagnie de Distribution d'Electricit\xE9",
      type: import_Type.default.UTILITY,
      position: 12,
      price: 150
    },
    {
      name: "Avenue de Neuilly",
      type: import_Type.default.PROPERTY,
      position: 13,
      color: "purple",
      rent: [10, 50, 150, 450, 625, 750],
      price: 140
    },
    {
      name: "Rue de Paradis",
      type: import_Type.default.PROPERTY,
      position: 14,
      color: "purple",
      rent: [12, 60, 180, 500, 700, 900],
      price: 160
    },
    {
      name: "Gare de Lyon",
      type: import_Type.default.STATION,
      position: 15
    },
    {
      name: "Avenue Mozart",
      type: import_Type.default.PROPERTY,
      position: 16,
      color: "orange",
      rent: [14, 70, 200, 550, 700, 900],
      price: 180
    },
    {
      name: "Caisse de Communaut\xE9",
      type: import_Type.default.COMMUNITY_CHEST,
      position: 17
    },
    {
      name: "Boulevard Saint-Michel",
      type: import_Type.default.PROPERTY,
      position: 18,
      color: "orange",
      rent: [14, 70, 200, 550, 700, 900],
      price: 180
    },
    {
      name: "Place Pigalle",
      type: import_Type.default.PROPERTY,
      position: 19,
      color: "orange",
      rent: [16, 80, 220, 600, 800, 1e3],
      price: 200
    },
    {
      name: "Parc Gratuit",
      type: import_Type.default.SPECIAL,
      position: 20,
      action: (game, player) => {
      }
    },
    {
      name: "Avenue Matignon",
      type: import_Type.default.PROPERTY,
      position: 21,
      color: "red",
      rent: [18, 90, 250, 700, 875, 1050],
      price: 220
    },
    {
      name: "Change",
      type: import_Type.default.CHANCE,
      position: 22
    },
    {
      name: "Boulevard Malesherbes",
      type: import_Type.default.PROPERTY,
      position: 23,
      color: "red",
      rent: [18, 90, 250, 700, 875, 1050],
      price: 220
    },
    {
      name: "Avenue Henri-Martin",
      type: import_Type.default.PROPERTY,
      position: 24,
      color: "red",
      rent: [20, 100, 300, 750, 925, 1100],
      price: 240
    },
    {
      name: "Gare du Nord",
      type: import_Type.default.STATION,
      position: 25
    },
    {
      name: "Faubourg Saint-Honor\xE9",
      type: import_Type.default.PROPERTY,
      position: 26,
      color: "yellow",
      rent: [22, 110, 330, 800, 975, 1150],
      price: 260
    },
    {
      name: "Place de la Bourse",
      type: import_Type.default.PROPERTY,
      position: 27,
      color: "yellow",
      rent: [22, 110, 330, 800, 975, 1150],
      price: 260
    },
    {
      name: "Compagnie de Distribution des Eaux",
      type: import_Type.default.UTILITY,
      position: 28,
      price: 150
    },
    {
      name: "Rue la Fayette",
      type: import_Type.default.PROPERTY,
      position: 29,
      color: "yellow",
      rent: [24, 120, 360, 850, 1025, 1200],
      price: 280
    },
    {
      name: "Allez en Prison",
      type: import_Type.default.SPECIAL,
      position: 30,
      action: (game, player) => {
        player.setInJail(true);
        player.setJailTurn(3);
        player.setPosition(10);
        game.emitToEveryone("player-in-jail", player.getName());
      }
    },
    {
      name: "Avenue de Breteuil",
      type: import_Type.default.PROPERTY,
      position: 31,
      color: "green",
      rent: [26, 130, 390, 900, 1100, 1275],
      price: 300
    },
    {
      name: "Avenue Foch",
      type: import_Type.default.PROPERTY,
      position: 32,
      color: "green",
      rent: [26, 130, 390, 900, 1100, 1275],
      price: 300
    },
    {
      name: "Caisse de Communaut\xE9",
      type: import_Type.default.COMMUNITY_CHEST,
      position: 33
    },
    {
      name: "Boulevard des Capucines",
      type: import_Type.default.PROPERTY,
      position: 34,
      color: "green",
      rent: [28, 150, 450, 1e3, 1200, 1400],
      price: 320
    },
    {
      name: "Gare Saint-Lazare",
      type: import_Type.default.STATION,
      position: 35
    },
    {
      name: "Chance",
      type: import_Type.default.CHANCE,
      position: 36
    },
    {
      name: "Avenue des Champs-Elys\xE9es",
      type: import_Type.default.PROPERTY,
      position: 37,
      color: "dark-blue",
      rent: [35, 175, 500, 1100, 1300, 1500],
      price: 350
    },
    {
      name: "Taxe de Luxe",
      type: import_Type.default.SPECIAL,
      position: 38,
      action: (game, player) => {
        player.setAccount(player.getAccount() - 100);
        game.emitToEveryone("paid-luxury-taxe", player.getName());
      }
    },
    {
      name: "Rue de la Paix",
      type: import_Type.default.PROPERTY,
      position: 39,
      color: "dark-blue",
      rent: [50, 200, 600, 1400, 1700, 2e3],
      price: 400
    }
  ],
  chanceDeck: [
    {
      title: 'Allez \xE0 la gare de Lyon. Si vous passez par la case "D\xE9part" recevez 200\u20AC',
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(15);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), "Gare de Lyon");
        return true;
      }
    },
    {
      title: 'Allez en prison. Ne franchissez pas la case "D\xE9part", Ne touchez pas 200\u20AC',
      action: (game, player) => {
        player.setInJail(true);
        player.setJailTurn(3);
        player.setPosition(10);
        game.emitToEveryone("player-in-jail", player.getName());
        return true;
      }
    },
    {
      title: "Amende pour ivresse: 20\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() - 20);
        game.emitToEveryone("fine", player.getName(), 20);
        return true;
      }
    },
    {
      title: "Amende pour exc\xE8s de vitesse: 15\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() - 15);
        game.emitToEveryone("fine", player.getName(), 15);
        return true;
      }
    },
    {
      title: `Avancez jusqu'\xE0 la case "D\xE9part"`,
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(0);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), 'la case "D\xE9part"');
        return true;
      }
    },
    {
      title: "Faites des r\xE9parations dans toutes vos maisons. Versez pour chaque maison 25\u20AC. Versez pour chaque h\xF4tel 100\u20AC.",
      action: (game, player) => {
        let oldAccount = player.getAccount();
        player.getProperties().forEach((property) => {
          const houses = game.getCellHouses(property);
          if (houses === 5)
            player.setAccount(player.getAccount() - 100);
          else
            player.setAccount(player.getAccount() - houses * 25);
        });
        game.emitToEveryone("fine", player.getName(), oldAccount - player.getAccount());
        return true;
      }
    },
    {
      title: "Vous avez gagn\xE9 le prix de mots crois\xE9s. Recevez 100\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 100);
        game.emitToEveryone("earn", player.getName(), 100);
        return true;
      }
    },
    {
      title: "La banque vous verse un dividende de 50\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 50);
        game.emitToEveryone("earn", player.getName(), 50);
        return true;
      }
    },
    {
      title: "Vous immeuble et votre pr\xEAt rapportent. Vous devez toucher 150\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 150);
        game.emitToEveryone("earn", player.getName(), 150);
        return true;
      }
    },
    {
      title: 'Avancez au Boulevard de la Villette. Si vous passez par la case "D\xE9part" recevez 200\u20AC',
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(11);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), "Boulevard de la Villette");
        return true;
      }
    },
    {
      title: "Rendez vous \xE0 la Rue de la Paix",
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(39);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), "Rue de la Paix");
        return true;
      }
    },
    {
      title: "Reculez de 3 cases",
      action: (game, player) => {
        var _a;
        const oldPos = player.getPosition();
        let newPos = player.getPosition() - 3;
        if (newPos < 0)
          newPos = newPos + 40;
        player.setPosition(newPos);
        const done = game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), (_a = Board.cells.find((cell) => cell.position === player.getPosition())) == null ? void 0 : _a.name);
        return done;
      }
    },
    {
      title: "Faites des r\xE9parations dans toutes vos maisons. Versez pour chaque maison 40\u20AC. Versez pour chaque h\xF4tel 115\u20AC.",
      action: (game, player) => {
        let oldAccount = player.getAccount();
        player.getProperties().forEach((property) => {
          const houses = game.getCellHouses(property);
          if (houses === 5)
            player.setAccount(player.getAccount() - 115);
          else
            player.setAccount(player.getAccount() - houses * 40);
        });
        game.emitToEveryone("fine", player.getName(), oldAccount - player.getAccount());
        return true;
      }
    },
    {
      title: "Payez pour frais de scolarit\xE9: 150\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() - 150);
        game.emitToEveryone("fine", player.getName(), 150);
        return true;
      }
    },
    {
      title: "Vous \xEAtes lib\xE9r\xE9 de prison. Cette carte peut \xEAtre conserv\xE9e jusqu'\xE0 ce qu'elle soit utilis\xE9e ou vendue.",
      action: (game, player) => {
        player.setExitJailCards(player.getExitJailCards() + 1);
        game.emitToEveryone("earn", player.getName(), "une carte lib\xE9r\xE9 de prison");
        return true;
      }
    },
    {
      title: `Rendez vous \xE0  l'Avenue Henri-Martin. Si vous passez par la case "D\xE9part" recevez 200\u20AC`,
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(24);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), "Avenue Henri-Martin");
        return true;
      }
    }
  ],
  communityChestDeck: [
    {
      title: "Vous \xEAtes lib\xE9r\xE9 de prison. Cette carte peut \xEAtre convers\xE9e jusqu'\xE0 ce qu'elle soit utilis\xE9e ou vendue.",
      action: (game, player) => {
        player.setExitJailCards(player.getExitJailCards() + 1);
        game.emitToEveryone("earn", player.getName(), "une carte lib\xE9r\xE9 de prison");
        return true;
      }
    },
    {
      title: "Vous h\xE9ritez 100\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 100);
        game.emitToEveryone("earn", player.getName(), 100);
        return true;
      }
    },
    {
      title: "Recevez votre revenu annuel 100\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 100);
        game.emitToEveryone("earn", player.getName(), 100);
        return true;
      }
    },
    {
      title: "Payez l'H\xF4pital 100\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() - 100);
        game.emitToEveryone("fine", player.getName(), 100);
        return true;
      }
    },
    {
      title: "C'est votre anniversaire: chaque joueur doit vous donner 10\u20AC",
      action: (game, player) => {
        game.getPlayers().forEach((p) => {
          p.setAccount(p.getAccount() - 10);
        });
        player.setAccount(player.getAccount() + 10 * game.getPlayers().length);
        game.emitToEveryone("friend-gift", player.getName());
        return true;
      }
    },
    {
      title: "Payer la note du M\xE9decin 50\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() - 50);
        game.emitToEveryone("fine", player.getName(), 50);
        return true;
      }
    },
    {
      title: "Retournez \xE0 Belleville",
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(1);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), "Belleville");
        return true;
      }
    },
    {
      title: "Vous avez gagn\xE9 le deuxi\xE8me Prix ed Beaut\xE9. Recevez 10\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 10);
        game.emitToEveryone("earn", player.getName(), 10);
        return true;
      }
    },
    {
      title: 'Allez en prison. Ne franchissez pas la case "D\xE9part", Ne recevez pas 200\u20AC',
      action: (game, player) => {
        player.setInJail(true);
        player.setJailTurn(3);
        player.setPosition(10);
        game.emitToEveryone("player-in-jail", player.getName());
        return true;
      }
    },
    {
      title: 'Payez une amende de 10\u20AC ou bien tirez une carte "CHANCE"',
      action: (game, player) => {
        game.getSocket(player.getName()).emit("choice", 'Payez une amende de 10\u20AC ou bien tirez une carte "CHANCE"', ["Payer une amende", 'Tirer une carte "CHANCE"']);
        game.getSocket(player.getName()).once("response-choice", (choice) => {
          if (choice === 0) {
            player.setAccount(player.getAccount() - 10);
            game.emitToEveryone("fine", player.getName(), 10);
            game.emit("done");
          } else if (choice === 1) {
            const chanceCard = Board.chanceDeck[Math.floor(Math.random() * Board.chanceDeck.length)];
            game.emitToUser(player.getName(), "chance-card", chanceCard.title);
            if (chanceCard.action(game, player))
              game.emit("done");
          } else {
            player.setAccount(player.getAccount() - 10);
            game.emitToEveryone("fine", player.getName(), 10);
            game.emit("done");
          }
        });
        return false;
      }
    },
    {
      title: "Les Contributions vous remboursent la somme de 20\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 20);
        game.emitToEveryone("earn", player.getName(), 20);
        return true;
      }
    },
    {
      title: 'Placez vous sur la case "D\xE9part"',
      action: (game, player) => {
        const oldPos = player.getPosition();
        player.setPosition(0);
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone("player-move", player.getName(), 'la case "D\xE9part"');
        return true;
      }
    },
    {
      title: "Erreur de la banque en votre faveur. Recevez 200\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 200);
        game.emitToEveryone("earn", player.getName(), 200);
        return true;
      }
    },
    {
      title: "La vente de votre stock vous rapporte 50\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 50);
        game.emitToEveryone("earn", player.getName(), 50);
        return true;
      }
    },
    {
      title: "Payez votre Police d'Assurance s'\xE9levant \xE0 50\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() - 50);
        game.emitToEveryone("fine", player.getName(), 50);
        return true;
      }
    },
    {
      title: "Recevez votre int\xE9r\xEAt sur l'emprunt \xE0 7% 25\u20AC",
      action: (game, player) => {
        player.setAccount(player.getAccount() + 25);
        game.emitToEveryone("earn", player.getName(), 25);
        return true;
      }
    }
  ],
  housesPrice: {
    "dark-purple": 50,
    "light-blue": 50,
    purple: 100,
    orange: 100,
    red: 150,
    yellow: 150,
    green: 200,
    "dark-blue": 200
  }
};
var Board_default = Board;

import Game from '../game/Game';
import Player from '../player/Player';
import Type from './Type';

const Board = {
  cells: [
    {
      name: 'Go',
      type: Type.SPECIAL,
      position: 0,
      action: (game, player) => {
        player.account += 200;
        return new Promise((r) => r());
      }
    },
    {
      name: 'Boulevard de Belleville',
      type: Type.PROPERTY,
      position: 1,
      color: 'dark-purple',
      rent: [2, 10, 30, 90, 160, 250],
      price: 60
    },
    {
      name: 'Caisse de Communauté',
      type: Type.COMMUNITY_CHEST,
      position: 2
    },
    {
      name: 'Rue Lecourbe',
      type: Type.PROPERTY,
      position: 3,
      color: 'dark-purple',
      rent: [4, 20, 60, 180, 320, 450],
      price: 60
    },
    {
      name: 'Impôts sur le revenu',
      type: Type.SPECIAL,
      position: 4,
      action: (game, player) => {
        player.account -= 200;
        game.emitToEveryone('paid-taxes', player.name);
        return new Promise((r) => r());
      }
    },
    {
      name: 'Gare Montparnasse',
      type: Type.STATION,
      position: 5
    },
    {
      name: 'Rue de Vaugirard',
      type: Type.PROPERTY,
      position: 6,
      color: 'light-blue',
      rent: [6, 30, 90, 270, 400, 550],
      price: 100
    },
    {
      name: 'Chance',
      type: Type.CHANCE,
      position: 7
    },
    {
      name: 'Rue de Courcelles',
      type: Type.PROPERTY,
      position: 8,
      color: 'light-blue',
      rent: [6, 30, 90, 270, 400, 550],
      price: 100
    },
    {
      name: 'Avenue de la République',
      type: Type.PROPERTY,
      position: 9,
      color: 'light-blue',
      rent: [8, 40, 100, 300, 450, 600],
      price: 120
    },
    {
      name: 'En Prison/Simple Visite',
      type: Type.SPECIAL,
      position: 10,
      action: (game, player) => {
        return new Promise((r) => r());
      }
    },
    {
      name: 'Boulevard de la Villette',
      type: Type.PROPERTY,
      position: 11,
      color: 'purple',
      rent: [10, 50, 150, 450, 625, 750],
      price: 140
    },
    {
      name: "Compagnie de Distribution d'Electricité",
      type: Type.UTILITY,
      position: 12,
      price: 150
    },
    {
      name: 'Avenue de Neuilly',
      type: Type.PROPERTY,
      position: 13,
      color: 'purple',
      rent: [10, 50, 150, 450, 625, 750],
      price: 140
    },
    {
      name: 'Rue de Paradis',
      type: Type.PROPERTY,
      position: 14,
      color: 'purple',
      rent: [12, 60, 180, 500, 700, 900],
      price: 160
    },
    {
      name: 'Gare de Lyon',
      type: Type.STATION,
      position: 15
    },
    {
      name: 'Avenue Mozart',
      type: Type.PROPERTY,
      position: 16,
      color: 'orange',
      rent: [14, 70, 200, 550, 700, 900],
      price: 180
    },
    {
      name: 'Caisse de Communauté',
      type: Type.COMMUNITY_CHEST,
      position: 17
    },
    {
      name: 'Boulevard Saint-Michel',
      type: Type.PROPERTY,
      position: 18,
      color: 'orange',
      rent: [14, 70, 200, 550, 700, 900],
      price: 180
    },
    {
      name: 'Place Pigalle',
      type: Type.PROPERTY,
      position: 19,
      color: 'orange',
      rent: [16, 80, 220, 600, 800, 1000],
      price: 200
    },
    {
      name: 'Parc Gratuit',
      type: Type.SPECIAL,
      position: 20,
      action: (game, player) => {
        return new Promise((r) => r());
      }
    },
    {
      name: 'Avenue Matignon',
      type: Type.PROPERTY,
      position: 21,
      color: 'red',
      rent: [18, 90, 250, 700, 875, 1050],
      price: 220
    },
    {
      name: 'Change',
      type: Type.CHANCE,
      position: 22
    },
    {
      name: 'Boulevard Malesherbes',
      type: Type.PROPERTY,
      position: 23,
      color: 'red',
      rent: [18, 90, 250, 700, 875, 1050],
      price: 220
    },
    {
      name: 'Avenue Henri-Martin',
      type: Type.PROPERTY,
      position: 24,
      color: 'red',
      rent: [20, 100, 300, 750, 925, 1100],
      price: 240
    },
    {
      name: 'Gare du Nord',
      type: Type.STATION,
      position: 25
    },
    {
      name: 'Faubourg Saint-Honoré',
      type: Type.PROPERTY,
      position: 26,
      color: 'yellow',
      rent: [22, 110, 330, 800, 975, 1150],
      price: 260
    },
    {
      name: 'Place de la Bourse',
      type: Type.PROPERTY,
      position: 27,
      color: 'yellow',
      rent: [22, 110, 330, 800, 975, 1150],
      price: 260
    },
    {
      name: 'Compagnie de Distribution des Eaux',
      type: Type.UTILITY,
      position: 28,
      price: 150
    },
    {
      name: 'Rue la Fayette',
      type: Type.PROPERTY,
      position: 29,
      color: 'yellow',
      rent: [24, 120, 360, 850, 1025, 1200],
      price: 280
    },
    {
      name: 'Allez en Prison',
      type: Type.SPECIAL,
      position: 30,
      action: (game, player) => {
        player.inJail = true;
        player.jailTurn = 3;
        player.position = 10;
        game.emitToEveryone('player-in-jail', player.name);
        return new Promise((r) => r());
      }
    },
    {
      name: 'Avenue de Breteuil',
      type: Type.PROPERTY,
      position: 31,
      color: 'green',
      rent: [26, 130, 390, 900, 1100, 1275],
      price: 300
    },
    {
      name: 'Avenue Foch',
      type: Type.PROPERTY,
      position: 32,
      color: 'green',
      rent: [26, 130, 390, 900, 1100, 1275],
      price: 300
    },
    {
      name: 'Caisse de Communauté',
      type: Type.COMMUNITY_CHEST,
      position: 33
    },
    {
      name: 'Boulevard des Capucines',
      type: Type.PROPERTY,
      position: 34,
      color: 'green',
      rent: [28, 150, 450, 1000, 1200, 1400],
      price: 320
    },
    {
      name: 'Gare Saint-Lazare',
      type: Type.STATION,
      position: 35
    },
    {
      name: 'Chance',
      type: Type.CHANCE,
      position: 36
    },
    {
      name: 'Avenue des Champs-Elysées',
      type: Type.PROPERTY,
      position: 37,
      color: 'dark-blue',
      rent: [35, 175, 500, 1100, 1300, 1500],
      price: 350
    },
    {
      name: 'Taxe de Luxe',
      type: Type.SPECIAL,
      position: 38,
      action: (game, player) => {
        player.account -= 100;
        game.emitToEveryone('paid-luxury-taxe', player.name);
        return new Promise((r) => r());
      }
    },
    {
      name: 'Rue de la Paix',
      type: Type.PROPERTY,
      position: 39,
      color: 'dark-blue',
      rent: [50, 200, 600, 1400, 1700, 2000],
      price: 400
    }
  ],
  chanceDeck: [
    {
      title:
        'Allez à la gare de Lyon. Si vous passez par la case "Départ" recevez 200€',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 15;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone('player-move', player.name, 'Gare de Lyon');
        return new Promise((r) => r());
      }
    },
    {
      title:
        'Allez en prison. Ne franchissez pas la case "Départ", Ne touchez pas 200€',
      action: (game, player) => {
        player.inJail = true;
        player.jailTurn = 3;
        player.position = 10;
        game.emitToEveryone('player-in-jail', player.name);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Amende pour ivresse: 20€',
      action: (game, player) => {
        player.account -= 20;
        game.emitToEveryone('fine', player.name, 20);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Amende pour excès de vitesse: 15€',
      action: (game, player) => {
        player.account -= 15;
        game.emitToEveryone('fine', player.name, 15);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Avancez jusqu\'à la case "Départ"',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 0;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone('player-move', player.name, 'la case "Départ"');
        return new Promise((r) => r());
      }
    },
    {
      title:
        'Faites des réparations dans toutes vos maisons. Versez pour chaque maison 25€. Versez pour chaque hôtel 100€.',
      action: (game, player) => {
        let oldAccount = player.account;
        player.properties.forEach((property) => {
          const houses = game.getCellHouses(property);
          if (houses === 5) player.account -= 100;
          else player.account -= houses * 25;
        });
        game.emitToEveryone('fine', player.name, oldAccount - player.account);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Vous avez gagné le prix de mots croisés. Recevez 100€',
      action: (game, player) => {
        player.account += 100;
        game.emitToEveryone('earn', player.name, 100);
        return new Promise((r) => r());
      }
    },
    {
      title: 'La banque vous verse un dividende de 50€',
      action: (game, player) => {
        player.account += 50;
        game.emitToEveryone('earn', player.name, 50);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Vous immeuble et votre prêt rapportent. Vous devez toucher 150€',
      action: (game, player) => {
        player.account += 150;
        game.emitToEveryone('earn', player.name, 150);
        return new Promise((r) => r());
      }
    },
    {
      title:
        'Avancez au Boulevard de la Villette. Si vous passez par la case "Départ" recevez 200€',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 11;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone(
          'player-move',
          player.name,
          'Boulevard de la Villette'
        );
        return new Promise((r) => r());
      }
    },
    {
      title: 'Rendez vous à la Rue de la Paix',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 39;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone('player-move', player.name, 'Rue de la Paix');
        return new Promise((r) => r());
      }
    },
    {
      title: 'Reculez de 3 cases',
      action: async (game, player) => {
        const oldPos = player.position;
        let newPos = player.position - 3;
        if (newPos < 0) newPos = newPos + 40;
        player.position = newPos;
        const done = await game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone(
          'player-move',
          player.name,
          Board.cells.find((cell) => cell.position === player.position)?.name
        );
        return new Promise((r) => r());
      }
    },
    {
      title:
        'Faites des réparations dans toutes vos maisons. Versez pour chaque maison 40€. Versez pour chaque hôtel 115€.',
      action: (game, player) => {
        let oldAccount = player.account;
        player.properties.forEach((property) => {
          const houses = game.getCellHouses(property);
          if (houses === 5) player.account -= 115;
          else player.account -= houses * 40;
        });
        game.emitToEveryone('fine', player.name, oldAccount - player.account);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Payez pour frais de scolarité: 150€',
      action: (game, player) => {
        player.account -= 150;
        game.emitToEveryone('fine', player.name, 150);
        return new Promise((r) => r());
      }
    },
    {
      title:
        "Vous êtes libéré de prison. Cette carte peut être conservée jusqu'à ce qu'elle soit utilisée ou vendue.",
      action: (game, player) => {
        player.exitJailCards += 1;
        game.emitToEveryone('earn', player.name, 'une carte libéré de prison');
        return new Promise((r) => r());
      }
    },
    {
      title:
        'Rendez vous à  l\'Avenue Henri-Martin. Si vous passez par la case "Départ" recevez 200€',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 24;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone('player-move', player.name, 'Avenue Henri-Martin');
        return new Promise((r) => r());
      }
    }
  ],
  communityChestDeck: [
    {
      title:
        "Vous êtes libéré de prison. Cette carte peut être conversée jusqu'à ce qu'elle soit utilisée ou vendue.",
      action: (game, player) => {
        player.exitJailCards += 1;
        game.emitToEveryone('earn', player.name, 'une carte libéré de prison');
        return new Promise((r) => r());
      }
    },
    {
      title: 'Vous héritez 100€',
      action: (game, player) => {
        player.account += 100;
        game.emitToEveryone('earn', player.name, 100);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Recevez votre revenu annuel 100€',
      action: (game, player) => {
        player.account += 100;
        game.emitToEveryone('earn', player.name, 100);
        return new Promise((r) => r());
      }
    },
    {
      title: "Payez l'Hôpital 100€",
      action: (game, player) => {
        player.account -= 100;
        game.emitToEveryone('fine', player.name, 100);
        return new Promise((r) => r());
      }
    },
    {
      title: "C'est votre anniversaire: chaque joueur doit vous donner 10€",
      action: (game, player) => {
        game.players.forEach((p) => {
          p.account -= 10;
        });
        player.account += 10 * game.players.length;
        game.emitToEveryone('friend-gift', player.name);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Payer la note du Médecin 50€',
      action: (game, player) => {
        player.account -= 50;
        game.emitToEveryone('fine', player.name, 50);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Retournez à Belleville',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 1;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone('player-move', player.name, 'Belleville');
        return new Promise((r) => r());
      }
    },
    {
      title: 'Vous avez gagné le deuxième Prix ed Beauté. Recevez 10€',
      action: (game, player) => {
        player.account += 10;
        game.emitToEveryone('earn', player.name, 10);
        return new Promise((r) => r());
      }
    },
    {
      title:
        'Allez en prison. Ne franchissez pas la case "Départ", Ne recevez pas 200€',
      action: (game, player) => {
        player.inJail = true;
        player.jailTurn = 3;
        player.position = 10;
        game.emitToEveryone('player-in-jail', player.name);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Payez une amende de 10€ ou bien tirez une carte "CHANCE"',
      action: async (game, player) => {
        return new Promise((r) => {
          game.socket[player.name].emit(
            'choice',
            'Payez une amende de 10€ ou bien tirez une carte "CHANCE"',
            ['Payer une amende', 'Tirer une carte "CHANCE"']
          );
          game.socket[player.name].once('response-choice', (choice: number) => {
            if (choice === 0) {
              player.account -= 10;
              game.emitToEveryone('fine', player.name, 10);
              r();
            } else if (choice === 1) {
              const chanceCard =
                Board.chanceDeck[
                  Math.floor(Math.random() * Board.chanceDeck.length)
                ];
              game.emitToUser(player.name, 'chance-card', chanceCard.title);
              chanceCard.action(game, player).then(r);
            } else {
              player.account -= 10;
              game.emitToEveryone('fine', player.name, 10);
              r();
            }
          });
        });
      }
    },
    {
      title: 'Les Contributions vous remboursent la somme de 20€',
      action: (game, player) => {
        player.account += 20;
        game.emitToEveryone('earn', player.name, 20);
        return new Promise((r) => r());
      }
    },
    {
      title: 'Placez vous sur la case "Départ"',
      action: (game, player) => {
        const oldPos = player.position;
        player.position = 0;
        game.handlePlayerLand(oldPos, 0);
        game.emitToEveryone('player-move', player.name, 'la case "Départ"');
        return new Promise((r) => r());
      }
    },
    {
      title: 'Erreur de la banque en votre faveur. Recevez 200€',
      action: (game, player) => {
        player.account += 200;
        game.emitToEveryone('earn', player.name, 200);
        return new Promise((r) => r());
      }
    },
    {
      title: 'La vente de votre stock vous rapporte 50€',
      action: (game, player) => {
        player.account += 50;
        game.emitToEveryone('earn', player.name, 50);
        return new Promise((r) => r());
      }
    },
    {
      title: "Payez votre Police d'Assurance s'élevant à 50€",
      action: (game, player) => {
        player.account -= 50;
        game.emitToEveryone('fine', player.name, 50);
        return new Promise((r) => r());
      }
    },
    {
      title: "Recevez votre intérêt sur l'emprunt à 7% 25€",
      action: (game, player) => {
        player.account += 25;
        game.emitToEveryone('earn', player.name, 25);
        return new Promise((r) => r());
      }
    }
  ],
  housesPrice: {
    'dark-purple': 50,
    'light-blue': 50,
    purple: 100,
    orange: 100,
    red: 150,
    yellow: 150,
    green: 200,
    'dark-blue': 200
  }
} as {
  cells: Cell[];
  chanceDeck: Chance[];
  communityChestDeck: Chance[];
  housesPrice: {
    [color: string]: number;
  };
};

export default Board;

export interface Cell {
  name: string;
  type: Type;
  position: number;
  color?: string;
  rent?: number[];
  price?: number;
  action?: (game: Game, player: Player) => Promise<void>;
}

export interface Chance {
  title: string;
  action: (game: Game, player: Player) => Promise<void>;
}

export interface CommunityChest {
  title: string;
  action: (game: Game, player: Player) => Promise<void>;
}

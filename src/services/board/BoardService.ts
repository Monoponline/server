import Type from '../../utils/Type';
import Game from '../game/Game';
import Board, { Cell } from './Board';

export default async function BoardService(
  game: Game,
  cell: Cell,
  dice: number
): Promise<void> {
  return new Promise((r) => {
    const player = game.getPlayerTurn();
    const renter = game.getCellState(cell.position);
    switch (cell.type) {
      case Type.PROPERTY:
        if (!renter) {
          if (player.canAfford(cell.price!)) {
            game.socket[player.name].emit(
              'choice',
              `Voulez vous acheter ${cell.name} ?`,
              ['Oui', 'Non']
            );
            game.socket[player.name].once(
              'response-choice',
              (choice: number) => {
                if (choice === 0) {
                  player.addProperty(cell.position);
                  player.account -= cell.price!;
                  game.emitToEveryone('buy-house', player.name, cell.name);
                }
                r()
              }
            );
          } else {
            game.emitToEveryone('cant-afford', player.name, cell.name);
            r()
          }
        } else {
          if (renter.name === player.name) r();
          const houses = game.getCellHouses(cell.position);
          const rent = cell.rent![houses];
          renter.account += rent;
          player.account -= rent;
          game.emitToEveryone('paid-rent', player.name, renter.name, rent);
          r()
        }
        break;
      case Type.STATION:
        if (!renter) {
          if (player.canAfford(200)) {
            game.socket[player.name].emit(
              'choice',
              `Voulez vous acheter ${cell.name} ?`,
              ['Oui', 'Non']
            );
            game.socket[player.name].once(
              'response-choice',
              (choice: number) => {
                if (choice === 0) {
                  player.addProperty(cell.position);
                  player.account -= 200;
                  game.emitToEveryone('buy-house', player.name, cell.name);
                }
                r()
              }
            );
          } else {
            game.emitToEveryone('cant-afford', player.name, cell.name);
            r()
          }
        } else {
          if (renter.name === player.name) r();
          const houses = renter.getStationsOwned() - 1;
          const rent = [25, 50, 100, 200][houses];
          renter.account += rent;
          player.account -= rent;
          game.emitToEveryone('paid-rent', player.name, renter.name, rent);
          r()
        }
        break;
      case Type.UTILITY:
        if (!renter) {
          if (player.canAfford(150)) {
            game.socket[player.name].emit(
              'choice',
              `Voulez vous acheter ${cell.name} ?`,
              ['Oui', 'Non']
            );
            game.socket[player.name].once(
              'response-choice',
              (choice: number) => {
                if (choice === 0) {
                  player.addProperty(cell.position);
                  player.account -= 150;
                  game.emitToEveryone('buy-house', player.name, cell.name);
                }
                r()
              }
            );
          } else {
            game.emitToEveryone('cant-afford', player.name, cell.name);
            r()
          }
        } else {
          if (renter.name === player.name) r();
          const houses = renter.getUtilitiesOwned() - 1;
          const rent = [dice * 4, dice * 10][houses];
          renter.account += rent;
          player.account -= rent;
          game.emitToEveryone('paid-rent', player.name, renter.name, rent);
          r()
        }
        break;
      case Type.SPECIAL:
        cell.action!(game, player).then(r);
        break;
      case Type.CHANCE:
        const chanceCard =
          Board.chanceDeck[Math.floor(Math.random() * Board.chanceDeck.length)];
        game.emitToUser(player.name, 'chance-card', chanceCard.title);
        chanceCard.action(game, player).then(r);
        break;
      case Type.COMMUNITY_CHEST:
        const ccCard =
          Board.communityChestDeck[
            Math.floor(Math.random() * Board.communityChestDeck.length)
          ];
        game.emitToUser(player.name, 'cc-card', ccCard.title);
        ccCard.action(game, player).then(r);
        break;
    }
  });
}

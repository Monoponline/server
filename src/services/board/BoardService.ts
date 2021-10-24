import Type from '../../utils/Type';
import Utils from '../../utils/Utils';
import Game from '../game/Game';
import Player from '../player/Player';
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
                  player.properties.push(cell.position);
                  player.account -= cell.price!;
                  game.emitToEveryone('buy-house', player.name, cell.name);
                }
                r();
              }
            );
          } else {
            game.emitToEveryone('cant-afford', player.name, cell.name);
            r();
          }
        } else {
          if (renter.name === player.name) r();
          const houses = game.getCellHouses(cell.position);
          const rent = cell.rent![houses];
          renter.account += rent;
          player.account -= rent;
          game.emitToEveryone('paid-rent', player.name, renter.name, rent);
          r();
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
                  player.properties.push(cell.position);
                  player.account -= 200;
                  game.emitToEveryone('buy-house', player.name, cell.name);
                }
                r();
              }
            );
          } else {
            game.emitToEveryone('cant-afford', player.name, cell.name);
            r();
          }
        } else {
          if (renter.name === player.name) r();
          const houses = renter.getStationsOwned() - 1;
          const rent = [25, 50, 100, 200][houses];
          renter.account += rent;
          player.account -= rent;
          game.emitToEveryone('paid-rent', player.name, renter.name, rent);
          r();
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
                  player.properties.push(cell.position);
                  player.account -= 150;
                  game.emitToEveryone('buy-house', player.name, cell.name);
                }
                r();
              }
            );
          } else {
            game.emitToEveryone('cant-afford', player.name, cell.name);
            r();
          }
        } else {
          if (renter.name === player.name) r();
          const houses = renter.getUtilitiesOwned() - 1;
          const rent = [dice * 4, dice * 10][houses];
          renter.account += rent;
          player.account -= rent;
          game.emitToEveryone('paid-rent', player.name, renter.name, rent);
          r();
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

export async function runDice(game: Game, dices: number[]) {
  const player = game.getPlayerTurn();
  const oldPos = player.position;
  let newPos = player.position + Utils.sum(...dices);
  if (newPos > 39) newPos = newPos - 40;
  if (player.inJail) {
    player.jailTurn -= 1;

    if (player.jailTurn <= 0) {
      player.jailTurn = 0;
      player.inJail = false;
      game.emitToEveryone('exit-jail', player.name);
      endTurn(player, game, oldPos, dices, newPos);
    } else if (player.exitJailCards >= 1) {
      game.socket[player.name].emit(
        'choice',
        'Voulez vous utilisez la carte "Sortir de Prison" ?',
        ['Oui', 'Non']
      );
      game.socket[player.name].once(
        'response-choice',
        async (response: number) => {
          if (response === 0) {
            player.jailTurn = 0;
            player.inJail = false;
            game.emitToEveryone('exit-jail', player.name);
            player.exitJailCards -= 1;
          } else {
            newPos = 10;
            game.emitToEveryone('is-in-jail', player.name);
          }
          endTurn(player, game, oldPos, dices, newPos);
        }
      );
    } else {
      game.socket[player.name].emit(
        'choice',
        'Voulez vous payez 50€ pour sortie de Prison ?',
        ['Oui', 'Non']
      );
      game.socket[player.name].once(
        'response-choice',
        async (response: number) => {
          if (response === 0) {
            player.jailTurn = 0;
            player.inJail = false;
            game.emitToEveryone('exit-jail', player.name);
            player.account -= 50;
          } else {
            newPos = 10;
            game.emitToEveryone('is-in-jail', player.name);
          }
          endTurn(player, game, oldPos, dices, newPos);
        }
      );
    }
  } else {
    endTurn(player, game, oldPos, dices, newPos);
  }
}

async function endTurn(
  player: Player,
  game: Game,
  oldPos: number,
  dices: number[],
  newPos: number
) {
  player.position = newPos;
  await game.handlePlayerLand(oldPos, Utils.sum(...dices));
  if (player.isBroke) {
    game.emitToEveryone('player-broke', player.name);
    game.players.splice(game.players.indexOf(player), 1);
    game.turn--;
    game.spectators.push(player.name);
  }
  game.nextTurn();
}

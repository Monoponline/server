import Game from '../Game';
import Board, { Cell } from './Board';
import Type from './Type';

export default class Actions {
    public static execute(game: Game, cell: Cell, dice: number) {
        const player = game.getPlayerTurn();
        const renter = game.getCellState(cell.position);
        switch (cell.type) {
            case Type.PROPERTY:
                if (!renter) {
                    if (player.canAfford(cell.price!)) {
                        player.addProperty(cell.position);
                        player.setAccount(player.getAccount() - cell.price!);
                        game.emitToEveryone('buy-house', player.getName(), cell.name);
                    } else {
                        game.emitToEveryone('cant-afford', player.getName(), cell.name);
                    }
                } else {
                    if (renter.getName() === player.getName()) return;
                    const houses = game.getCellHouses(cell.position);
                    const rent = cell.rent![houses];
                    console.log(rent);
                    renter.setAccount(renter.getAccount() + rent);
                    player.setAccount(player.getAccount() - rent);
                    game.emitToEveryone('paid-rent', player.getName(), renter.getName(), rent);
                }
                break;
            case Type.STATION:
                if (!renter) {
                    if (player.canAfford(200)) {
                        player.addProperty(cell.position);
                        player.setAccount(player.getAccount() - 200);
                        game.emitToEveryone('buy-house', player.getName(), cell.name);
                    } else {
                        game.emitToEveryone('cant-afford', player.getName(), cell.name);
                    }
                } else {
                    if (renter.getName() === player.getName()) return;
                    const houses = renter.getStationsOwned() - 1;
                    const rent = [25, 50, 100, 200][houses];
                    renter.setAccount(renter.getAccount() + rent);
                    player.setAccount(player.getAccount() - rent);
                    game.emitToEveryone('paid-rent', player.getName(), renter.getName(), rent);
                }
                break;
            case Type.UTILITY:
                if (!renter) {
                    if (player.canAfford(150)) {
                        player.addProperty(cell.position);
                        player.setAccount(player.getAccount() - 150);
                        game.emitToEveryone('buy-house', player.getName(), cell.name);
                    } else {
                        game.emitToEveryone('cant-afford', player.getName(), cell.name);
                    }
                } else {
                    if (renter.getName() === player.getName()) return;
                    const houses = renter.getUtilitiesOwned() - 1;
                    const rent = [dice * 4, dice * 10][houses];
                    renter.setAccount(renter.getAccount() + rent);
                    player.setAccount(player.getAccount() - rent);
                    game.emitToEveryone('paid-rent', player.getName(), renter.getName(), rent);
                }
                break;
            case Type.SPECIAL:
                cell.action!(game, player);
                break;
            case Type.CHANCE:
                const chanceCard = Board.chanceDeck[Math.floor(Math.random() * Board.chanceDeck.length)];
                game.emitToUser(player.getName(), 'chance-card', chanceCard.title);
                chanceCard.action(game, player);
                break;
            case Type.COMMUNITY_CHEST:
                const ccCard = Board.communityChestDeck[Math.floor(Math.random() * Board.communityChestDeck.length)];
                game.emitToUser(player.getName(), 'cc-card', ccCard.title);
                ccCard.action(game, player);
                break;
        }
    }
}

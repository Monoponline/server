import Game from '../Game';
import { Cell } from './Board';
import Type from './Type';

export default class Actions {
    public static execute(game: Game, cell: Cell) {
        const player = game.getPlayerTurn();
        switch (cell.type) {
            case Type.PROPERTY:
                const renter = game.getCellState(cell.position);
                if (!renter) {
                    if (player.canAfford(cell.price)) {
                        player.addProperty(cell.position);
                        game.emitToEveryone('buy-house', player.getName(), cell.name);
                    } else {
                        game.emitToEveryone('cant-afford', player.getName(), cell.name);
                    }
                } else {
                    const houses = game.getCellHouses(cell.position);
                    const rent = cell.rent[houses];
                    renter.setAccount(renter.getAccount() + rent);
                    player.setAccount(player.getAccount() - rent);
                    game.emitToEveryone('paid-rent', player.getName(), renter.getName(), rent);
                }
                break;
        }
    }
}

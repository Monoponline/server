import Board from '../board/Board';
import GameService from '../game/GameService';

export default class Player {
  public static AVATARS = [
    'battleship',
    'car',
    'dog',
    'hat',
    'iron',
    'shoe',
    'thimble',
    'wheelbarrow'
  ];

  public name: string;
  public avatar: string;
  public position = 0;
  public inJail = false;
  public jailTurn = 0;
  public exitJailCards = 0;
  public properties = [] as number[];
  public account = 1500;

  constructor(name: string) {
    this.name = name;
    this.avatar =
      Player.AVATARS[Math.floor(Math.random() * Player.AVATARS.length)];
  }

  public get isBroke() {
    return this.account <= 0;
  }

  public canAfford(price: number) {
    return 0 < this.account - price;
  }

  public getStationsOwned() {
    let validate = [
      this.properties.includes(5),
      this.properties.includes(15),
      this.properties.includes(25),
      this.properties.includes(35)
    ];
    validate = validate.filter((value) => value);
    return validate.length;
  }

  public getUtilitiesOwned() {
    let validate = [this.properties.includes(12), this.properties.includes(28)];
    validate = validate.filter((value) => value);
    return validate.length;
  }

  public tradeRequest = (json: string) => {
    const game = GameService.instance.getPlayerGame(this.name);
    const trade = JSON.parse(json);
    const s = game.socket[trade.player];
    if (s) {
      s.emit('trade-req', this.name, JSON.stringify(trade));
      game.socket[this.name].emit('trade-req-sent');
      s.on('response-trade', (accept: boolean) => {
        if (accept) {
          for (const property of trade.cardToGive) {
            this.properties.splice(this.properties.indexOf(property.value), 1);
            game.getPlayer(trade.player).properties.push(property.value);
          }
          for (const property of trade.cardToReceive) {
            this.properties.push(property.value);
            game
              .getPlayer(trade.player)
              .properties.splice(
                game.getPlayer(trade.player).properties.indexOf(property.value),
                1
              );
          }
          this.account += trade.moneyToReceive;
          game.getPlayer(trade.player).account -= trade.moneyToReceive;
          this.account -= trade.moneyToGive;
          game.getPlayer(trade.player).account += trade.moneyToGive;
          game.update();
        } else {
          game.socket[this.name].emit('canceled-trade');
        }
      });
    }
  };

  public buyProperty = (cell: number) => {
    const game = GameService.instance.getPlayerGame(this.name);
    if (
      Board.cells
        .filter((c) => c.color === Board.cells[cell].color)
        .find(
          (c) => game.getCellHouses(c.position) < game.getCellHouses(cell)
        ) ||
      game.getCellHouses(cell) === 5
    )
      return game.socket[this.name].emit('cant-upgrade');
    if (game.getPlayerTurn() !== this) return;
    const price = Board.housesPrice[Board.cells[cell].color];
    if (
      Board.cells.filter((c) => c.color === Board.cells[cell].color).length !==
      game
        .getCellState(cell)
        .properties.filter(
          (p) => Board.cells[cell].color === Board.cells[p].color
        ).length
    )
      return;
    if (this.canAfford(price)) {
      if (game.getCellHouses(cell) === 4 && game.bankService.hotelLeft === 0)
        return game.socket[this.name].emit('cant-upgrade');
      if (game.getCellHouses(cell) !== 4 && game.bankService.houseLeft === 0)
        return game.socket[this.name].emit('cant-upgrade');

      if (game.getCellHouses(cell) === 4) {
        game.bankService.hotelLeft--;
        game.bankService.houseLeft += 4;
      } else {
        game.bankService.houseLeft--;
      }

      const house = game.houses.find((h) => h.cell === cell);
      house
        ? house.houses++
        : game.houses.push({
            houses: 1,
            cell
          });
      this.account -= price;
      game.socket[this.name].emit('bought-house', Board.cells[cell].name);
      game.update();
    } else {
      game.emitToEveryone('cant-afford', this.name, `${cell} maisons`);
    }
  };

  public sellProperty = (cell: number) => {
    const game = GameService.instance.getPlayerGame(this.name);
    if (game.getCellHouses(cell) === 0)
      return game.socket[this.name].emit('cant-sell');
    if (game.getPlayerTurn() !== this) return;

    if (game.getCellHouses(cell) === 5 && game.bankService.houseLeft < 4)
      return game.socket[this.name].emit('cant-sell');
    if (game.getCellHouses(cell) === 5) {
      game.bankService.hotelLeft++;
      game.bankService.houseLeft -= 4;
    } else {
      game.bankService.houseLeft++;
    }

    const price = Board.housesPrice[Board.cells[cell].color] / 2;
    game.houses.find((h) => h.cell === cell).houses -= 1;
    this.account += price;
    game.socket[this.name].emit('sold-house', Board.cells[cell].name);
    game.update();
  };

  public mortgageProperty(cell: number) {
    const game = GameService.instance.getPlayerGame(this.name);
  }

  public unmortgageProperty(cell: number) {}

  public toJSON() {
    return JSON.stringify({
      name: this.name,
      position: this.position,
      avatar: this.avatar,
      properties: this.properties,
      account: this.account
    });
  }
}

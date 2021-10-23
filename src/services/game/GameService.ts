import Game from './Game';

export default class GameService {
  public static instance = new GameService();

  private games = [] as Game[];

  public get(gameId: string) {
    return this.games.find((game) => game.id === gameId);
  }

  public add(game: Game) {
    this.games.push(game);
  }

  public remove(gameId: string) {
    this.get(gameId).stop();
  }

  public getPlayerGame(player: string) {
    return this.games.find((game) =>
      game.players.map((p) => p.name).includes(player)
    );
  }
}

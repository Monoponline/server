export default class PlayerService {
  public static instance = new PlayerService();

  private players = [] as string[];

  public add(player: string) {
    this.players.push(player);
  }

  public remove(player: string) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  public contains(player: string) {
    return this.players.includes(player);
  }
}

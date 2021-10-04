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

  private name: string;
  private avatar: string;
  private position: number = 0;
  private inJail: boolean = false;
  private jailTurn: number = 0;
  private properties: number[] = [];
  private account: number = 1500;

  constructor(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public getPosition() {
    return this.position;
  }

  public setPosition(position: number) {
    this.position = position;
  }

  public getAccount() {
    return this.account;
  }

  public setAccount(account: number) {
    this.account = account;
  }

  public getAvatar() {
    return this.avatar;
  }

  public setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  public getProperties() {
    return this.properties;
  }

  public addProperty(property: number) {
    this.properties.push(property);
  }

  public isBroke() {
    return this.account <= 0;
  }

  public isInJail() {
    return this.inJail;
  }

  public getJailTurn() {
    return this.jailTurn;
  }

  public setJailTurn(jailTurn: number) {
    this.jailTurn = jailTurn;
  }

  public canAfford(price: number) {
    return 0 < (this.account - price);
  }

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

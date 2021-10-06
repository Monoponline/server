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
  private position = 0;
  private inJail = false;
  private jailTurn = 0;
  private exitJailCards = 0;
  private properties = [] as number[];
  private account = 1500;

  constructor(name: string) {
    this.name = name;
    this.avatar = Player.AVATARS[Math.floor(Math.random() * Player.AVATARS.length)];
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

  public setInJail(inJail: boolean) {
    this.inJail = inJail;
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

  public getExitJailCards() {
    return this.exitJailCards;
  }

  public setExitJailCards(exitJailCards: number) {
    this.exitJailCards = exitJailCards;
  }

  public getStationsOwned() {
    let validate = [this.properties.includes(5), this.properties.includes(15), this.properties.includes(25), this.properties.includes(35)];
    validate = validate.filter((value) => value);
    return validate.length;
  }

  public getUtilitiesOwned() {
    let validate = [this.properties.includes(12), this.properties.includes(28)];
    validate = validate.filter((value) => value);
    return validate.length;
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

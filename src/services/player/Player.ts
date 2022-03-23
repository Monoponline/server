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
  public mortgagedProperties = [] as number[];
  public account = 1500;

  constructor(name: string) {
    this.name = name;
    this.avatar =
      Player.AVATARS[Math.floor(Math.random() * Player.AVATARS.length)];
  }

  public addProperty(property: number) {
    this.properties.push(property);
  }

  public removeProperty(property: number) {
    this.properties.splice(this.properties.indexOf(property), 1);
  }

  public mortgageProperty(property: number) {
    this.mortgagedProperties.push(property);
  }

  public unmortgageProperty(property: number) {
    this.mortgagedProperties.splice(
      this.mortgagedProperties.indexOf(property),
      1
    );
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

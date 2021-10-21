var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  default: () => Player
});
const _Player = class {
  constructor(name) {
    this.position = 0;
    this.inJail = false;
    this.jailTurn = 0;
    this.exitJailCards = 0;
    this.properties = [];
    this.account = 1500;
    this.name = name;
    this.avatar = _Player.AVATARS[Math.floor(Math.random() * _Player.AVATARS.length)];
  }
  getName() {
    return this.name;
  }
  getPosition() {
    return this.position;
  }
  setPosition(position) {
    this.position = position;
  }
  getAccount() {
    return this.account;
  }
  setAccount(account) {
    this.account = account;
  }
  getAvatar() {
    return this.avatar;
  }
  setAvatar(avatar) {
    this.avatar = avatar;
  }
  getProperties() {
    return this.properties;
  }
  addProperty(property) {
    this.properties.push(property);
  }
  removeProperty(property) {
    this.properties.splice(this.properties.indexOf(property), 1);
  }
  isBroke() {
    return this.account <= 0;
  }
  isInJail() {
    return this.inJail;
  }
  setInJail(inJail) {
    this.inJail = inJail;
  }
  getJailTurn() {
    return this.jailTurn;
  }
  setJailTurn(jailTurn) {
    this.jailTurn = jailTurn;
  }
  canAfford(price) {
    return 0 < this.account - price;
  }
  getExitJailCards() {
    return this.exitJailCards;
  }
  setExitJailCards(exitJailCards) {
    this.exitJailCards = exitJailCards;
  }
  getStationsOwned() {
    let validate = [
      this.properties.includes(5),
      this.properties.includes(15),
      this.properties.includes(25),
      this.properties.includes(35)
    ];
    validate = validate.filter((value) => value);
    return validate.length;
  }
  getUtilitiesOwned() {
    let validate = [this.properties.includes(12), this.properties.includes(28)];
    validate = validate.filter((value) => value);
    return validate.length;
  }
  toJSON() {
    return JSON.stringify({
      name: this.name,
      position: this.position,
      avatar: this.avatar,
      properties: this.properties,
      account: this.account
    });
  }
};
let Player = _Player;
Player.AVATARS = [
  "battleship",
  "car",
  "dog",
  "hat",
  "iron",
  "shoe",
  "thimble",
  "wheelbarrow"
];

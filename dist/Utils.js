var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  default: () => Utils
});
class Utils {
  static rollDice(diceCount = 1) {
    const dices = [];
    for (let index = 0; index < diceCount; index++) {
      dices.push(this.POSIBILITIES[Math.floor(Math.random() * this.POSIBILITIES.length)]);
    }
    return dices;
  }
  static isSocketValid(socket) {
    return typeof socket.handshake.query.username === "string";
  }
  static sum(...num) {
    let result = 0;
    for (let index = 0; index < num.length; index++) {
      const element = num[index];
      result += element;
    }
    return result;
  }
  static areEquals(...objects) {
    for (let index = 0; index < objects.length; index++) {
      const element = objects[index];
      if (objects.find((o) => o !== element))
        return false;
    }
    return true;
  }
}
Utils.POSIBILITIES = [1, 2, 3, 4, 5, 6];

import { UserSocket } from '../services/networking/UserSocketService';

export default class Utils {
  private static POSIBILITIES = [1, 2, 3, 4, 5, 6];

  public static rollDice(diceCount = 1) {
    const dices: number[] = [];
    for (let index = 0; index < diceCount; index++) {
      dices.push(
        this.POSIBILITIES[Math.floor(Math.random() * this.POSIBILITIES.length)]
      );
    }
    return dices;
  }

  public static isSocketValid(socket: UserSocket) {
    return typeof socket.handshake.query.username === 'string';
  }

  public static sum(...num: number[]) {
    let result = 0;
    for (let index = 0; index < num.length; index++) {
      const element = num[index];
      result += element;
    }
    return result;
  }

  public static areEquals(...objects: any[]) {
    for (let index = 0; index < objects.length; index++) {
      const element = objects[index];
      if (objects.find((o) => o !== element)) return false;
    }
    return true;
  }

  /**
   * Resolve `T` value from `T | (() => T)`
   * @param item - resolvable
   * @param args - parameters for resolvable function
   */
  public static scrap<T, A extends any[] = []>(
    item: Scrap<T, A>,
    ...args: A
  ): T | Promise<T> {
    // @ts-ignore
    return typeof item === 'function' ? item(...args) : item;
  }
}

export type Scrap<T, A extends any[] = []> =
  | T
  | ((...args: A) => T | Promise<T>);

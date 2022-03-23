import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
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

  public static waitForResponseChoice(socket: UserSocket): Promise<number> {
    return new Promise((r) => {
      socket.once('response-choice', (choice: number) => {
        r(choice);
      });
    });
  }

  public static isSocketValid(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
  ) {
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

  public static areEquals(...objects: any[]): boolean {
    for (let index = 0; index < objects.length; index++) {
      const element = objects[index];
      if (objects.find((o) => o !== element)) return false;
    }
    return true;
  }
}

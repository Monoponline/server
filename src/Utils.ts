export default class Utils {
    private static POSIBILITIES = [1, 2, 3, 4, 5, 6];

    public static rollDice(diceCount = 1) {
        const dices: number[] = [];
        for (let index = 0; index < diceCount; index++) {
            dices.push(this.POSIBILITIES[Math.floor(Math.random() * this.POSIBILITIES.length)]);
        }
        return dices;
    }
}
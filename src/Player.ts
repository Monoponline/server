export default class Player {
    private name: string;
    private position: number;

    constructor(name: string) {
        this.name = name;
        this.position = 0;
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
}

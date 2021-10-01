export default class Player {
    public static AVATARS = ['battleship', 'car', 'dog', 'hat', 'iron', 'shoe', 'thimble', 'wheelbarrow'];

    private name: string;
    private position: number;
    private avatar: string;
    private properties: number[];
    private account: number;

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

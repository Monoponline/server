import Game from '../Game';
import Player from '../Player';
import Type from './Type';

export default {
    cells: [
        {
            name: 'Go',
            type: Type.SPECIAL,
            position: 0,
            // action: (game: Game, player: Player) => {
            //     game.getPlayerTurn().setAccount(player.getAccount() + (player.getPosition() === 0 ? 400 : 200));
            // }
        },
        {
            name: 'Avenue de la république',
            type: Type.PROPERTY,
            position: 1,
            rent: [],
            price: 120
        },
        {
            name: 'Rue de courcelles',
            type: Type.PROPERTY,
            position: 2
        }
    ],
    chanceDeck: [
        {
            title: "Advance to go collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "You inherit $100",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Go to Jail, Go directly to jail. Do not pass go. Do not collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Holiday fund matures, collect $100",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Income tax refund, collect $20",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "School fees. Pay $50",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Hospital Fees. Pay $100",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Collect $25 consultancy fee",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Get out of jail free. This card may be kept until needed, traded or sold.",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Bank error in your favour. Collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "It's your birthday collect $10 from each player",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Life insurance matures. Collect $100",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "From sale of stock, you get $50",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Doctor's fees. Pay $50",
            action: (game: Game, player: Player) => {

            }
        }
    ],
    communityChestDeck: [
        {
            title: "Get out of jail free. This card may be kept until needed, traded or sold.",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Go to Jail, Go directly to jail. Do not pass go. Do not collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to the next station. If UNOWNED, you may buy it from the bank. If OWNED, pay the owner twice the rent to which they are otherwise entitled",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to MayFair",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to the next station. If UNOWNED, you may buy it from the bank. If OWNED, pay the owner twice the rent to which they are otherwise entitled",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "You have been elected chairman of the board, pay each player $50",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to Trafalgar Square. If you pass go collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Your building loan matures, collect $150",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to go, collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Take a trip to king's cross station, if you pass go collect $200",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Speeding fine, pay $15",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to the nearest utility, if UNOWNED, you may buy it from the bank. If OWNED, roll the dice and pay the owner 10 times your roll",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Make general repairs on all you property: For each house pay $25, for each hotel pay $100",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Go back 3 spaces",
            action: (game: Game, player: Player) => {

            }
        },
        {
            title: "Advance to Pall Mall, if you pass go collect $200",
            action: (game: Game, player: Player) => {

            }
        }
    ]
} as {
    cells: Cell[];
    chanceDeck: Chance[];
    communityChestDeck: Chance[];
}

export interface Cell {
    name: string;
    type: Type;
    position: number;
    rent: number[];
    price: number;
}

export interface Chance {
    title: string;
    action: (game: Game, player: Player) => void;
}

export interface CommunityChest {
    title: string;
    action: (game: Game, player: Player) => void;
}

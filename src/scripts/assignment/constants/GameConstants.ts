export enum GameContants {
    NUMBER_OF_BET_COINS = 5,
    INITIAL_DEALER_CARDS = 2,
    INITIAL_USER_CARDS = 2,

}


export enum PosConstant {
    User_Reveal_Card_PosX = -550,
    User_Reveal_Card_PosY = -120,
    User_Reaveal_Card_Offset = 30,

    Dealer_Reveal_Card_PosX = User_Reveal_Card_PosX + 1010,
    Dealer_Reveal_Card_PosY = -120,

    Flipped_Card_PosX =  -46,
    Flipped_Card_posY = -350
}

export enum PlayerType {
    User = "User",
    Dealer = "Dealer",
    None = "None"
}

export enum Result {
    Win= "Win",
    Lose = "Lose",
    Draw = "Draw",
    Bust = "Bust",
    None = "None",
    
}

export enum BlackJack {
    Win = "Win",
    Lose = "Lose",
    None = "None",
}

export  const  MinimumBetPlacedToPlay = 10;

import { BlackJack, PlayerType, Result } from "./constants/GameConstants";

export class GameModel {
    constructor(playerType: PlayerType) {
        this.setPlayerTurn(playerType);
        this.setCreditAmt(1000);
    }

    getWinAmt(): number {
        if (this.blackJackStatus === BlackJack.Win) {
            return this.totalBetAmt * 3
        } else if (this.result === Result.Win) {
            return this.totalBetAmt * 2
        } else if (this.result === Result.Draw) {
            return this.totalBetAmt;
        } else {
            return 0;
        }
    }

    updateTotalBet(value: number) {
        this.totalBetAmt += value
        this.updateCredit(-value)
        console.log(this.totalBetAmt);
    }

    getTotalBet(): number {
        return this.totalBetAmt
    }

    updateCredit(value: number) {
        this.creditAmt += value;
    }

    getCreditAmt(): number {
        return this.creditAmt;
    }

    setCreditAmt(value: number) {
        this.creditAmt = value;
    }


    setUserCardrData(data: number) {
        this.userCards.push(data);
    }

    getUserCardData(): number[] {
        return this.userCards
    }
    setDealerCardrData(data: number) {
        this.dealerCards.push(data);
    }

    getDealerCardData(): number[] {
        return this.dealerCards
    }

    setPlayerTurn(playerTurn: PlayerType) {
        this.playerTurn = playerTurn;
    }

    getPlayerTurn(): PlayerType {
        return this.playerTurn;
    }

    setUserScore(value: number) {
        this.userScore = value;
    }
    getUserScore(): number {
        return this.userScore;
    }

    setDealerScore(value: number) {
        this.dealerScore = value;
    }
    getDealerScore(): number {
        return this.dealerScore;
    }

    setResult(value: Result) {
        this.result = value;
    }
    getResult(): Result {
        return this.result;
    }

    setBlackJack(value: BlackJack) {
        this.blackJackStatus = value;
    }
    getBlackJack(): BlackJack {
        return this.blackJackStatus;
    }

    resetModel() {
        this.userCards.length = 0;
        this.dealerCards.length = 0;
        this.userScore = 0;
        this.dealerScore = 0;
        this.result = Result.None;
        this.blackJackStatus = BlackJack.None;
        this.playerTurn = PlayerType.None;
        this.totalBetAmt = 0;
    }



    private userCards: number[] = [];
    private dealerCards: number[] = [];
    private playerTurn: PlayerType;
    private userScore: number = 0;
    private dealerScore: number = 0;
    private result: Result;
    private blackJackStatus: BlackJack = BlackJack.None;
    private totalBetAmt: number = 0;
    private creditAmt: number;

}
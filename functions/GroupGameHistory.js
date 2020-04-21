module.exports = class GroupGameHistory {


    constructor(gameWord, numOfAttempts) {

        this.gameWord = gameWord;
        this.numOfAttempts = numOfAttempts
    }

    getGameWord() {
        return this.gameWord
    }
    setGameWord(value) {
        this.gameWord = value
    }
    
    getNumOfAttempts() {
        return this.numOfAttempts
    }
    setNumOfAttempts(value) {
        this.numOfAttempts = value
    }
    


}
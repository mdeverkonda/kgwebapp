module.exports = class PlayerWord {

    constructor(gameId, playerName, attemptedWord, wordResult) {

        this.playerWordId = 'pw' + Date.now();
        this.playerName = playerName;
        this.gameId = gameId;
        this.attemptedWord = attemptedWord;
        this.wordResult = wordResult;    
    }
    
    getPlayerWordId() {
        return this.playerWordId
    }

    getGameId() {
        return this.gameId
    }
    setGameId(value) {
        this.gameId = value
    }

    getattemptedWord() {
        return this.attemptedWord
    }
    setattemptedWord(value) {
        this.attemptedWord = value
    }
    
    getWordResult() {
        return this.wordResult
    }
    setWordResult(value) {
        this.wordResult = value
    }

}
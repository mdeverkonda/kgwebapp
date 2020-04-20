module.exports = class PlayerWord {

    constructor(playerName, playerCurrentWord, wordResult) {

        this.playerName = playerName;
        this.playerCurrentWord = playerCurrentWord;
        this.wordResult = wordResult;    
    }
    
    
    getPlayerName() {
        return this.playerName
    }
    setPlayerName(value) {
        this.playerName = value
    }
    
    getPlayerCurrentWord() {
        return this.playerCurrentWord
    }
    setPlayerCurrentWord(value) {
        this.playerCurrentWord = value
    }
    
    getWordResult() {
        return this.wordResult
    }
    setWordResult(value) {
        this.wordResult = value
    }

}
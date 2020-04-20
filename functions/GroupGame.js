let PlayerWord = require('./PlayerWord.js')

module.exports = class GroupGame {


    constructor(groupName, gameWord, playerWords) {

        this.groupName = groupName;
        this.gameWord = gameWord;
        this.playerWords = playerWords;    
    }


    getGroupName() {
        return this.groupName
    }
    setGroupName(value) {
        this.groupName = value
    }

    getGameWord() {
        return this.gameWord
    }
    setGameWord(value) {
        this.gameWord = value
    }
    
    getPlayerWords() {
        return this.playerWords
    }
    
    // setPlayerWords(value) {
    //     this._playerWords = value
    // }

    addPlayerWord(playerWord){
        if(this.playerWords == null || this.playerWords == undefined) {
            this.playerWords = new Array(PlayerWord)
        }
        this.playerWords.push(playerWord)
    }

}
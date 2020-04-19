let PlayerWord = require('./PlayerWord.js')

module.exports = class GroupGame {



    _groupName
    get groupName() {
        return this._groupName
    }
    set groupName(value) {
        this._groupName = value
    }

    _gameWord
    get gameWord() {
        return this._gameWord
    }
    set gameWord(value) {
        this._gameWord = value
    }
    
    _playerWords = new Array(PlayerWord)
    get playerWords() {
        return this._playerWords
    }
    set playerWords(value) {
        this._playerWords = value
    }

}
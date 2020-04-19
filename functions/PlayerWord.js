module.exports = class PlayerWord {

    _playerName
    get playerName() {
        return this._playerName
    }
    set playerName(value) {
        this._playerName = value
    }
    
    _playerCurrentWord
    get playerCurrentWord() {
        return this._playerCurrentWord
    }
    set playerCurrentWord(value) {
        this._playerCurrentWord = value
    }
    
    _wordResult
    get wordResult() {
        return this._wordResult
    }
    set wordResult(value) {
        this._wordResult = value
    }

}
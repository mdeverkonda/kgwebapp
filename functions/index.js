const functions = require('firebase-functions');
const express = require('express');
//const engines = require('consolidate');

var hbs = require('express-hbs');

var GameDetails = require('./GameDetails.js')
var PlayerWord = require('./PlayerWord.js')
var GroupHistory = require('./GroupHistory.js')
var GroupGameHistory = require('./GroupGameHistory.js')

const app = express();

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// app.engine('hbs', engines.handlebars);
// app.set('views', './views');
// app.set('view engine', 'hbs');



hbs.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

//Load Home Page
app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    var pages = {
        'name'   : 'index',
     };
    
    response.render('index', pages)
});

//Get all current games
//This will be called from group home
app.get('/cnb/grphome', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    currentGames = getCurrentGames()

    var pages = {
        'name'   : 'cowsandbulls',
        'currentGames' : currentGames
     };

    
    response.render('index', pages)

});

//Post from group page - to start a new game
//Can be used from game page as well
//search GameDetails with grpName with isGameInProgress=true
//if exists.. return that game details and route to gamePage
app.post('/cnb/games', (request, response) => {

    playerName = request.body.playerName
    groupName = request.body.groupName

    //First search in GameDetails if a game exists for current Group
    gameDetails = searchGameByGroupName(groupName)

    gameInProgrss = false
    newGameAllowed = false
    playerWords = null

    if (gameDetails != null ) {

        gameInProgress = true
        newGameAllowed = false
        playerWords = gameDetails.getPlayerWords()
        
    }

    grpHistory = getGroupHistory(groupName)

    //TODO: 
    //Read words into sets of 4

    var pages = {
        'name'   : 'cowsandbulls_game',
        'newGameAllowed' : isNewGameAllowed,
        'gameInProgress' : isGameInProgress,
        'gameDetails' : gameDetails,
        'words' : playerWords,
        'grpHistory' : grpHistory,
     };
    
    response.render('index', pages)
});

//Return current game history... all the words from all players (GameDetails)
//search GameDetails with gameId 
//return the game details and route to gamePage
//Not Sure if this will ever be used
app.get('/cnb/games/:id', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    isNewGameAllowed = "false"
    isGameInProgress = "true"


    var pages = {
        'name'   : 'cowsandbulls_game',
        'newGameAllowed' : isNewGameAllowed,
        'gameInProgress' : isGameInProgress
     };
    
    response.render('index', pages)
});


//Post players word for the current game
//return the wordResult and gameDetails to the gamePage
app.post('/cnb/games/:id/playerWord', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    gameId = req.params.id

    gameDetails = searchGameByGameId(gameId)
    playerWordStr = request.body.playerWord
    //Assuming its not the right word
    //TODO: need to add logic to complete the game if its the right word and provide new game option

    gameInProgrss = false
    newGameAllowed = false
    playerWords = null

    if (gameDetails != null ) {

        gameInProgress = true
        newGameAllowed = false
        playerWord = new PlayerWord(gameId, playerName, playerWordStr, "1C, 0B")
        gameDetails.addPlayerWord(playerWord)

        playerWords = gameDetails.getPlayerWords()
        
    }

    grpHistory = getGroupHistory(groupName)

    //TODO: 
    //Read words into sets of 4

    var pages = {
        'name'   : 'cowsandbulls_game',
        'newGameAllowed' : isNewGameAllowed,
        'gameInProgress' : isGameInProgress,
        'gameDetails' : gameDetails,
        'words' : playerWords,
        'grpHistory' : grpHistory,
     };
    
    response.render('index', pages)
});

//Return current groups history... all the words from all players and no of attempts to solve the word
//serach GroupHistory by groupName 
//Not sure if we will ever call this by itself
app.get('/cnb/group/:grpName/history', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    groupName = req.params.grpName

    grpHistory = getGroupHistory(groupName)

    var pages = {
        'name'   : 'cowsandbulls_game',
        'grpHistory' : grpHistory
     };
    
    response.render('index', pages)
});










//A function that connects to backend service to return history info for given groupName

function searchGameByGroupName(groupName) {

    var gameDetailsList = buildMockGameDetailsList()

    for (gameDetails in gameDetailsList) {

        if (gameDetails.getGroupName() == groupName) {
            return gameDetails
        }

    }

}

function buildMockGameDetailsList() {

    //    constructor(groupName, gameWord, gameInProgress) {
    var gameDetails1 = new GameDetails("AnjuCousins", "five")
    var playerWord11 = new PlayerWord(gameDetails1.getGameId(), "Madhav", "brim", "1C, 2B")
    var playerWord12 = new PlayerWord(gameDetails1.getGameId(), "Santosh", "soup", "2C, 2B")
    var playerWord13 = new PlayerWord(gameDetails1.getGameId(), "Anju", "type", "0C, 2B")
    var playerWord14 = new PlayerWord(gameDetails1.getGameId(), "Madhav", "know", "0C, 0B")

    gameDetails1.addPlayerWord(playerWord11)
    gameDetails1.addPlayerWord(playerWord12)
    gameDetails1.addPlayerWord(playerWord13)
    gameDetails1.addPlayerWord(playerWord14)

    //    constructor(groupName, gameWord, gameInProgress) {
    var gameDetails2 = new GameDetails("MadhavCousins", "word")
    var playerWord21 = new PlayerWord(gameDetails1.getGameId(), "Madhav", "sump", "1C, 2B")
    var playerWord22 = new PlayerWord(gameDetails1.getGameId(), "Sirisha", "tour", "2C, 2B")
    var playerWord23 = new PlayerWord(gameDetails1.getGameId(), "Dinesh", "ride", "0C, 2B")
    var playerWord24 = new PlayerWord(gameDetails1.getGameId(), "Sirisha", "gate", "0C, 0B")

    gameDetails2.addPlayerWord(playerWord21)
    gameDetails2.addPlayerWord(playerWord22)
    gameDetails2.addPlayerWord(playerWord23)
    gameDetails2.addPlayerWord(playerWord24)
    

    var gameDetailsList = new Array(GameDetails)
    gameDetailsList.push(gameDetails1)
    gameDetailsList.push(gameDetails2)

    return gameDetailsList
            
}

function getGroupHistory(groupName) {

    //Return Mock Group History until backend connectivity is built
    //constructor(groupName, gameWords, numOfAttempts) {
    
    if (groupName == "AnjuCousins") {
        
        var grpHistory = new GroupHistory(groupName)
    
        var gameHist1 = new GroupGameHistory("word", 9)
        grpHistory.addGameHistory(gameHist1)
    
        var gameHist1 = new GroupGameHistory("five", 5)
        grpHistory.addGameHistory(gameHist1)

        return grpHistory
    
    } else if (groupName == "MadhavCousins") {

        var grpHistory = new GroupHistory(groupName)
    
        var gameHist1 = new GroupGameHistory("four", 1)
        grpHistory.addGameHistory(gameHist1)
    
        var gameHist1 = new GroupGameHistory("jinx", 7)
        grpHistory.addGameHistory(gameHist1)

        return grpHistory
    
    }

} 

function getCurrentGames() {

    gameDetailsList = buildMockGameDetailsList()

    var groupIdsList = new Array(String)

    for(gameDetails in gameDetailsList) {
        groupIdsList.push(gameDetails.groupName)
    }

    return groupIdsList

}

function checkTheWord(playerWord, gameId) {
    //for now hardcoded
}

function searchGameByGameId(gameId) {

    gameDetailsList = buildMockGameDetailsList()

    for(gameDetails in gameDetailsList) {

        if(gameDetails.getGameId() == gameId) {
            return gameDetails
        }

    }


}

app.get('/bookcricket', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    var pages = {
        'name'   : 'bookcricket',
     };
    
    response.render('index', pages)
});


exports.app = functions.https.onRequest(app);

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

hbs.registerHelper('option', function(value) {
    var selected = value.toLowerCase() === (this.toString()).toLowerCase() ? 'selected="selected"' : '';
    return '<option value="' + this + '" ' + selected + '>' + this + '</option>';
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
app.get('/cowsandbulls', (request, response) => {
    //response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    currentGames = getCurrentGames()

    // console.log("$$$$$$$ Current Games List : $$$$$$$$$$$")
    // console.log("Current Games length : ", currentGames.length)
    // console.log(currentGames)

    // for (i=0; i<currentGames.length; i++) {
    //     console.log("GroupId from mock :" , currentGames[i].groupName)
    // }


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
app.post('/cowsandbulls', (request, response) => {

    playerName = request.body.playerName
    groupName = request.body.groupName

    // console.log("playerName: ", playerName)
    // console.log("groupName: ", groupName)


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
        'newGameAllowed' : newGameAllowed,
        'gameInProgress' : gameInProgrss,
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
app.get('/cowsandbulls_game', (request, response) => {

    groupName = request.query.groupName

    console.log("GroupName in the req params : ", groupName)


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

    for(i=0; i< gameDetailsList.length; i++) {
        console.log("gameId from caller: ", gameDetailsList[i].gameId)
        console.log("groupName from caller: ", gameDetailsList[i].groupName)

        if (gameDetailsList[i].groupName == groupName) {
            return gameDetailsList[i]
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

    //console.log(gameDetails1.getGameId())

    //    constructor(groupName, gameWord, gameInProgress) {
    var gameDetails2 = new GameDetails("MadhavCousins", "word")
    var playerWord21 = new PlayerWord(gameDetails2.getGameId(), "Madhav", "sump", "1C, 2B")
    var playerWord22 = new PlayerWord(gameDetails2.getGameId(), "Sirisha", "tour", "2C, 2B")
    var playerWord23 = new PlayerWord(gameDetails2.getGameId(), "Dinesh", "ride", "0C, 2B")
    var playerWord24 = new PlayerWord(gameDetails2.getGameId(), "Sirisha", "gate", "0C, 0B")

    gameDetails2.addPlayerWord(playerWord21)
    gameDetails2.addPlayerWord(playerWord22)
    gameDetails2.addPlayerWord(playerWord23)
    gameDetails2.addPlayerWord(playerWord24)
    

    var gameDetailsList = [gameDetails1, gameDetails2]

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

    console.log("$$$$$$$ Current Games $$$$$$$$$$$")

    gameDetailsList = buildMockGameDetailsList()

    console.log("game Details List : ", gameDetailsList)
    
    groupIdsList = new Array(gameDetailsList.length)
    //gameDetails = new GameDetails()

    for(i=0; i< gameDetailsList.length; i++) {
        console.log("gameId from caller: ", gameDetailsList[i].gameId)
        console.log("groupName from caller: ", gameDetailsList[i].groupName)
        groupIdsList[i] = ({'groupName': gameDetailsList[i].groupName})
    }

    return groupIdsList

}

function checkTheWord(playerWord, gameId) {
    //for now hardcoded
}

function searchGameByGameId(gameId) {

    gameDetailsList = buildMockGameDetailsList()

    for(i=0; i< gameDetailsList.length; i++) {
        console.log("gameId from caller: ", gameDetailsList[i].gameId)
        console.log("groupName from caller: ", gameDetailsList[i].groupName)

        if (gameDetailsList[i].gameId == gameId) {
            return gameDetailsList[i]
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

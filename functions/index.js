const functions = require('firebase-functions');
const express = require('express');
//const engines = require('consolidate');

var hbs = require('express-hbs');

var GroupGame = require('./GroupGame.js')
var PlayerWord = require('./PlayerWord.js')

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


app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    var pages = {
        'name'   : 'index',
     };
    
    response.render('index', pages)
});


function getCurrentGameWords(currWord) {

    wordMap = new Map()

    wordMap.set("name", "1C, 1B")
    wordMap.set("five", "1C, 1B")
    wordMap.set("long", "1C, 1B")
    wordMap.set("live", "1C, 1B")
    wordMap.set("four", "1C, 1B")
    wordMap.set("inch", "1C, 1B")
    wordMap.set("same", "1C, 1B")



    return wordMap
}



app.get('/cowsandbulls', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')


    var pages = {
        'name'   : 'cowsandbulls',
        'groups' : [{'groupName': "Group1"}, {'groupName': "Group2"}, {'groupName': "Group3"}]
     };
    
    response.render('index', pages)
});

app.get('/cowsandbulls_game', (request, response) => {
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

app.post('/cowsandbulls_game', (request, response) => {

    playerWord = request.body.playerWord
    //console.log(playerWord)
    answer = "1C and 2B"
    result = "Result for the " + playerWord + " is : " + answer
    isNewGameAllowed = "false"
    isGameInProgress = "true"
    words = getCurrentGameWords('word')

    //TODO: 
    //Read words into sets of 4

    var pages = {
        'name'   : 'cowsandbulls_game',
        'wordAnswer' : result,
        'newGameAllowed' : isNewGameAllowed,
        'gameInProgress' : isGameInProgress,
        'words' : words
     };
    
    response.render('index', pages)
});


//Start or Take to existing Game in Progress for this Group
app.post('/grp_cowsandbulls_game', (request, response) => {

    playerName = request.body.playerName
    groupName = request.body.groupName

    /*

        Check if any game is in progress for this group.
        If it is get the groupId
        and join this user to that group

    */

    //console.log(playerName)
    //console.log(groupName)

    // let currGames = 

    let currGroupGame = new GroupGame(groupName, null, null)

    let playerWord = new PlayerWord(playerName, null, null)
    
    currGroupGame.addPlayerWord(playerWord)

    //Read this info from a valid place
    isNewGameAllowed = "false"

    //Read this info from a valid place
    isGameInProgress = "true"
    
    words = getCurrentGameWords('word')
    
    
    //TODO: 
    //Read words into sets of 4

    var pages = {
        'name'   : 'cowsandbulls_game',
        'newGameAllowed' : isNewGameAllowed,
        'gameInProgress' : isGameInProgress,
        'currGroupGame' : currGroupGame,
        'words' : words
     };
    
    response.render('index', pages)
});






app.get('/bookcricket', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600')

    var pages = {
        'name'   : 'bookcricket',
     };
    
    response.render('index', pages)
});


exports.app = functions.https.onRequest(app);

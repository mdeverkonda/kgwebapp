const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');

var hbs = require('express-hbs');

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



    var pages = {
        'name'   : 'cowsandbulls_game',
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

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 7000;
const homeRouter = require('./server/routers/homeRouter');
const checkbalanceRouter = require('./server/routers/checkbalanceRouter');
const billspaymentRouter = require('./server/routers/billspaymentRouter');
const depositRouter = require('./server/routers/depositRouter');
const eloadRouter = require('./server/routers/eloadRouter');
const fundtransferRouter = require('./server/routers/fundtransferRouter');
const transactionhistoryRouter = require('./server/routers/transactionhistoryRouter');
const withdrawRouter = require('./server/routers/withdrawRouter');
const logoutRouter = require('./server/routers/logoutRouter');
const SimpleJsonStore = require('simple-json-store');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');  
var getID = [];

const store = new SimpleJsonStore('./users.json', { users: [] });
console.log(getID);
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("bootstrap-4.0.0-dist"))
app.use(express.static('JScripts'));
app.use(express.static('css'));
app.use(express.static('vendor'));

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    req.titleModel = {
      title: 'Bangkokonat',
      getID: getID
    };
    next();
});


app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');
//express session middleware
app.use(session({
  secret: 'hello',
  resave : true
}));
//express messages  sets global variable messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
    
  }
}));


app.get('/', function(req, res) {
    let titleModel = req.titleModel;
    res.render('index.pug', titleModel);
  });

  
app.post('/', function(req, res) {
  let titleModel = req.titleModel;
  var users = store.get('users');
  var link ="";
  for(var i = 0; i < users.length; i++){
    if(req.body.accNumber == users[i].accNumber){
      if(req.body.passcode == users[i].passcode){
        getID = users[i].id;
        link = "home.pug";
        console.log(getID);
        
        res.render('home.pug', titleModel);
      } else {
       req.flash('danger','Login failed!');
       link = "/";
      }
    }else{
      // no account
     // req.flash('danger','Login failed!');
     // res.redirect('/');
     
    }
  }
  
});

app.use('/home', homeRouter);
app.use('/billsPayment', billspaymentRouter);
app.use('/checkBalance', checkbalanceRouter);
app.use('/deposit', depositRouter);
app.use('/eload', eloadRouter);
app.use('/fundTransfer', fundtransferRouter);
app.use('/transactionHistory', transactionhistoryRouter);
app.use('/withdraw', withdrawRouter);
app.use('/logout', logoutRouter);

app.listen(port, (err) => {
    if(err) { return console.error(err); }
    console.log(`Running on ${port}...`);
  });
  
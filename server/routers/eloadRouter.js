const express = require('express');
const router = express.Router(); //eslint-disable-line
const SimpleJsonStore = require('simple-json-store');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');  
const store = new SimpleJsonStore('./users.json', { users: [] });
const transaction = new SimpleJsonStore('./transactionHistory.json', { transactionHistory: [] });

var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: "hello",
  resave: true
}))
app.use(require('connect-flash')());
app.use(function(req, res, next){
   res.locals.messages = require('express-messages')(req, res);
   next();
});
app.use(expressValidator({
  errorFormatter: function(param, msg , value){
    var namespace = param.splice('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';

    }return {
      param: formParam,
      msg: msg,
      value:value
    };
  }
}));
router.get('/', (req, res) => {
  let titleModel = req.titleModel;
  var getID = titleModel.getID;
  console.log(getID);
  if(getID == "")
  {
    res.redirect('/');
  }
  else{
  res.render('eLoad.pug',titleModel);
}
});


router.use(methodOverride('_method'));
router.put('/:id', (req, res) => {
  let titleModel = req.titleModel;
  const trans = transaction.get('transactionHistory');
  const id = req.params.id;
  console.log(id);
  const contact = req.body.contact;
  const users = store.get('users');
  
  console.log(req.body.contact);
  console.log(req.body.load);


  var temp = users[id - 1].balance - Number(req.body.load);
    
    if(Math.sign(temp) == -1 )
    {
      console.log("Insufficient Balance!");
      res.redirect('/eload');
    }
    else
    {
      for(let i = 0; i < users.length; i++) {
        if(users[i].contact == contact) { //eslint-disable-line
          users[i].load = users[i].load + Number(req.body.load);
          store.set('users', users);
        }
        if(users[i].id == id) { //eslint-disable-line
            users[i].balance = users[i].balance - Number(req.body.load);
            trans.push({
              id: id,
              date: formatted,
              status: "E-Load",
              amount: Number(req.body.load),
              balance: users[i].balance
            });
            transaction.set('transactionHistory',trans);
            store.set('users', users);
            req.flash('success',"Loaded Successfully!");
            res.redirect('/eload');
        }
      else{
      }
    }
  }
});
module.exports = router;

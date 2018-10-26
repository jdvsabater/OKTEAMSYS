const express = require('express');
const app = express();
const router = express.Router(); //eslint-disable-line
const SimpleJsonStore = require('simple-json-store');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const expressValidator = require('express-validator')
const session = require('express-session');
const flash = require('connect-flash');
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
  }else{
    console.log(titleModel);
    res.render('withdraw.pug', titleModel);
  }
});

router.use(methodOverride('_method'));
router.put('/:id', (req, res) => {
  let titleModel = req.titleModel;
  const trans = transaction.get('transactionHistory'); 
  const id = req.params.id;
  const users = store.get('users');

  var temp = users[id - 1].balance - Number(req.body.deposit);
    
    if(Math.sign(temp) == -1 )
    {
      console.log("Insufficient Balance!");
      res.redirect('/withdraw');
    }
    else
    {
      for(let i = 0; i < users.length; i++) {
        if(users[i].id == id) {
        
            console.log(temp);
            users[i].balance -= Number(req.body.deposit);
            trans.push({
              id: id,
              date: formatted,
              status: "Withdraw",
              amount: Number(req.body.deposit),
              balance: users[i].balance
            });
            transaction.set('transactionHistory',trans);
            store.set('users', users);
            //return res.json(store.get('users'));
            req.flash('success',"Withdraw Successfully!");
            res.redirect('/withdraw');
          
        } else {
          console.log('cant find user');
        }
      }
    }
  
});


module.exports = router;
const express = require('express');
const app = express();
const router = express.Router(); //eslint-disable-line
const SimpleJsonStore = require('simple-json-store');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const store = new SimpleJsonStore('./users.json', { users: [] });
const storepayments = new SimpleJsonStore('./billspayment.json', { payments: [] });
const transaction = new SimpleJsonStore('./transactionHistory.json', { transactionHistory: [] });

const expressValidator = require('express-validator')
const session = require('express-session');
const flash = require('connect-flash');
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
  
    res.render('billsPayment.pug', titleModel);
  }
});

router.use(methodOverride('_method'));
router.put('/:id', (req, res) => {
      let titleModel = req.titleModel;
      const trans = transaction.get('transactionHistory');
      const id = req.params.id;
      console.log(id);
      const paymentType = req.body.paymentType;
      const users = store.get('users');
      let pay = '';
      if(id == 1)
      {
        pay = '1payments';
      }
      else if(id == 2)
      {
        pay = '2payments';
      }
      else if(id == 3)
      {
        pay = '3payments';
      }
      
      var idname = '';
      if(paymentType == 1)
      {
        idname = 'MERALCO';
      }
      else if(paymentType == 2)
      {
        idname = 'PLDT';
      }
      else if(paymentType == 3)
      {
        idname = 'MAYNILAD';
      }
      const payment = storepayments.get(pay);
      console.log(paymentType);
      
    var temp = users[id - 1].balance - Number(req.body.amount);
    
    if(Math.sign(temp) == -1 )
    {
      console.log("Insufficient Balance!");
      res.redirect('/billsPayment');
    }
    else
    {
      for(let i = 0; i < payment.length; i++) {
        
        if(payment[i].id == paymentType) { //eslint-disable-line
          payment[i].pay = payment[i].pay - Number(req.body.amount);
          storepayments.set(pay, payment);
        }
        if(users[i].id == id) { //eslint-disable-line
              users[i].balance  = users[i].balance - Number(req.body.amount);
              trans.push({
                id: id,
                date: formatted,
                status: "Bills Payment - "+idname,
                amount: Number(req.body.amount),
                balance: users[i].balance
              });
              transaction.set('transactionHistory',trans);
              store.set('users', users);
              
              req.flash('success',"Bill Payment Successfully!");
              res.redirect('/billsPayment');
        }
        
      else{
        }
      }
    }
});


module.exports = router;
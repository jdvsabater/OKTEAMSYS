const express = require('express');
const router = express.Router(); //eslint-disable-line
const SimpleJsonStore = require('simple-json-store');

// Initializes the data-2.json file with notes as its initial value if empty
const store = new SimpleJsonStore('./users', { users: [] });

router.get('/', function getIndexPage(req, res) {
  let titleModel = req.titleModel;
  var getID = titleModel.getID;
  console.log(getID);
  if(getID == "")
  {
    res.redirect('/');
  }
  else{
  let titleModel = req.titleModel;
 
  res.render('home.pug', titleModel);
  }
});



module.exports = router;

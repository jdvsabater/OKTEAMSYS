const express = require('express');
const router = express.Router(); //eslint-disable-line
const methodOverride = require('method-override');
const SimpleJsonStore = require('simple-json-store');

// Initializes the data-2.json file with notes as its initial value if empty
const store = new SimpleJsonStore('./users', { users: [] });

router.get('/', function getIndexPage(req, res) {
  let titleModel = req.titleModel;

  req.titleModel.getID = "";
  console.log(req.titleModel.getID);
    res.redirect('/');
  }
);

module.exports = router;

const express = require('express');
const github = require('octonode');
const router = express.Router();
const client = github.client();

// GET home page
router.get('/', function(req, res, next){

  console.log(process.env.CLIENT_ID);

  res.render('index', {
    title: 'Git Talent',
    gitClientId: process.env.CLIENT_ID
  });
  next();
});

router.get('/gitacces', function(req, res, next){
  res.render('score', {
    title: 'Git Talent'
  });
});

router.get('/home', function(req, res, next){
  res.render('index', {
    title: 'Git Talent',
    gitClientId: process.env.CLIENT_ID

  });
});

router.post('/', function(req, res, next){
  client.get('/users/' + req.body.gitusr, {}, function (err, status, body, headers) {
    if (err) {

      console.log(`Error: User ${req.body.gitusr} cannot be found.`)
      res.render("error", {
        title: `${req.body.gitusr} not found`,
        errMsg: `The username ${req.body.gitusr} does not exist.`,
        err: err
      });

    } else {

      console.log(body)
      res.render("user", {
        title: body.login + ' talent!',
        data: body
      });
    }

  });
});

module.exports = router;

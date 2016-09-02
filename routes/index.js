const express = require('express');
const github = require('octonode');
const router = express.Router();
const client = github.client();
const fetch = require('node-fetch');

// GET home page
router.get('/', function(req, res, next){
  res.render('index', {
    title: 'Git Talent',
    gitClientId: process.env.CLIENT_ID
  });
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

router.get('/about', function(req, res, next){
  res.render('about', {
    title: 'Git Talent About'
  });
});

router.post('/', function(req, res, next){

  fetch('https://api.github.com/users/avilano/starred').then(function(response){
    return response.json();
  }).then(function(response){
    console.log('These are the starred ones from avilano' + JSON.stringify(response, null, '  '));
  }).catch(function(err){
    console.log('err: ' + err)
  });

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

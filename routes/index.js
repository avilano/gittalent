const express = require('express');
const github = require('octonode');

const router = express.Router();
const client = github.client();

const gitUser = 'avilano';

// GET home page
router.get('/', function(req, res, next){
  res.render('index', {
    title: 'Git Talent'
  });
});

router.get('/gitacces', function(req, res, next){
  res.render('score', {
    title: 'Git Talent'
  });
});

//router.get('/gitusr=:username', function(req, res, next){

router.post('/', function(req, res, next){
client.get('/users/' + req.body.gitusr, {}, function (err, status, body, headers) {
  if (err) {return next(err);}
  console.log(body)
  res.send('<pre>' + JSON.stringify(body, null, '  '));
  });
});
  // res.render('score', {
  //   title: 'Git Talent'
  // });




module.exports = router;

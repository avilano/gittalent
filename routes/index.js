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

router.get('/', function(req, res) {
    console.log(req.body);
});

router.get('/gituser/:username', function(req, res, next){
  client.get('/users/' + req.params.username, {}, function (err, status, body, headers) {
    if (err) {return next(err);}
    console.log(body)
    res.send('<pre>' + JSON.stringify(body, null, '  '));
  });
});

router.post('/', function(req, res, next){
  client.get('/users/' + req.body.gitusr, {}, function (err, status, body, headers) {
    if (err) return next(err);

    console.log(body)

    res.render("user", {
      data: body

    });
  });
});

module.exports = router;

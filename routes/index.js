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

router.get('/gitacces', function(req, res, next){
  res.render('score', {
    title: 'Git Talent'
  });
});

module.exports = router;

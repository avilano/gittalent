const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const github = require('octonode');
const router = express.Router();
const client = github.client();
const fetch = require('node-fetch');

require('dotenv').config();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/gitacces"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

router.use(session({ secret: 'delta2', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
router.use(passport.initialize());
router.use(passport.session());

// GET home page
router.get('/', function(req, res, next){

  res.render('index', {
    title: 'Git Talent'
  });
});

router.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', {
    user: req.user.username
  });
});

router.get('/login', function(req, res){
  res.render('login', {
    user: req.user.username
  });

  console.log(`This is login - REQ.USER: ${req.user.username} //////////`);

});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

  // GET /auth/github/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function will be called,
  //   which, in this case, will redirect the user to the score page.


router.get('/gitacces',
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {

  //console.log(`This is gitacces - REQ.USER: ${req.user.username} //////////`);
  if (req.user.username){
    client.get('/users/' + req.user.username, {}, function (err, status, body, headers) {
      if (err) {

        res.render("error", {
          title: `${req.user.username} not found`,
          errMsg: `The username ${req.user.username} does not exist.`,
          err: err
        });

      } else {

        res.render("user", {
          title: req.user.username + ' talent!',
          data: body
        });
      }

    });

  }
  
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/home', function(req, res, next){
  res.redirect('/');
});

router.get('/about', function(req, res, next){
  res.render('about', {
    title: 'Git Talent About'
  });
});

router.post('/', function(req, res, next){

  // fetch('https://api.github.com/users/avilano/starred').then(function(response){
  //   return response.json();
  // }).then(function(response){
  //   console.log('These are the starred ones from avilano' + JSON.stringify(response, null, '  '));
  // }).catch(function(err){
  //   console.log('err: ' + err)
  // });

  client.get('/users/' + req.body.gitusr, {}, function (err, status, body, headers) {
    if (err) {

      res.render("error", {
        title: `${req.body.gitusr} not found`,
        errMsg: `The username ${req.body.gitusr} does not exist.`,
        err: err
      });

    } else {

      res.render("user", {
        title: body.login + ' talent!',
        data: body
      });
    }

  });
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = router;

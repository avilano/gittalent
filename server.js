#!/bin/env node
/*jshint esversion: 6 */
const app = require('./app');
const port = process.env.PORT || 3000;

// set port
app.listen(port, function() {
  console.log('app started on port 3000');
});

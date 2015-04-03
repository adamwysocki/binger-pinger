/*jslint node: true */
"use strict";

// *****************************************************************************
// BINGER PINGER SERVICE
// Author: Adam Wysocki
// Date: 3/12/15
//

//******************************************************************************
// LOAD REQUIRED PACKAGES
//
var express           = require('express'),
    schedule          = require('node-schedule'),
    _Runner           = require('./lib/runner'),
    mongoose          = require('mongoose');

//******************************************************************************
// CREATE THE APPLICATION
//
var app               = express(),
    env               = process.env.NODE_ENV || 'development';

//******************************************************************************
// Setup dev environment related items
//
if ( ('development' === env) || ('testing' === env) ){
  // configure stuff here
  app.set('mode', 'development');
} else {
  app.set('mode', 'production');
}

//******************************************************************************
// ERROR HANDLING
//
process.on('uncaughtException', function(err) {
  console.error('[Binger.pinger] uncaughtException: ', err);
});

//******************************************************************************
// DATABASE CONNECTION HANDLING
//

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('[Binger.pinger] Error connecting to the DB ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('[Binger.pinger] Mongoose default connection to DB disconnected');
});

// When the connection is reconnected
mongoose.connection.on('reconnected', function () {
  console.log('[Binger.pinger] Mongoose reconnected');
});

// When the connection is started
mongoose.connection.on('connecting', function() {
  console.log('[Binger.pinger] Connecting to DB ...');
});

// After the connection is established
mongoose.connection.on('connected', function() {
  console.log('[Binger.pinger] MongoDB connected');
});

// After the connection is opened
mongoose.connection.once('open', function() {
  console.log('[Binger.pinger] MongoDB connection opened');
});

//******************************************************************************
// CONNECT TO MONGODB on MONGOLAB and EXPORT mongoose
//

var options = { server: { socketOptions: { keepAlive: 1,
                          connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, 
                          connectTimeoutMS : 30000 } }
    };

var mongooseUri = 'mongodb://admin:admin@ds033469.mongolab.com:33469/binger';

mongoose.connect(mongooseUri, options);
exports.mongoose = mongoose;

//******************************************************************************
// EXIT
//
process.on('SIGINT', function () {
  console.log('[Binger.pinger] Stopping Binger Pinger Server');
  // close the database connection
  mongoose.connection.close(function() {
    process.exit(0);
  });
});


//******************************************************************************
// SETUP AND RUN THE FIRST JOB
//

// SETUP A NEW RULE
var rule1              = new schedule.RecurrenceRule();

// RUN EVERY MINUTE
rule1.minute          = new schedule.Range(0, 59, 1);


schedule.scheduleJob(rule1, function(){

  var Runner            = new _Runner();

  console.log('[Binger.pinger] Scan timestamp: ', new Date());

  Runner.run();

});

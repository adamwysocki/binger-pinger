/*jslint node: true */
"use strict";

// ****************************************************************************
// BINGER MODEL
//

// Load required packages
var mongoose = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = Schema.ObjectId;

// Define our Binger schema
var BingerSchema   = new mongoose.Schema({
  name: String,                 // name [editable]
  hostname: String,             // hostname [editable]
  address: String,              // address (resvolved by dns lookup)
  type: Number,                 // PING, HTTP, IMAP, etc [editable]
  status: Number,               // 0 - DOWN, 5 - ACTIVE, 10 - PAUSED [editable*]
  lastevent: Date,              // lastevent
  created: Date,                // date created
  user: ObjectId,               // user who created binger
  modified: Date,               // date last modified
  moduser: ObjectId,            // user who last modified binger
  responsetime: Number,         // last response time
  group: ObjectId,              // group binger belongs to [editable]
  interval: Number,             // polling internal 1 - 60 in minutes [editable]
  port: Number,                 // post [editable]
  method: Number,               // http/https method (get, post, etc) [editable]
  path: String,                  // url to test
  expectedstatus: Number,       // expected status from http [editable]
  expectedresult: String        // expected string in returned html [editable]
});

// Export the Mongoose model
module.exports = mongoose.model('Binger', BingerSchema);

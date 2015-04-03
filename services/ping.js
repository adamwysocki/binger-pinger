/*jslint node: true */
"use strict";

// ****************************************************************************
// PING
//

var _Promise  = require('promise'),
    moment    = require('moment'),
    pinger    = require('net-ping');

function Ping() {
  this.pingSession  = pinger.createSession();
  this.type         = 'ping';
}

Ping.prototype.ping = function(address) {

  var self = this;

  console.log('[Ping.ping] ', address);

    // return a Promise
  return new _Promise(function(resolve, reject) {

    // record the start
    var start = new Date();

    self.pingSession.pingHost(address, function (error) {

      // calculate the response time
      var end           = new Date(),
          responseTime  = moment(end).diff(moment(start));

      if (error) {
        if (error instanceof pinger.RequestTimedOutError) {
            console.log (address + ": Not alive");
            resolve({status: 0, responseTime: responseTime});
        } else {
            console.log (address + ": " + error.toString());
            reject({status: -1, error: error.toString()});
        }
      } else {
        resolve({status: 5, responseTime: responseTime});
      }

    }); // end pingHost

  }); // end return promise

}; // end ping


// export the object
module.exports = Ping;

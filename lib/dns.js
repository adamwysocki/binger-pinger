/*jslint node: true */
"use strict";

// ****************************************************************************
// DNS
//

var _Dns        = require('dns'),
    moment      = require('moment'),
    _Promise    = require('promise');

function DNS() {
  this.type = 'resolver';
}

DNS.prototype.resolve = function(hostname) {

  // return a Promise
  return new _Promise(function(resolve, reject) {

    var start = new Date();

    _Dns.lookup(hostname, function onLookup(err, address) {

      if(err) {
        console.log('[DNS.resolve] Error: ', err);
        reject(err);
        return;
      }

      var end           = new Date(),
          responseTime  = moment(end).diff(moment(start));

      if(err) {
        console.log('[DNS.resolve] Error: ', err);
        reject({success: false, error: err.toString()});
      }
      else {
        resolve({success: true, address: address, responseTime: responseTime});
      }
    });
  });
};

module.exports = DNS;

/*jslint node: true */
"use strict";

// ****************************************************************************
// PING
//

var _Promise        = require('promise'),
    moment          = require('moment'),
    _Request        = require('request');

function Http() {
  this.type = 'http';
}

Http.prototype.ping = function(address, port) {

  console.log('[Http.ping] ', address);

  return new _Promise(function(resolve, reject) {

    var start = new Date();

    var _hostName = 'http://' + address;

    if(port) {
      _hostName += ':' + port;
    }

    _Request(_hostName, function(err, response, body) {

      var end           = new Date(),
          responseTime  = moment(end).diff(moment(start));

      if (!err && response.statusCode === 200) {

        resolve({status: 5, responseTime: responseTime});

      } else {

        if(err) {
          reject({status: -1, error: err.toString()});
        }

        resolve({status: 0, responseTime: responseTime});
      }

    });


  }); // end promise
};


module.exports = Http;

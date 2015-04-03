/*jslint node: true */
"use strict";

// ****************************************************************************
// RUNNER
//

var Binger    = require('../models/binger'),
    _Dns      = require('../lib/dns'),
    _Ping     = require('../services/ping'),
    _Http     = require('../services/http');


function Runner() {
  this.Resolver = new _Dns();
  this.Ping     = new _Ping();
  this.Http     = new _Http();
}

Runner.prototype.run = function() {

    var self = this;

    // Use the Binger model to find all bingers
    Binger.find(function(err, bingers) {

      if( (err) || (!bingers) ) {
        console.log('[Runner.run] Error finding bingers: ', err);
        return;
      }

      // Loop through all of the bingers
      bingers.forEach(function(_binger) {

        // if the binger is paused, skip it
        if(_binger.status === 10) {
          console.log('[Runner.run] paused _binger: ',
                        _binger.name, _binger.address);
          return;
        }

        console.log('[Runner.run] About to resolve: ',
          _binger.hostname, _binger.address);


        // resolve the binger via the dns
        self.Resolver.resolve(_binger.hostname).then(function(dnsResult){

          var _ret = null;

          if( (dnsResult.success) && (dnsResult.address === null) ) {
            console.log('[Runner.run] Address is null for hostname: ',
              _binger.hostname);
            return;
          }

          console.log('[Runner.run] DNS response time: ',
            dnsResult.responseTime, 'ms');

          // ping based on bingers type
          switch(_binger.type) {
            case 1:
              _ret = self.Ping.ping(dnsResult.address);
              break;
            case 2:
              _ret = self.Http.ping(dnsResult.address, _binger.port);
              break;
            default:
              _ret = self.Ping.ping(dnsResult.address);
              break;
          }

          return _ret;

        }).then(function(pingResult) {

          // state change
          if(pingResult.status !== _binger.status) {
            console.log('[Runner.run] State change detected for ',
              _binger.name);
          }

          // response time
          console.log('[Runner.run] Ping response time: ',
            pingResult.responseTime, 'ms');

            _binger.responsetime = pingResult.responseTime;

            // Save the binger and check for errors
            _binger.save(function(err) {
              if (err) {
                console.log('[Runner.run] Error saving Binger: ', err);
                return;
              } else {
                console.log('[Runner.run] Binger saved');
              }
            });


        }).catch(function(err) {
          console.log('[Runner.run] A promise returned an error: ', err);
        });


        // #3 PROCESS ANY ERRORS

        // #4 NOTIFY THE MAIN SERVER(S)

      });

    });
};

module.exports = Runner;

var winston = require('winston');
var util    = require('util');

/**
 * A winston based profiler for express
 * @constructor
 */
function RequestProfiler() {

  /**
   * Tracks and profile all requests made to non static expressjs routes
   */
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'express.log' })
    ]
  });

  /**
   * An express middleware for profiling requests made to API
   * @returns {Function}
   */
  function profile() {
    return function(req, res, next) {
      req.profileInfo = util.format('%s %s', req.method, req.originalUrl);
      logger.profile(req.profileInfo);

      // Apply the detour to the express res.send function
      var sendFn = res.send;
      res.send = function() {
        sendFn.apply(res, arguments);
        logger.profile(req.profileInfo);
      };
      next();
    };
  }

  return {
    profile : profile
  };
}

module.exports = new RequestProfiler();

const winston = require('winston');
const config = require('config');

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: config.get('log.maxFileSize'),
      maxFiles: config.get('log.maxFiles'),
      colorize: false
    }),
    new winston.transports.Console({
      level: config.get('env.isDev') ? 'debug' : 'info',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: config.get('errors.exitOnError')
});

module.exports = logger;
module.exports.stream = {
  write: function(message) {
    logger.info(message);
  }
};

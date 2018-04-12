const winston = require('winston');
const config = require('config');
const getNamespace = require('continuation-local-storage').getNamespace;

winston.emitErrs = true;

const winstonLogger = new winston.Logger({
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

// Wrap Winston logger to print reqId in each log
const formatMessage = function(message) {
  const myRequest = getNamespace('my request');
  const requestId = myRequest && myRequest.get('reqId') ? myRequest.get('reqId') : '';
  return `${message} reqId: ${requestId}`;
};

const logger = {
  log: function(level, message) {
    winstonLogger.log(level, formatMessage(message));
  },
  error: function(message) {
    winstonLogger.error(formatMessage(message));
  },
  warn: function(message) {
    winstonLogger.warn(formatMessage(message));
  },
  verbose: function(message) {
    winstonLogger.verbose(formatMessage(message));
  },
  info: function(message) {
    winstonLogger.info(formatMessage(message));
  },
  debug: function(message) {
    winstonLogger.debug(formatMessage(message));
  },
  silly: function(message) {
    winstonLogger.silly(formatMessage(message));
  }
};
module.exports = logger;

module.exports.stream = {
  write: function(message) {
    logger.info(message);
  }
};

const winston = require('winston');

const debugMode = process.env.NODE_ENV === 'development';

const errorStackFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message,
    };
  }
  return info;
});

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.align(),
    winston.format.timestamp(),
    winston.format.splat(), // Allows the text to be formatted at log time
    winston.format.simple(), // Same as above
    errorStackFormat(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message} ${(info.payload && `\n${JSON.stringify(info.payload)}`) || ''} ${info.stack ? `\n${info.stack}` : ''}`),
  ),
  transports: [
    new winston.transports.Console({
      level: (debugMode ? 'debug' : 'info'),
    }),
  ],
});

module.exports = logger;

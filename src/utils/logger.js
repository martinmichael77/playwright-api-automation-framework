import winston from 'winston';
import config from '../../config/index.js';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  // Console transport
  new winston.transports.Console(),
  // Error file transport
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // All logs file transport
  new winston.transports.File({
    filename: 'logs/all.log',
  }),
];

const logger = winston.createLogger({
  level: config.logLevel || 'info',
  levels: logLevels,
  format,
  transports,
  defaultMeta: { service: 'api-automation' },
});

export default logger;

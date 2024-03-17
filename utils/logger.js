const winston = require('winston');

const formatMetadata = (metadata) => {
  if (metadata === null || metadata === undefined) {
    return '{}';
  }

  if (typeof metadata !== 'object') {
    return JSON.stringify({ value: metadata });
  }

  const formattedMetadata = {};

  for (const [key, value] of Object.entries(metadata)) {
    try {
      formattedMetadata[key] = typeof value === 'object' ? JSON.stringify(value, replaceCircularReferences()) : value;
    } catch (error) {
      formattedMetadata[key] = '[Error: Unable to stringify value]';
    }
  }

  return JSON.stringify(formattedMetadata);
};

const replaceCircularReferences = () => {
  const cache = new Set();

  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  };
};

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'ownsearch' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          const stringifiedMetadata = formatMetadata(metadata);
          return `${timestamp} [${level}] ${message} ${stringifiedMetadata}`;
        })
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/verbose.log', level: 'verbose' }),
  ],
});

module.exports = logger;
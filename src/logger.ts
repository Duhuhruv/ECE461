/*
File Name: 
  logger.ts

Function: 
  -The function of this file is to create logger that logs certain info and debug messages into a separate file
  -winston was used for ease of use when it comes to log verbosity. This uses LOG_LEVEL and LOG_FILE which need to be set up 
  in your .env.
  -LOG_LEVEL 0 is for silent (default), 1 is for info, 2 is for debug.
  -This functions also has flushlogs which needs to be used at the end of any async program paths. This will make sure all logs
  are printed before the program shuts down.
*/
import * as winston from 'winston';

// Get environment variables
const logFile = process.env.LOG_FILE || 'logs/app.log'; // Default log file location if not provided
const logLevel = process.env.LOG_LEVEL || '0'; // Default to '0' (silent)

// Convert log level number to string understood by Winston
let level: string | false = false;

switch (logLevel) {
  case '1':
    level = 'info'; // Only log info level messages
    break;
  case '2':
    level = 'debug'; // Log debug, warn, error, and info messages
    break;
  default:
    level = false; // Disable logging when level is 0
}

// Create the logger
const logger = winston.createLogger({
  transports: level === false ? [] : [ // No transports if log level is 0 (silent)
    new winston.transports.File({
      filename: logFile,
      level: level, // Set log level based on LOG_LEVEL (either 'info' or 'debug')
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
  ],
  silent: level === false, // Ensure no logs are processed in silent mode
});

// Function to close and flush logs on shutdown
export const flushLogs = async () => {
  await new Promise<void>((resolve) => {
    logger.end(() => {
      resolve();  // Ensure logs are fully written before resolving
    });
  });
};

export default logger;

const winston = require('winston');

const customFormat = winston.format.printf(info =>{
    return `${info.timestamp}:[${info.level.toUpperCase()}] ${info.message}`
})

const levels = {
    levels: {
        result: 0,
        debug: 1,
        error: 2
    },
    colors: {
        result: 'green',
        debug: 'blue',
        error: 'red'
    }
};

winston.addColors(levels.colors);

const logger = winston.createLogger({
    levels: levels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [

        new winston.transports.File({ filename: './logs/results.log', level: "result" }),
        new winston.transports.File({ filename: './logs/operations.log', level: "error"})
    ],
});

module.exports = logger
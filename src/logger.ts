import winston from 'winston';

const dateFormatSettings: Intl.DateTimeFormatOptions =
{
    month: 'short', day: 'numeric', hour: 'numeric',
    minute: 'numeric', second: 'numeric', hour12: false
};

const format = winston.format.combine(
    winston.format.align(),
    winston.format.timestamp(),
    winston.format.printf((info) =>
        `${formatTime(info.timestamp)} | ${info.level.toUpperCase()} -${info.message}`
    ));

function formatTime(timestamp: string) {
    let date = new Date(timestamp);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return date.toLocaleString("en-US", dateFormatSettings);
}

const log = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                format,
                winston.format.colorize({ all: true })
            ),
        }),
        new winston.transports.File({
            filename: `${process.env.EVENT_NAME || 'BCACTF'}.log`,
            format: format
        }),
    ],
});

export default log;
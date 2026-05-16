const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    PREFIX: process.env.PREFIX || '.',
    MODE: process.env.MODE || 'public',
    AUTOBIO: convertToBool(process.env.AUTOBIO, 'OFF'),
    ANTICALL: convertToBool(process.env.ANTICALL, 'OFF'),
    CHATBOT: convertToBool(process.env.CHATBOT, 'OFF'),
    ANTIBUG: convertToBool(process.env.ANTIBUG, 'OFF'),
    AUTOTYPE: convertToBool(process.env.AUTOTYPE, 'OFF'),
    AUTOREAD: convertToBool(process.env.AUTOREAD, 'OFF'),
    FONTSTYLE: process.env.FONTSTYLE || 'OFF',
    ANTIEDIT: process.env.ANTIEDIT || 'private',
    MENUSTYLE: process.env.MENUSTYLE || '2',
    AUTOREACT: convertToBool(process.env.AUTOREACT, 'OFF'),
    AUTOBLOCK: convertToBool(process.env.AUTOBLOCK, 'OFF'),
    AUTORECORD: process.env.AUTORECORD || 'all',
    ANTIDELETE: process.env.ANTIDELETE || 'private',
    ALWAYSONLINE: convertToBool(process.env.ALWAYSONLINE, 'ON'),
    AUTOVIEWSTATUS: convertToBool(process.env.AUTOVIEWSTATUS, 'ON'),
    AUTOREACTSTATUS: convertToBool(process.env.AUTOREACTSTATUS, 'OFF'),
    AUTORECORDTYPE: convertToBool(process.env.AUTORECORDTYPE, 'OFF'),
    STATUSANTIDELETE: convertToBool(process.env.STATUSANTIDELETE, 'ON'),
    BOTNAME: process.env.BOTNAME || 'RAVEN-MD',
    OWNERNAME: process.env.OWNERNAME || 'Not Set!',
    OWNERNUMBER: process.env.OWNERNUMBER || '254758301051',
    STATUSEMOJI: process.env.STATUSEMOJI || '🧡,💚,🔥,✨,❤️,🥰,😎',
    WATERMARK: process.env.WATERMARK || '©CypherX is on fire!🔥',
    AUTHOR: process.env.AUTHOR || 'X',
    PACKNAME: process.env.PACKNAME || 'RAVEN-MD',
    TIMEZONE: process.env.TIMEZONE || 'Africa/Nairobi',
    MENUIMAGE: process.env.MENUIMAGE || '',
    ANTICALLMSG: process.env.ANTICALLMSG || '',
    WARNLIMIT: process.env.WARNLIMIT || 5,
    GOODBYEMSG: process.env.GOODBYEMSG || '',
    WELCOMEMSG: process.env.WELCOMEMSG || '',
    ANTISTICKER: convertToBool(process.env.ANTISTICKER, 'OFF'),
    ANTISTICKERKICK: convertToBool(process.env.ANTISTICKERKICK, 'OFF'),
    ANTISTICKERWARN: convertToBool(process.env.ANTISTICKERWARN, 'OFF'),
};

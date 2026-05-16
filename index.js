const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const config = require('./config');
const qrcode = require('qrcode-terminal');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(`[RAVEN-MD] Bot is starting...`);
    console.log(`[RAVEN-MD] Using Baileys v${version.join('.')}${isLatest ? ' (latest)' : ''}`);

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: [config.BOTNAME, "Chrome", "1.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    // Anti-Call Feature
    sock.ev.on('call', async (call) => {
        if (config.ANTICALL) {
            for (const c of call) {
                if (c.status === 'offer') {
                    await sock.rejectCall(c.id, c.from);
                    if (config.ANTICALLMSG) {
                        await sock.sendMessage(c.from, { text: config.ANTICALLMSG });
                    } else {
                        await sock.sendMessage(c.from, { text: "*RAVEN-MD: Calls are not allowed. Your call has been rejected.*" });
                    }
                }
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('[RAVEN-MD] Scan the QR code below to connect:');
        }
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log(`[RAVEN-MD] Device Logged Out, Please Scan Again and Run.`);
                process.exit();
            } else {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('[RAVEN-MD] Connected Successfully!');
            const msg = `*RAVEN-MD Connected!*\n\n*Prefix:* ${config.PREFIX}\n*Mode:* ${config.MODE}\n*Owner:* ${config.OWNERNAME}`;
            sock.sendMessage(config.OWNERNUMBER + "@s.whatsapp.net", { text: msg });
        }
    });

    // Anti-Delete Feature
    sock.ev.on('messages.update', async (chatUpdate) => {
        for (const { key, update } of chatUpdate) {
            if (update.message === null && config.ANTIDELETE !== 'OFF') {
                console.log(`[ANTI-DELETE] Message deleted in ${key.remoteJid}`);
            }
        }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTOVIEWSTATUS) {
                await sock.readMessages([mek.key]);
                if (config.AUTOREACTSTATUS) {
                    const emojis = config.STATUSEMOJI.split(',');
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    await sock.sendMessage(mek.key.remoteJid, {
                        react: { text: randomEmoji, key: mek.key }
                    }, { statusJidList: [mek.key.participant] });
                }
            }
            
            const m = mek;
            const from = m.key.remoteJid;
            const type = Object.keys(m.message)[0];
            const body = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type === 'imageMessage') ? m.message.imageMessage.caption : (type === 'videoMessage') ? m.message.videoMessage.caption : '';
            const isCmd = body.startsWith(config.PREFIX);
            const command = isCmd ? body.slice(config.PREFIX.length).trim().split(' ')[0].toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);
            const isGroup = from.endsWith('@g.us');
            const sender = isGroup ? m.key.participant : m.key.remoteJid;
            const pushname = m.pushName || "No Name";
            const isOwner = config.OWNERNUMBER.includes(sender.split('@')[0]);

            // Feature Implementations
            if (config.AUTOREAD) await sock.readMessages([m.key]);
            if (config.AUTOTYPE) await sock.sendPresenceUpdate('composing', from);
            if (config.AUTORECORDTYPE) await sock.sendPresenceUpdate('recording', from);

            // Simple Command Handler
            if (isCmd) {
                console.log(`[COMMAND] ${command} from ${pushname}`);
                switch (command) {
                    case 'ping':
                        await sock.sendMessage(from, { text: 'Pong!' }, { quoted: m });
                        break;
                    case 'menu':
                        const menuText = `*RAVEN-MD MENU*\n\n*Prefix:* ${config.PREFIX}\n*Mode:* ${config.MODE}\n\n1. Ping\n2. Alive\n3. Owner`;
                        await sock.sendMessage(from, { text: menuText }, { quoted: m });
                        break;
                    case 'alive':
                        await sock.sendMessage(from, { text: `*RAVEN-MD is Alive!* 🚀\n\n*Owner:* ${config.OWNERNAME}\n*Bot Name:* ${config.BOTNAME}` }, { quoted: m });
                        break;
                    default:
                        break;
                }
            }

        } catch (err) {
            console.log(err);
        }
    });

    return sock;
}

connectToWhatsApp();

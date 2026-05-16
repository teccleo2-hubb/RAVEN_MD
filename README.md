# RAVEN-MD WhatsApp Bot 🚀

A powerful, feature-rich, and highly customizable WhatsApp bot built with the Baileys library. Optimized for deployment on Heroku, Pterodactyl panels, and VPS.

## ⚙️ Features
- **Prefix**: Customizable (Default: `.`)
- **Mode**: Public/Private
- **Auto Status View**: Automatically views status updates.
- **Anti-Call**: Automatically rejects incoming calls with a custom message.
- **Anti-Delete**: Prevents messages from being deleted.
- **Always Online**: Keeps the bot active 24/7.
- **Custom Branding**: Personalized bot name, watermark, and owner details.

## 🚀 Deployment

### 1. Deploy to Heroku
Click the button below to deploy RAVEN-MD directly to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/your-username/RAVEN-MD)

### 2. Deploy to Pterodactyl Panel
1. Upload the files to your panel.
2. Run `npm install`.
3. Set the startup command to `node index.js`.
4. Scan the QR code in the console.

### 3. Manual Installation
```bash
git clone https://github.com/your-username/RAVEN-MD.git
cd RAVEN-MD
npm install
node index.js
```

## 🛠️ Configuration
Edit `config.js` to customize your bot's settings:
- `BOTNAME`: Name of your bot.
- `OWNERNUMBER`: Your WhatsApp number.
- `PREFIX`: Command prefix.
- `MODE`: `public` or `private`.

---
Developed by **X** | ©CypherX is on fire!🔥

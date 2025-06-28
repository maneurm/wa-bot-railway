const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const fs = require('fs');
const winston = require('winston');

// Pastikan folder log ada
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

// Setup logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} - ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: './logs/bot.log' })
    ]
});

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});


client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log("✅ Bot siap! Menyiapkan jadwal pengingat...");
    logger.info("Bot siap dan terhubung ke WhatsApp.");

    const targetGroupName = "Penjaga Wahyu Allah";
    const chats = await client.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === targetGroupName);

    if (!group) {
        console.log(`❌ Grup "${targetGroupName}" tidak ditemukan.`);
        logger.info(`Grup "${targetGroupName}" tidak ditemukan.`);
        return;
    }

    const groupId = group.id._serialized;
    console.log(`✅ Grup ditemukan: ${targetGroupName}`);
    logger.info(`Grup ditemukan: ${targetGroupName}`);

    // Jadwal 09:00
    cron.schedule('0 9 * * *', () => {
        const msg = `🌞 *Dzikir Pagi & Sholat Dhuha*\n\nYuk dzikir pagi dan jangan lupa sholat dhuha ✨`;
        client.sendMessage(groupId, msg);
        logger.info("Pesan 09:00 dikirim.");
    });

    // Jadwal 15:30
    cron.schedule('30 15 * * *', () => {
        const msg = `🏃 *Dzikir Sore & Olahraga*\n\nJangan lupa dzikir sore dan gerakin badan yaa 💪`;
        client.sendMessage(groupId, msg);
        logger.info("Pesan 15:30 dikirim.");
    });

    // Jadwal 18:30
    cron.schedule('0 18 * * *', () => {
        const msg = `📖 *Murojaah Time!*\n\nWaktunya murojaah abis maghrib bareng Al-Qur'an 📚`;
        client.sendMessage(groupId, msg);
        logger.info("Pesan 18:30 dikirim.");
    });

    console.log("📆 Semua jadwal aktif.");
    logger.info("Semua jadwal aktif.");
});

client.initialize();

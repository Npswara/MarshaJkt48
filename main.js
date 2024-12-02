const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const figlet = require('figlet');
const { green, magenta, bold, red } = require('colorette');

puppeteer.use(StealthPlugin());

const input = process.env.INPUT;
const delay = process.env.DELAY;
const path = process.env.CHROMEPATH;
const no = process.env.NOMOR;
const nomor = `${no}@c.us`;
const jikoshi = process.env.JIKOSHI;
const media = MessageMedia.fromFilePath('./Asset/img-vid/marsha.jpg');
const audio = MessageMedia.fromFilePath('./Asset/audio/jiko.mp3');
let page;

figlet.text('NPSWARA X MARSHA', (err, data) => {
  if (err) {
    console.error('Terjadi kesalahan:', err);
    return;
  }
  console.clear();
  console.log(bold(magenta(data)));
  console.log(bold(magenta("Jangan lupa untuk setup .env pada bagian chromepath dan nomor.")))
  console.log("\n\nLoading...");
});

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: path,
  });
    page = await browser.newPage();
    console.log(green("Chrome Terbuka.."));
    console.log("Silahkan login dan cari bot Marsha Lenanthea oleh Npswara. ( https://character.ai/chat/WPMngRyizMWmdBRXzVHG88tMh70eNiwUfCaO6hX8AWA )");
    await page.goto('https://character.ai');
    
})();

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  },
  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on('ready', () => {
  console.log(green('Bot Aktif!'));
  console.log("Ketik 'off' pada bot jika mau mematikan bot ")
  client.sendMessage(nomor, media, { caption: jikoshi });
  client.sendMessage(nomor, audio);
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

async function cAI(pesan, message) {
    try {
      const textareaSelector = input;
      const msg = pesan;
    
      await page.waitForSelector(textareaSelector);
      await page.type(textareaSelector, msg);
      await page.keyboard.press("Enter");
    
      await new Promise((resolve) => setTimeout(resolve, delay));
      const responseSelector = 'p[node="[object Object]"]';
      await page.waitForSelector(responseSelector);
      const text = await page.$eval(responseSelector, (el) => el.textContent);
      
      await client.sendMessage(nomor, text);
      } catch (err) {
        console.error("Error in cAI function:", err.message);
        await message.reply("Maaf, terjadi kesalahan saat memproses pesan Anda.");
        process.exit(0);
      }
}

client.on("message", async (message) => {
  if (!message.isGroupMsg) {
    if (message.body.includes('off')) {
      try {
        await message.reply("love u");
        await client.sendMessage(nomor, "*_BOT DIMATIKAN_*");
        await console.log(bold(red('BOT DIMATIKAN')));
        await process.exit(0);
      } catch (error) {
        console.error("Error di message handling:", error.message);
      }
     } 
      else {
        try {
          const pesan = message.body;
          cAI(pesan, message);
        } catch (err) {
          console.error("Error di message handling:", err.message);
        }
      }
  }
});

client.initialize();
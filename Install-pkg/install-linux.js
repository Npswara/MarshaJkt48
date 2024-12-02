const { exec } = require('child_process');

console.log('⏳ Memulai instalasi dependensi untuk Linux...');

const perintah = [
  'sudo apt update',
  'sudo apt install -y nodejs npm',
  'npm install',
  'npm install puppeteer',
  'npm install puppeteer-extra puppeteer-extra-plugin-stealth',
  'npm install dotenv whatsapp-web.js qrcode-terminal colorette figlet'
];

exec(perintah.join(' && '), (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Gagal menginstal: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ Peringatan selama instalasi: ${stderr}`);
  }
  console.log(`✅ Instalasi selesai untuk Linux: ${stdout}`);
});

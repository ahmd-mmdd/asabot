const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const cmd = 's';
const args = '';
const category = 'Sticker';

async function message(sock, m) {
  const { chat: id, quoted, msg, nyarios } = m;
  const target = quoted || msg;
  const mime = (target.msg || target).mimetype || '';

  const isImage = /image\/(jpeg|png|jpg|webp)/.test(mime);
  if (!isImage) return nyarios('📸 Kirim atau balas gambar untuk dijadikan stiker');

  const mediaPath = await sock.downloadAndSaveMediaMessage(target);
  const outputPath = path.join(__dirname, '../../temp/', `${Date.now()}.webp`);

  const meta = await sharp(mediaPath).metadata();
  const { width, height } = meta;

  let image = sharp(mediaPath);
  if (width > 512 || height > 512) {
    image = image
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      });
  }

  await image.webp({ quality: 85 }).toFile(outputPath);
  await sock.sendMessage(id, { sticker: fs.readFileSync(outputPath) }, { quoted: m });

  fs.unlinkSync(mediaPath);
  fs.unlinkSync(outputPath);
}

module.exports = { cmd, args, category, message };

// const { default: axios } = require("axios");

// const cmd = `s`; 
// const args = ``;
// const category = `Sticker`;
// async function message(sock, m, store) {
//     const {sendMessage, config,resize,media2buffer, MyIP, func} = sock;
//     const {chat: id, body, arg, nyarios, isOwner} = m;
//     const {Prefix,banner,Nama_Bot,apikey,baseURL} = config;
//     const {isset,fs,exec} = func;

//     const quoted = m.quoted ? m.quoted : m || m.msg
//     const mime = (quoted.msg || quoted).mimetype || ''
//     const isMedia = /image|video|sticker|audio/.test(mime)

// 	if(!isMedia) return nyarios(`tidak ada media`)


//     const mek = m.quoted || m.msg;
//     const pem = await nyarios("Sedang Medownload dari Server WhatsApp");
//     const buffer = (await media2buffer(await sock.downloadAndSaveMediaMessage(mek))).toString(`base64`);
//     await sock.editMessage(pem, "Berhasil di download !!!");
//     await sock.editMessage(pem, "Mengirim ke *https://xiex.my.id/api/image/sticker* ...");
//     const {data} = await sock.sendRequest(m).post(`${baseURL}/api/image/sticker`,{apikey, base64: `${buffer}`,pack: isset(arg) ? arg : m.pushName},{ responseType: 'arraybuffer' });
//     const result = await Buffer.from(data, "utf-8");
//     await sock.editMessage(pem, `Sticker Berhasil Di Buat dengan Nama: *${isset(arg) ? arg : m.pushName}*`);
//     await sendMessage(id,{sticker: result},{quoted: m})

// }
// module.exports = {cmd,args,category,message};
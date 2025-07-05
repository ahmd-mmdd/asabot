const sharp = require('sharp');

const cmd = `toimage`;
const args = ``;
const category = `Converter`;

async function message(sock, m, store) {
    const { sendMessage, downloadAndSaveMediaMessage } = sock;
    const { chat: id, nyarios } = m;
    const { fs } = sock.func;

    const quoted = m.quoted || m.msg || m;
    const mime = quoted.mimetype || '';
    const isSticker = quoted?.stickerMessage || mime === 'image/webp';

    if (!isSticker) {
        return nyarios("❗ Balas stikernya dengan perintah *toimage*");
    }

    const mek = await nyarios("📥 Mengunduh stiker...");

    let filePath;
    try {
        filePath = await downloadAndSaveMediaMessage(quoted);
    } catch (err) {
        return sock.editMessage(mek, "❌ Gagal mengunduh stiker.");
    }

    const outputPath = filePath.replace(/\.webp$/, '.png');

    try {
        await sharp(filePath)
            .png()
            .toFile(outputPath);
    } catch (err) {
        return sock.editMessage(mek, "❌ Gagal mengonversi stiker ke gambar.");
    }

    const buffer = fs.readFileSync(outputPath);

    await sendMessage(id, {
        image: buffer,
        caption: "Stiker berhasil diubah ke gambar, jangan lupa follow @asatechnology_ yee, biar bisa update info bot"
    }, { quoted: m });

    await sock.editMessage(mek, "✅ Selesai!");
}

module.exports = { cmd, args, category, message };

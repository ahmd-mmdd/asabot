const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { createCanvas, registerFont } = require('canvas');
const emojiRegex = require('emoji-regex');

registerFont('./fonts/ArchivoNarrow-Regular.ttf', { family: 'ArchivoNarrow' });

const cmd = `brat`;
const args = `[text]`;
const category = `Sticker`;

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

function drawJustifiedLine(ctx, line, x, y, maxWidth, isLastLine = false) {
  const words = line.split(' ');
  if (words.length === 1 || isLastLine) {
    ctx.fillText(line, x, y);
    return;
  }

  const totalTextWidth = words.reduce((acc, word) => acc + ctx.measureText(word).width, 0);
  const spaceWidth = (maxWidth - totalTextWidth) / (words.length - 1);

  let cursorX = x;
  for (let i = 0; i < words.length; i++) {
    ctx.fillText(words[i], cursorX, y);
    if (i < words.length - 1) {
      cursorX += ctx.measureText(words[i]).width + spaceWidth;
    }
  }
}

async function message(sock, m) {
  const { sendMessage } = sock;
  const { chat: id, arg, nyarios } = m;

  if (!arg) return nyarios(`Tulis teksnya dong! Contoh: !brat aku brat banget`);
  if (arg.length > 300) return nyarios("Teks terlalu panjang, maksimal 300 karakter ya.");

  const regex = emojiRegex();
  if (regex.test(arg)) {
    return nyarios("⚠️ Saat ini kami tidak mendukung fitur emoji.\nSilakan kirim ulang teks Anda tanpa emoji.");
  }

  const canvasSize = 128;
  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  let fontSize = 30;
  let lines = [];
  let maxLineWidth = 0;
  do {
    ctx.font = `${fontSize}px ArchivoNarrow`; // tanpa bold
    lines = wrapText(ctx, arg, canvasSize - 8);
    maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    fontSize -= 1;
  } while ((lines.length * fontSize > canvasSize - 8 || maxLineWidth > canvasSize - 8) && fontSize > 6);

  const startY = 4;

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  lines.forEach((line, i) => {
    const isLast = i === lines.length - 1;
    drawJustifiedLine(ctx, line, 4, startY + i * fontSize, canvasSize - 8, isLast);
  });

  const imageBuffer = canvas.toBuffer();
  const sticker = new Sticker(imageBuffer, {
    pack: 'ASATECH BOT',
    author: '@asatechnology_',
    type: StickerTypes.FULL,
    quality: 100,
  });

  const stickerBuffer = await sticker.toBuffer();
  await sendMessage(id, { sticker: stickerBuffer }, { quoted: m });
}

module.exports = { cmd, args, category, message };

const cmd = "nonaktifkan";
const args = "<id_grup>";
const category = "Owner";

async function message(sock, m, store) {
  const { nonaktifkanGrup } = require('../system/grupPremium');
  const { chat, arg, nyarios, isOwner } = m;

  if (!isOwner) return nyarios("❌ Kamu bukan owner.");

  let idGrup = arg.trim();
  if (idGrup === 'sini') idGrup = chat;

  if (!idGrup.endsWith('@g.us')) {
    return nyarios(`❌ Format salah!\nContoh:\n.nonaktifkan 120xxxxx@g.us\n.nonaktifkan sini`);
  }

  const sukses = nonaktifkanGrup(idGrup);
  const teks = sukses
    ? `✅ Grup *${idGrup}* telah dinonaktifkan.`
    : `⚠️ Grup *${idGrup}* tidak ditemukan dalam daftar aktif.`;

  return nyarios(teks);
}

module.exports = { cmd, args, category, message };

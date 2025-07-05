const cmd = "listgrup";
const args = ``;
const category = "Owner";

async function message(sock, m, store) {
  const { getAllGrupAktif, sisaHari } = require('../system/grupPremium');
  const { nyarios, isOwner } = m;

  if (!isOwner) return nyarios("❌ Kamu bukan owner.");

  const daftar = getAllGrupAktif();
  if (daftar.length === 0) return nyarios('📭 Belum ada grup yang diaktifkan.');

  let teks = `📋 *Daftar Grup Premium Aktif:*\n\n`;
  for (const g of daftar) {
    teks += `🆔 ${g.id}\n`;
    teks += `⏳ Sisa: ${sisaHari(g.id)}\n`;
    teks += `📅 Exp: ${g.expired.split('T')[0]}\n`;
    teks += `👤 By: ${g.addedBy.replace(/@s\.whatsapp\.net/, '')}\n\n`;
  }

  return nyarios(teks.trim());
}

module.exports = { cmd, args, category, message };

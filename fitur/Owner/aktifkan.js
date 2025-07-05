const cmd = "aktifkan";
const args = "<id_grup> <durasi>";
const category = "Owner";

async function message(sock, m, store) {
  const { aktifkanGrup } = require('../system/grupPremium');
  const { chat, sender, arg, nyarios, isOwner } = m;

  if (!isOwner) return nyarios("❌ Kamu bukan owner.");

  let [idGrup, durasi] = arg.split(' ');
  const hari = parseInt(durasi?.replace('d', ''));

  if (idGrup === 'sini') idGrup = chat;

  if (!idGrup || isNaN(hari)) {
    return nyarios(`❌ Format salah!\nContoh:\n.aktifkan 120xxxxx@g.us 14d\n.aktifkan sini 7d`);
  }

  aktifkanGrup(idGrup, hari, sender);
  return nyarios(`✅ Grup *${idGrup}* telah diaktifkan selama *${hari} hari*.`);
}

module.exports = { cmd, args, category, message };

const fs = require('fs');
const path = './database/grupPremium.json';

let data = {};
if (fs.existsSync(path)) {
  data = JSON.parse(fs.readFileSync(path));
}

function save() {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function isGrupAktif(id) {
  if (!data[id]) return false;
  const now = new Date();
  const expired = new Date(data[id].expired);
  return now < expired;
}

function aktifkanGrup(id, durasiHari, addedBy) {
  const expired = new Date(Date.now() + durasiHari * 24 * 60 * 60 * 1000);
  data[id] = {
    expired: expired.toISOString(),
    addedBy
  };
  save();
}

function sisaHari(id) {
  if (!data[id]) return '❌ Tidak aktif';

  const now = new Date();
  const expired = new Date(data[id].expired);
  const selisihMs = expired - now;

  if (selisihMs <= 0) return '❌ Sudah kedaluwarsa';

  const totalMenit = Math.floor(selisihMs / (1000 * 60));
  const hari = Math.floor(totalMenit / (60 * 24));
  const jam = Math.floor((totalMenit % (60 * 24)) / 60);
  const menit = totalMenit % 60;

  let hasil = [];
  if (hari > 0) hasil.push(`${hari} hari`);
  if (jam > 0) hasil.push(`${jam} jam`);
  if (menit > 0) hasil.push(`${menit} menit`);

  return hasil.join(' ');
}

function getAllGrupAktif() {
  const now = new Date();
  return Object.entries(data).map(([id, info]) => {
    const expired = new Date(info.expired);
    const sisa = Math.max(0, Math.ceil((expired - now) / (1000 * 60 * 60 * 24)));
    return {
      id,
      expired: expired.toISOString(),
      sisaHari: sisa,
      addedBy: info.addedBy
    };
  });
}

function hapusGrupKadaluarsa() {
  const now = new Date();
  let berubah = false;

  for (const id in data) {
    const expired = new Date(data[id].expired);
    if (now >= expired) {
      delete data[id];
      berubah = true;
    }
  }

  if (berubah) save();
}

function nonaktifkanGrup(id) {
  if (data[id]) {
    delete data[id];
    save();
    return true;
  }
  return false;
}


module.exports = {
  isGrupAktif,
  aktifkanGrup,
  sisaHari,
  getAllGrupAktif,
  hapusGrupKadaluarsa,
  nonaktifkanGrup
};
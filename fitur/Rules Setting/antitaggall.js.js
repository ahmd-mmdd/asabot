const cmd = `antitagall`; 
const args = ``;
const category = `Rules Setting`;
async function message(sock, m, store) {
    const {sendMessage, config,resize,media2buffer, MyIP, func, grup} = sock;
    const {chat: id, body, nomor, arg, nyarios, isOwner} = m;
    const {Prefix,banner,Nama_Bot,apikey,baseURL} = config;
    const {isset,fs} = func

    if(!m.chat.endsWith("g.us")) return nyarios(`hanya bisa di gunakan di grup`);

    const parseMention = (text = '') => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    const mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
    const mentioned = [].concat(parseMention(body), (m.mentionedJid || []), (m.quoted ? [m.quoted.sender] : []))

    const {participants,subject} = await sock.groupMetadata(m.chat)
    
    const isAdmin = getGroupAdmins(participants).includes(m.sender);
    function getGroupAdmins (participants) {
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
     }

     if(!getGroupAdmins(participants).includes(sock.user.jid)) return;
    if(!isAdmin) return nyarios(`kamu bukan Admin`);
    const g = await grup(id);
    if(g.antitagall){
        await g.put("antitagall",0);
        nyarios("antitagall berhasil di matikan");
    }else{
        await g.put("antitagall",1);
        nyarios("antitagall berhasil di aktifkan");
    }


    
}
module.exports = {cmd,args,category,message};


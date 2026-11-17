/* Shaklee Diary - segerak awan (Firebase) */
(function(){
const CFG={apiKey:"AIzaSyBaY2CT5Och0rna6y0LuI2d0rPHHmCZ3JQ",authDomain:"shaklee-diary.firebaseapp.com",projectId:"shaklee-diary",storageBucket:"shaklee-diary.firebasestorage.app",messagingSenderId:"503510527090",appId:"1:503510527090:web:b886e17a9ec2542aa2a6eb"};
const V='10.12.2',KEY='sk_data',TK='sk_t',IN='sk_in';
const ls=window.localStorage,rawSet=Storage.prototype.setItem;
let auth,db,user=null,timer=null;
const say=t=>{try{toast(t)}catch(e){}};
const q=id=>document.getElementById(id);

/* ===== Skrin log masuk ===== */
const ov=document.createElement('div');
ov.style.cssText='position:fixed;inset:0;z-index:50;background:#fff0f6;display:'+(ls.getItem(IN)?'none':'flex')+';align-items:center;justify-content:center;padding:20px';
ov.innerHTML='<div class="card" style="width:100%;max-width:380px"><h3>💖 Log Masuk</h3><p class="small">Log masuk supaya data disimpan selamat dalam awan dan boleh dibuka di telefon lain.</p>'+
 '<label>Emel</label><input id="sy-e" type="email" autocomplete="email" autocapitalize="off">'+
 '<label>Kata laluan (minimum 6 aksara)</label><input id="sy-p" type="password" autocomplete="current-password">'+
 '<p id="sy-m" style="color:#c2185b;font-size:12px;font-weight:700;margin-top:8px"></p>'+
 '<div class="btns"><button class="btn" id="sy-in">Log Masuk</button><button class="btn b" id="sy-up">Daftar Baharu</button><button class="btn g s" id="sy-rs">Lupa kata laluan</button></div></div>';
document.body.appendChild(ov);

const ralat=c=>({'auth/invalid-email':'Emel tidak sah','auth/weak-password':'Kata laluan minimum 6 aksara','auth/email-already-in-use':'Emel ini sudah didaftar. Tekan Log Masuk.','auth/invalid-credential':'Emel atau kata laluan salah','auth/user-not-found':'Emel atau kata laluan salah','auth/wrong-password':'Emel atau kata laluan salah','auth/missing-password':'Isi kata laluan','auth/network-request-failed':'Tiada internet','auth/too-many-requests':'Terlalu banyak percubaan. Cuba sebentar lagi.'}[c]||('Ralat: '+c));

async function masuk(daftar){
 const m=q('sy-m');m.textContent='';
 if(!auth){m.textContent='Sedang memuatkan atau tiada internet. Cuba sebentar lagi.';return}
 const e=q('sy-e').value.trim(),p=q('sy-p').value;
 try{daftar?await auth.createUserWithEmailAndPassword(e,p):await auth.signInWithEmailAndPassword(e,p)}
 catch(x){m.textContent=ralat(x.code||String(x))}
}
q('sy-in').onclick=()=>masuk(false);
q('sy-up').onclick=()=>masuk(true);
q('sy-rs').onclick=async()=>{
 const m=q('sy-m'),e=q('sy-e').value.trim();
 if(!auth)return m.textContent='Sedang memuatkan atau tiada internet.';
 if(!e)return m.textContent='Isi emel dahulu, kemudian tekan Lupa kata laluan';
 try{await auth.sendPasswordResetEmail(e);m.style.color='#2e7d32';m.textContent='Pautan tetapan semula dihantar ke emel (semak juga folder spam)'}
 catch(x){m.style.color='#c2185b';m.textContent=ralat(x.code||String(x))}
};

/* ===== Segerak ===== */
async function push(){
 if(!user)return;
 let t=Number(ls.getItem(TK));
 if(!t){t=Date.now();rawSet.call(ls,TK,String(t))}
 await db.collection('users').doc(user.uid).set({data:ls.getItem(KEY)||'{}',t});
}
async function sync(){
 try{
  const s=await db.collection('users').doc(user.uid).get();
  const lt=Number(ls.getItem(TK))||0;
  if(s.exists&&s.data().t>lt){
   rawSet.call(ls,KEY,s.data().data);rawSet.call(ls,TK,String(s.data().t));
   location.reload();return;
  }
  if(!s.exists||lt>s.data().t)await push();
  say('Disegerak ☁️');
 }catch(e){say('Gagal segerak. Semak internet.')}
}
async function onAuth(u){
 user=u;
 if(!u){ls.removeItem(IN);ov.style.display='flex';return}
 rawSet.call(ls,IN,'1');ov.style.display='none';
 await sync();
}

/* Setiap kali app simpan data, hantar ke awan */
Storage.prototype.setItem=function(k,v){
 rawSet.call(this,k,v);
 if(this===ls&&k===KEY){
  rawSet.call(ls,TK,String(Date.now()));
  clearTimeout(timer);
  timer=setTimeout(()=>{push().catch(()=>say('Belum disegerak (tiada internet)'))},1000);
 }
};
window.addEventListener('online',()=>{if(user)sync()});

/* ===== Butang Log Keluar di halaman Lagi ===== */
const kad=document.querySelector('#pg-lagi .card');
if(kad){
 const d=document.createElement('div');d.className='card';
 d.innerHTML='<h3>☁️ Akaun</h3><p class="small">Data disegerak ke awan bila ada internet.</p><div class="btns"><button class="btn d">🚪 Log Keluar</button></div>';
 kad.parentNode.appendChild(d);
 d.querySelector('button').onclick=async()=>{
  if(!confirm('Log keluar? Data selamat dalam awan dan akan kembali bila log masuk semula.'))return;
  try{await push()}catch(e){
   if(!confirm('Perubahan terakhir belum sempat disegerak (tiada internet). Teruskan juga?'))return;
  }
  try{await auth.signOut()}catch(e){}
  ls.removeItem(KEY);ls.removeItem(TK);ls.removeItem(IN);
  location.reload();
 };
}

/* ===== Muat Firebase ===== */
const load=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
(async()=>{
 try{
  const b='https://www.gstatic.com/firebasejs/'+V+'/';
  await load(b+'firebase-app-compat.js');
  await load(b+'firebase-auth-compat.js');
  await load(b+'firebase-firestore-compat.js');
  firebase.initializeApp(CFG);
  auth=firebase.auth();db=firebase.firestore();
  auth.onAuthStateChanged(onAuth);
 }catch(e){
  if(!ls.getItem(IN)){q('sy-m').textContent='Tiada internet. Sambung internet dahulu untuk log masuk kali pertama.'}
 }
})();
})();

/* Yaxest hesap: e-posta + şifre ile giriş, ilerlemeyi bulutla eşitler. Firebase REST (SDK yok). Şifre yalnızca Google kimlik servisine gider. */
(function(){
'use strict';
var K='yx-acct',FB=window.YX_FB||{},ID='https://identitytoolkit.googleapis.com/v1/',ST='https://securetoken.googleapis.com/v1/token';
function conf(){return !!(FB.apiKey&&FB.projectId)}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
function st(){try{return JSON.parse(ls(K)||'null')}catch(e){return null}}
function setSt(o){ls(K,o?JSON.stringify(o):null);fire()}
function fire(){try{dispatchEvent(new CustomEvent('yx-acct'))}catch(e){}}
var ERR={EMAIL_EXISTS:'Bu e-posta ile zaten hesap var',INVALID_LOGIN_CREDENTIALS:'E-posta ya da şifre yanlış',INVALID_PASSWORD:'E-posta ya da şifre yanlış',EMAIL_NOT_FOUND:'E-posta ya da şifre yanlış',WEAK_PASSWORD:'Şifre en az 6 karakter olmalı',INVALID_EMAIL:'Geçerli bir e-posta yaz',TOO_MANY_ATTEMPTS_TRY_LATER:'Çok fazla deneme. Biraz sonra tekrar dene',USER_DISABLED:'Bu hesap devre dışı',MISSING_PASSWORD:'Şifreni yaz',NETWORK:'Bağlantı kurulamadı. İnterneti kontrol et'};
function mkErr(code){var c=String(code||'').split(' ')[0].split(':')[0];var e=new Error(c);e.msg=ERR[c]||(c==='NETWORK'?ERR.NETWORK:'Bir sorun oluştu. Tekrar dene');return e}
function post(url,body,hdr){return fetch(url,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},hdr||{}),body:JSON.stringify(body)}).catch(function(){throw mkErr('NETWORK')}).then(function(r){return r.json().then(function(j){if(!r.ok)throw mkErr(j&&j.error&&j.error.message);return j})})}
function save(j,email){var o={uid:j.localId,email:email||j.email,idToken:j.idToken,rt:j.refreshToken,exp:Date.now()+(+j.expiresIn||3600)*1000-60000,last:(st()||{}).last||0};setSt(o);return o}
function signUp(email,pw){if(!conf())return Promise.reject(mkErr('NOCONF'));return post(ID+'accounts:signUp?key='+FB.apiKey,{email:email,password:pw,returnSecureToken:true}).then(function(j){save(j,email);return push()})}
function signIn(email,pw){if(!conf())return Promise.reject(mkErr('NOCONF'));return post(ID+'accounts:signInWithPassword?key='+FB.apiKey,{email:email,password:pw,returnSecureToken:true}).then(function(j){save(j,email);return pull().then(function(n){return push().then(function(){return n})})})}
function reset(email){return post(ID+'accounts:sendOobCode?key='+FB.apiKey,{requestType:'PASSWORD_RESET',email:email})}
function signOut(){setSt(null);ls('yx-sync',null)}
function token(){var s=st();if(!s)return Promise.reject(mkErr('NOAUTH'));if(Date.now()<s.exp)return Promise.resolve(s);
  return fetch(ST+'?key='+FB.apiKey,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(s.rt)}).catch(function(){throw mkErr('NETWORK')}).then(function(r){return r.json().then(function(j){if(!r.ok){if(r.status===400){setSt(null)}throw mkErr('NOAUTH')}
    var o=Object.assign({},s,{idToken:j.id_token,rt:j.refresh_token||s.rt,exp:Date.now()+(+j.expires_in||3600)*1000-60000});setSt(o);return o})})}
function doc(s){return'https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents/users/'+s.uid}
function pull(){return token().then(function(s){return fetch(doc(s),{headers:{Authorization:'Bearer '+s.idToken}}).catch(function(){throw mkErr('NETWORK')}).then(function(r){
  if(r.status===404)return 0;return r.json().then(function(j){if(!r.ok)throw mkErr(j&&j.error&&j.error.status);var f=j.fields||{};var code=f.data&&f.data.stringValue;if(!code)return 0;
    return window.YXBackup.restore(code).then(function(res){return res.keys})})})})}
var lastH='';
function sig(){var o=window.YXBackup.snap();delete o['yx-acct'];delete o['yx-bkt'];delete o['yx-sync'];delete o['yx-bkr'];var k=Object.keys(o).sort(),s='';k.forEach(function(x){s+=x+'='+o[x]+'\n'});return window.YXBackup.hash(s)}
function push(keep){return token().then(function(s){return window.YXBackup.make().then(function(code){
  var body={fields:{data:{stringValue:code},updated:{integerValue:String(Date.now())}}};
  return fetch(doc(s)+'?updateMask.fieldPaths=data&updateMask.fieldPaths=updated',{method:'PATCH',keepalive:!!keep&&code.length<30000,headers:{'Content-Type':'application/json',Authorization:'Bearer '+s.idToken},body:JSON.stringify(body)}).catch(function(){throw mkErr('NETWORK')}).then(function(r){
    if(!r.ok)return r.json().then(function(j){throw mkErr(j&&j.error&&j.error.status)});lastH=sig();var o=st();if(o){o.last=Date.now();setSt(o)}return true})})})}
function del(pw){var s=st();if(!s)return Promise.reject(mkErr('NOAUTH'));
  return post(ID+'accounts:signInWithPassword?key='+FB.apiKey,{email:s.email,password:pw,returnSecureToken:true}).then(function(j){var o=save(j,s.email);
    return fetch(doc(o),{method:'DELETE',headers:{Authorization:'Bearer '+o.idToken}}).catch(function(){}).then(function(){return post(ID+'accounts:delete?key='+FB.apiKey,{idToken:o.idToken})}).then(function(){setSt(null)})})}
function sync(){return pull().then(function(n){return push().then(function(){return n})})}
/* arka plan: değişince (en çok 3 dakikada bir) ve sayfadan çıkarken gönder */
function bg(){if(!conf()||!st())return;
  var t=null;function sched(){if(t)return;t=setTimeout(function(){t=null;if(sig()!==lastH)push().catch(function(){})},30000)}
  addEventListener('yx-eco',sched);setInterval(function(){if(sig()!==lastH)push().catch(function(){})},180000);
  document.addEventListener('visibilitychange',function(){if(document.hidden&&sig()!==lastH)push(true).catch(function(){})});
  addEventListener('pagehide',function(){if(sig()!==lastH)push(true).catch(function(){})});
  setTimeout(function(){lastH=sig()},2000)}
var NK='https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents/nicks';
function nickKey(n){var m={'ı':'i','İ':'i','ğ':'g','Ğ':'g','ü':'u','Ü':'u','ş':'s','Ş':'s','ö':'o','Ö':'o','ç':'c','Ç':'c'};return String(n).replace(/[ıİğĞüÜşŞöÖçÇ]/g,function(c){return m[c]}).toLowerCase().replace(/_/g,'')}
var RES=['yaxest','yaxestgames','yaxestdiyari','admin','administrator','moderator','mod','gm','sistem','system','destek','support','yonetici','yetkili','yakup','yakupturhan','owner','sahip'];
var OWNER=['yakupt196@gmail.com'];
/* Takma adı bu hesaba kilitler. Başarı: {ok:true}. Hata: {ok:false,why:'taken'|'reserved'|'net'} */
function claimNick(nick){var k=nickKey(nick),s0=st();if(!s0)return Promise.resolve({ok:false,why:'net'});
  if(RES.indexOf(k)>=0&&OWNER.indexOf((s0.email||'').toLowerCase())<0)return Promise.resolve({ok:false,why:'reserved'});
  return token().then(function(s){var H={Authorization:'Bearer '+s.idToken,'Content-Type':'application/json'};
    return fetch(NK+'/'+encodeURIComponent(k),{headers:H}).then(function(r){
      if(r.status===200)return r.json().then(function(j){var u=j.fields&&j.fields.uid&&j.fields.uid.stringValue;return u===s.uid?{ok:true}:{ok:false,why:'taken'}});
      if(r.status===403)return{ok:true,soft:1};if(r.status!==404)return{ok:false,why:'net'};
      return fetch(NK+'?documentId='+encodeURIComponent(k),{method:'POST',headers:H,body:JSON.stringify({fields:{uid:{stringValue:s.uid},nick:{stringValue:nick},t:{integerValue:String(Date.now())}}})}).then(function(r2){
        if(r2.ok)return{ok:true};if(r2.status===409)return{ok:false,why:'taken'};if(r2.status===403)return{ok:true,soft:1};return{ok:false,why:'net'}})})}).catch(function(){return{ok:false,why:'net'}})}
function releaseNick(nick){return token().then(function(s){return fetch(NK+'/'+encodeURIComponent(nickKey(nick)),{method:'DELETE',headers:{Authorization:'Bearer '+s.idToken}}).then(function(){return 1})}).catch(function(){return 0})}

/* ---- hediye sistemi (Firestore: gifts) ---- */
var FS='https://firestore.googleapis.com/v1/projects/'+FB.projectId+'/databases/(default)/documents';
function fv(v){if(typeof v==='number')return{integerValue:String(Math.round(v))};if(typeof v==='boolean')return{booleanValue:v};if(v&&typeof v==='object'){var f={};Object.keys(v).forEach(function(k){f[k]=fv(v[k])});return{mapValue:{fields:f}}}return{stringValue:String(v)}}
function uv(x){if(!x)return null;if('stringValue' in x)return x.stringValue;if('integerValue' in x)return +x.integerValue;if('booleanValue' in x)return x.booleanValue;if(x.mapValue){var o={},f=x.mapValue.fields||{};Object.keys(f).forEach(function(k){o[k]=uv(f[k])});return o}return null}
function giftRow(d){var f=d.fields||{},o={id:d.name.split('/').pop()};Object.keys(f).forEach(function(k){o[k]=uv(f[k])});return o}
function gQuery(field,val){return token().then(function(s){return fetch(FS+':runQuery',{method:'POST',headers:{Authorization:'Bearer '+s.idToken,'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{from:[{collectionId:'gifts'}],where:{fieldFilter:{field:{fieldPath:field},op:'EQUAL',value:{stringValue:val}}},limit:50}})}).then(function(r){if(!r.ok)throw mkErr('GIFTQ');return r.json()}).then(function(j){return j.filter(function(x){return x.document}).map(function(x){return giftRow(x.document)})})})}
/* oyuncu: bana ve herkese gelen hediyeler */
function myGifts(){var s=st();if(!s)return Promise.resolve([]);return Promise.all([gQuery('uid',s.uid).catch(function(){return[]}),gQuery('uid','*').catch(function(){return[]})]).then(function(r){return r[0].concat(r[1])})}
function claimGift(g){return token().then(function(s){if(g.uid==='*')return true;return fetch(FS+'/gifts/'+g.id+'?updateMask.fieldPaths=claimed',{method:'PATCH',headers:{Authorization:'Bearer '+s.idToken,'Content-Type':'application/json'},body:JSON.stringify({fields:{claimed:{booleanValue:true}}})}).then(function(r){return r.ok})})}
/* yönetici: hediye gönder (kural: yalnızca yönetici e-postası) */
function sendGift(o){return token().then(function(s){var p=o.nick&&o.nick!=='*'?fetch(NK+'/'+encodeURIComponent(nickKey(o.nick)),{headers:{Authorization:'Bearer '+s.idToken}}).then(function(r){if(r.status===404)throw mkErr('NONICK');return r.json()}).then(function(j){return j.fields.uid.stringValue}):Promise.resolve('*');
  return p.then(function(uid){var body={fields:{uid:fv(uid),nick:fv(o.nick||'*'),items:fv(o.items),msg:fv(o.msg||'Yaxest\'ten hediye!'),claimed:fv(false),t:fv(Date.now())}};
    return fetch(FS+'/gifts',{method:'POST',headers:{Authorization:'Bearer '+s.idToken,'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw mkErr(r.status===403?'DENIED':'NETWORK');return r.json()})})})}
function listGifts(){return token().then(function(s){return fetch(FS+'/gifts?pageSize=40&orderBy=t%20desc',{headers:{Authorization:'Bearer '+s.idToken}}).then(function(r){if(!r.ok)throw mkErr(r.status===403?'DENIED':'NETWORK');return r.json()}).then(function(j){return(j.documents||[]).map(giftRow)})})}
function delGift(id){return token().then(function(s){return fetch(FS+'/gifts/'+id,{method:'DELETE',headers:{Authorization:'Bearer '+s.idToken}}).then(function(r){return r.ok})})}
window.YXAcct={myGifts:myGifts,claimGift:claimGift,sendGift:sendGift,listGifts:listGifts,delGift:delGift,claimNick:claimNick,releaseNick:releaseNick,nickKey:nickKey,conf:conf,state:st,signUp:signUp,signIn:signIn,signOut:signOut,reset:reset,pull:pull,push:push,sync:sync,del:del};
if(window.YXBackup)bg();else{var s=document.createElement('script');s.src=(document.currentScript&&document.currentScript.src||'').replace('account.js','backup.js');if(s.src){s.onload=bg;document.head.appendChild(s)}}
})();

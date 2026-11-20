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
window.YXAcct={conf:conf,state:st,signUp:signUp,signIn:signIn,signOut:signOut,reset:reset,pull:pull,push:push,sync:sync,del:del};
if(window.YXBackup)bg();else{var s=document.createElement('script');s.src=(document.currentScript&&document.currentScript.src||'').replace('account.js','backup.js');if(s.src){s.onload=bg;document.head.appendChild(s)}}
})();

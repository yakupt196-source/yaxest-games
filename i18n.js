/* Yaxest Games çok dilli destek. Kaynak dil Türkçe; çeviriler i18n-dict.js içinde.
   Sayfadaki metinler dile göre otomatik çevrilir (oyun kodlarına dokunmadan). Eksik çeviri Türkçe kalır. */
(function(){
var LANGS=['tr','en','de','es','fr','pt','ru','it'];
var NAMES={tr:'Türkçe',en:'English',de:'Deutsch',es:'Español',fr:'Français',pt:'Português',ru:'Русский',it:'Italiano'};
var D=window.YAXEST_DICT||{},P=[],missing={};
var lang=pick();
function pick(){try{var s=localStorage.getItem('yx-lang');if(s&&LANGS.indexOf(s)>=0)return s}catch(e){}
  var n=((navigator.language||'tr')+'').slice(0,2).toLowerCase();return LANGS.indexOf(n)>=0?n:'en'}
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
Object.keys(D).forEach(function(k){if(/\{\d\}/.test(k)){
  var re=new RegExp('^'+esc(k).replace(/\\\{(\d)\\\}/g,'(.+?)')+'$','s');P.push([re,D[k]])}});
var HAS=/[A-Za-zÇĞİÖŞÜçğıöşüА-Яа-я]/;
function tr(s){ // s: kırpılmış Türkçe kaynak
  if(lang==='tr')return null;var ix=LANGS.indexOf(lang)-1,e=D[s];
  if(e)return e[ix]||null;
  for(var i=0;i<P.length;i++){var m=P[i][0].exec(s);if(m){var t=P[i][1][ix];if(!t)return null;
    return t.replace(/\{(\d)\}/g,function(_,d){var g=m[+d+1]||'';return D[g]&&D[g][ix]?D[g][ix]:g})}}
  return null}
function T(s){var r=tr(String(s).trim());return r==null?s:r}
var tRec=new WeakMap(),eRec=new WeakMap(),aRec=new WeakMap();
var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,CANVAS:1,SELECT:1};
function textNode(n){var v=n.nodeValue;if(!v||!HAS.test(v))return;var r=tRec.get(n);if(r&&r.t===v)return;
  var m=/^(\s*)([\s\S]*?)(\s*)$/.exec(v),core=m[2],t=tr(core);
  if(t==null){if(lang!=='tr')missing[core]=1;tRec.set(n,{o:v,t:v});return}
  var nv=m[1]+t+m[3];tRec.set(n,{o:v,t:nv});n.nodeValue=nv}
var SIMPLE=/^(?:[^<]|<\/?(?:b|br|em|strong|i|small)\s*\/?>)*$/;
function elementLevel(el){var h=el.innerHTML;if(!h||!HAS.test(h)||!SIMPLE.test(h)||!/</.test(h))return false;
  var r=eRec.get(el);if(r&&r.t===h)return true;var t=tr(h.trim());
  if(t==null)return false;eRec.set(el,{o:h,t:t});el.innerHTML=t;return true}
var ATTR=['placeholder','aria-label','title','alt'];
function attrs(el){for(var i=0;i<ATTR.length;i++){var a=ATTR[i],v=el.getAttribute&&el.getAttribute(a);if(!v||!HAS.test(v))continue;
  var m=aRec.get(el)||{};if(m[a]&&m[a].t===v)continue;var t=tr(v.trim());
  if(t==null){if(lang!=='tr')missing[v]=1;continue}m[a]={o:v,t:t};aRec.set(el,m);el.setAttribute(a,t)}}
function scan(n){if(n.nodeType===3)return textNode(n);if(n.nodeType!==1||SKIP[n.tagName])return;
  attrs(n);if(n.firstElementChild&&elementLevel(n))return;
  for(var c=n.firstChild;c;c=c.nextSibling)scan(c)}
function restore(n){if(n.nodeType===3){var r=tRec.get(n);if(r&&n.nodeValue===r.t&&r.o!==r.t)n.nodeValue=r.o;tRec.delete(n);return}
  if(n.nodeType!==1)return;var e=eRec.get(n);if(e&&n.innerHTML===e.t){n.innerHTML=e.o}eRec.delete(n);
  var a=aRec.get(n);if(a){for(var k in a)if(n.getAttribute(k)===a[k].t)n.setAttribute(k,a[k].o);aRec.delete(n)}
  for(var c=n.firstChild;c;c=c.nextSibling)restore(c)}
function meta(){var d=document.querySelector('meta[name=description]');if(d){if(!d.__o)d.__o=d.getAttribute('content');var t=lang==='tr'?null:tr(d.__o);d.setAttribute('content',t||d.__o)}
  document.documentElement.lang=lang}
var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];
  if(m.type==='characterData')textNode(m.target);
  else if(m.type==='attributes'){attrs(m.target)}
  else{var t=m.target;if(t.nodeType===1&&t.firstElementChild&&elementLevel(t))continue;
    for(var j=0;j<m.addedNodes.length;j++)scan(m.addedNodes[j])}}});
function start(){scan(document.documentElement);meta();
  mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR})}
function set(l){if(LANGS.indexOf(l)<0||l===lang)return;mo.disconnect();restore(document.documentElement);lang=l;
  try{localStorage.setItem('yx-lang',l)}catch(e){}start();sync();try{window.dispatchEvent(new Event('ylang'))}catch(e){}}
var sels=[];
function select(){var s=document.createElement('select');s.className='ylang';s.setAttribute('aria-label','Language');s.title='Language';
  s.innerHTML=LANGS.map(function(l){return'<option value="'+l+'">'+NAMES[l]+'</option>'}).join('');
  s.value=lang;s.onchange=function(){set(s.value)};sels.push(s);return s}
function sync(){sels.forEach(function(s){s.value=lang})}
window.YI18N={langs:LANGS,names:NAMES,get lang(){return lang},set:set,t:T,select:select,missing:missing};
window.YT=T;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

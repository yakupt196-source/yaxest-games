const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const svg=fs.readFileSync('icon.svg','utf8');const b=await chromium.launch();
async function out(size,name,pad){const p=await b.newPage({viewport:{width:size,height:size}});
const inner=Math.round(size*(1-pad*2));
await p.setContent(`<body style="margin:0;background:#14102b;display:grid;place-items:center;width:${size}px;height:${size}px"><div style="width:${inner}px;height:${inner}px">${svg.replace('<svg','<svg width="100%" height="100%"')}</div></body>`);
await p.screenshot({path:'icons/'+name});await p.close()}
await out(512,'icon-512.png',0);await out(192,'icon-192.png',0);
await out(512,'maskable-512.png',0.1);await out(192,'maskable-192.png',0.1);await out(180,'apple-touch-icon.png',0);
await b.close()})();

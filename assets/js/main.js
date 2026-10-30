(function(){
'use strict';
document.documentElement.classList.add('js');
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var clamp=function(v,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,v))};
var lerp=function(a,b,t){return a+(b-a)*t};
var sstep=function(a,b,x){var t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var PAPER='#f5f6f4',INK='#0b0e0d',MINT='#6dd3a0';
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---------- Pixel wordmark (P A R A I Q on a 5x7 grid) ---------- */
var GLY={
 P:['####.','#...#','#...#','####.','#....','#....','#....'],
 A:['.###.','#...#','#...#','#####','#...#','#...#','#...#'],
 R:['####.','#...#','#...#','####.','#.#..','#..#.','#...#'],
 I:['#####','..#..','..#..','..#..','..#..','..#..','#####'],
 Q:['.###.','#...#','#...#','#...#','#.#.#','#..#.','.##.#']
};
function drawWord(cv,cell,on,off,frac){
  var w='PARAIQ',cells=[],ox=0,i,y,x;
  for(i=0;i<w.length;i++){var g=GLY[w[i]];for(y=0;y<7;y++)for(x=0;x<5;x++)if(g[y][x]==='#')cells.push([ox+x,y]);ox+=6}
  var cols=ox-1;cv.width=cols*cell;cv.height=7*cell;
  var c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);
  cells.forEach(function(p){var lit=frac==null||p[0]/cols<=frac;c.fillStyle=lit?on:off;c.fillRect(p[0]*cell+1,p[1]*cell+1,cell-2,cell-2)});
}

/* ---------- Orin ---------- */
var EYES={attentive:[[39,36,2.2,4.6,-28],[60,32,2.2,4.6,-28]],curious:[[40,44,3.2,3.2,0],[59,44,3.2,3.2,0]],sleepy:[[38,50,5.2,1.8,18],[60,46,5.2,1.8,18]],happy:[[37,46,6,3.2,0],[60,46,6,3.2,0]],calm:[[37,46,6,2.6,0],[61,46,6,2.6,0]],sly:[[37,49,6,2.6,-12],[60,46,5,2.2,-18]],blink:[[38,46,3.4,1,0],[60,46,3.4,1,0]]};
function orin(mood,fill,eye){
  var e=EYES[mood].map(function(a){return '<ellipse cx="'+a[0]+'" cy="'+a[1]+'" rx="'+a[2]+'" ry="'+a[3]+'" transform="rotate('+a[4]+' '+a[0]+' '+a[1]+')" fill="'+eye+'"/>'}).join('');
  return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M52 8C78 4 96 22 94 50C92 78 70 94 46 92C22 90 6 72 8 46C10 22 28 10 52 8Z" fill="'+fill+'"/><g class="eyes" style="transition:transform .12s ease-out">'+e+'</g></svg>';
}
$('#sideOrin').innerHTML=orin('attentive','#f4f6f5','#0b0e0d');
$('#disc').innerHTML=orin('happy','#0b0e0d','#ffffff');
(function(){var fills=['#f4f6f5','#b4bab7','#6b726f','#303634'],moods=['attentive','curious','calm','sleepy'];
  $$('.ostep .o').forEach(function(el,i){el.outerHTML=orin(moods[i],fills[i],'#0b0e0d')})})();

/* ---------- App window art (six panels, 3 x 2) ---------- */
var AW=1200,AH=800,BS=25;
var art=document.createElement('canvas');art.width=AW;art.height=AH;
var frameCv=document.createElement('canvas');frameCv.width=AW;frameCv.height=AH;
var FD='"Bricolage Grotesque","Geist",ui-sans-serif,system-ui,sans-serif',FB='"Geist",ui-sans-serif,system-ui,sans-serif',FM='"Geist Mono",ui-monospace,Menlo,monospace',FP='"Pixelify Sans",ui-monospace,monospace';
var C_BG='#111514',C_LINE='#2a302e',C_TXT='#f4f6f5',C_MUT='#8d9591',C_AMB='#e3b341',C_ROW='#222826';
var ORIN_P=window.Path2D?new Path2D('M52 8C78 4 96 22 94 50C92 78 70 94 46 92C22 90 6 72 8 46C10 22 28 10 52 8Z'):null;
function tx(c,s,x,y,font,col,al){c.font=font;c.fillStyle=col;c.textAlign=al||'left';c.fillText(s,x,y)}
function chipC(c,s,xr,yc,col){
  c.font='500 16px '+FM;var w=Math.ceil(c.measureText(s).width)+20,x0=xr-w;
  c.strokeStyle=col;c.lineWidth=1.5;c.strokeRect(x0+.75,yc-13.25,w-1.5,26.5);
  tx(c,s,x0+10,yc+5,'500 16px '+FM,col);
}
function rowLine(c,x,y,w){c.fillStyle=C_ROW;c.fillRect(x,y,w,1)}
function head(c,i,title,sub){
  var ox=(i%3)*400,oy=(i/3|0)*400,y0=oy+(i<3?36:0);
  tx(c,String(i+1).padStart(2,'0'),ox+28,y0+48,'500 15px '+FM,MINT);
  tx(c,title,ox+60,y0+52,'700 32px '+FD,C_TXT);
  tx(c,sub,ox+28,y0+80,'400 16px '+FM,C_MUT);
  return {x:ox+28,y:y0+104};
}
function buildArt(){
  var c=art.getContext('2d'),i,k,h;
  c.clearRect(0,0,AW,AH);c.fillStyle=C_BG;c.fillRect(0,0,AW,AH);
  c.textBaseline='alphabetic';
  /* window chrome */
  c.fillStyle='#171c1a';c.fillRect(0,0,AW,36);
  [22,40,58].forEach(function(x){c.fillStyle='#353c39';c.beginPath();c.arc(x,18,5,0,6.2832);c.fill()});
  tx(c,'PARAIQ',80,24,'500 17px '+FP,C_MUT);
  c.fillStyle='#0d100f';c.fillRect(470,7,300,22);tx(c,'http://office-pc:8000',482,23,'400 14px '+FM,C_MUT);
  tx(c,'SAMPLE DATA',1176,23,'400 14px '+FM,C_MUT,'right');
  /* 01 Upload */
  h=head(c,0,'Upload','Word · Excel · PDF · images');
  c.setLineDash([8,6]);c.strokeStyle='#3a4240';c.lineWidth=2;c.strokeRect(h.x,h.y,344,84);c.setLineDash([]);
  c.strokeStyle=MINT;c.lineWidth=3;c.lineCap='square';c.beginPath();c.moveTo(h.x+172,h.y+48);c.lineTo(h.x+172,h.y+18);c.moveTo(h.x+161,h.y+28);c.lineTo(h.x+172,h.y+17);c.lineTo(h.x+183,h.y+28);c.stroke();
  tx(c,'Drop client files',h.x+172,h.y+72,'500 18px '+FB,C_MUT,'center');
  [['PDF','Fact find'],['PDF','Tax return'],['XLS','Super statement']].forEach(function(f,n){
    var y=h.y+110+n*44;rowLine(c,h.x,y,344);
    c.strokeStyle='#3a4240';c.lineWidth=1.5;c.strokeRect(h.x+.75,y+10.75,38,22);
    tx(c,f[0],h.x+19.75,y+27,'500 13px '+FM,C_MUT,'center');
    tx(c,f[1],h.x+54,y+28,'500 20px '+FB,C_TXT);
    c.strokeStyle=MINT;c.lineWidth=3;c.beginPath();c.moveTo(h.x+318,y+22);c.lineTo(h.x+325,y+29);c.lineTo(h.x+338,y+14);c.stroke();
  });
  /* 02 Prepare */
  h=head(c,1,'Prepare','Made ready to read');
  [['Fact find',1],['Tax return',1],['Super statement',1],['Insurance schedule',.62]].forEach(function(f,n){
    var y=h.y+n*58;rowLine(c,h.x,y,344);
    tx(c,f[0],h.x,y+30,'500 19px '+FB,C_TXT);
    tx(c,f[1]>=1?'Ready':'Reading',h.x+344,y+30,'500 15px '+FM,f[1]>=1?MINT:C_MUT,'right');
    c.fillStyle=C_ROW;c.fillRect(h.x,y+40,344,8);c.fillStyle=MINT;c.fillRect(h.x,y+40,344*f[1],8);
  });
  /* 03 Understand */
  h=head(c,2,'Understand','Client picture, source-linked');
  [['Dependants','Two children','Fact find · p.2'],['Income','A$90,000','Fact find · p.3'],['Income','A$96,000','Tax return · p.1']].forEach(function(f,n){
    var y=h.y+n*84;rowLine(c,h.x,y,344);
    tx(c,f[0].toUpperCase(),h.x,y+26,'400 14px '+FM,C_MUT);
    tx(c,f[1],h.x,y+62,'600 28px '+FD,C_TXT);
    chipC(c,f[2],h.x+344,y+44,MINT);
  });
  /* 04 Review */
  h=head(c,3,'Review','Gaps and conflicts');
  c.fillStyle=C_AMB;c.fillRect(h.x,h.y,4,92);
  tx(c,'INCOME · CONFLICT SHOWN',h.x+18,h.y+22,'500 14px '+FM,C_AMB);
  tx(c,'A$90,000 vs A$96,000',h.x+18,h.y+58,'600 27px '+FD,C_TXT);
  tx(c,'Fact find p.3 · Tax return p.1',h.x+18,h.y+82,'400 14px '+FM,C_MUT);
  c.setLineDash([6,5]);c.strokeStyle='#3a4240';c.lineWidth=1.5;c.strokeRect(h.x,h.y+112,344,76);c.setLineDash([]);
  tx(c,'Insurance schedule missing',h.x+16,h.y+144,'500 20px '+FB,C_TXT);
  tx(c,'Query drafted for the client',h.x+16,h.y+170,'400 15px '+FM,MINT);
  c.strokeStyle=MINT;c.lineWidth=3;c.beginPath();c.moveTo(h.x+2,h.y+226);c.lineTo(h.x+9,h.y+233);c.lineTo(h.x+22,h.y+218);c.stroke();
  tx(c,'Super balance · A$142,300',h.x+36,h.y+232,'500 18px '+FB,C_MUT);
  /* 05 Statement of Advice */
  h=head(c,4,'SoA draft','With its issues list');
  c.fillStyle='#161b19';c.fillRect(h.x,h.y,344,268);c.strokeStyle=C_LINE;c.lineWidth=1.5;c.strokeRect(h.x+.75,h.y+.75,342.5,266.5);
  tx(c,'Statement of Advice',h.x+16,h.y+34,'600 20px '+FD,C_TXT);
  var ys=h.y+52;
  [[0,.34],[1,.92],[1,.84],[1,.88],[1,.5],[0,.4],[1,.9],[1,.8],[1,.86]].forEach(function(l,n){
    if(l[0]===0&&n>0)ys+=8;
    c.fillStyle=l[0]===0?MINT:'#2f3633';c.fillRect(h.x+16,ys,312*l[1],l[0]===0?7:6);ys+=l[0]===0?18:16;
  });
  chipC(c,'Issues list',h.x+328,h.y+240,C_AMB);
  /* 06 Ask Orin */
  h=head(c,5,'Ask Orin','In-app assistant');
  c.fillStyle='#1f2422';c.fillRect(h.x+84,h.y,260,46);tx(c,'Why do the incomes differ?',h.x+98,h.y+30,'500 17px '+FB,C_TXT);
  c.save();c.translate(h.x,h.y+66);c.scale(.4,.4);c.fillStyle=C_TXT;if(ORIN_P)c.fill(ORIN_P);else c.fillRect(8,8,84,84);
  c.fillStyle='#0b0e0d';[[37,46],[61,46]].forEach(function(e){c.beginPath();c.ellipse(e[0],e[1],6,2.8,0,0,6.2832);c.fill()});c.restore();
  c.fillStyle='#161b19';c.fillRect(h.x+50,h.y+66,294,104);c.strokeStyle=C_LINE;c.lineWidth=1.5;c.strokeRect(h.x+50.75,h.y+66.75,292.5,102.5);
  tx(c,'Fact find says A$90,000.',h.x+64,h.y+96,'500 17px '+FB,C_TXT);
  tx(c,'Tax return says A$96,000.',h.x+64,h.y+122,'500 17px '+FB,C_TXT);
  tx(c,'See p.3 and p.1.',h.x+64,h.y+150,'400 15px '+FM,MINT);
  c.strokeStyle=C_LINE;c.lineWidth=1.5;c.strokeRect(h.x+.75,h.y+198.75,342.5,36.5);
  tx(c,'Ask about this case…',h.x+14,h.y+222,'400 16px '+FB,C_MUT);
  c.fillStyle=MINT;c.fillRect(h.x+316,h.y+208,16,16);
  /* panel borders */
  c.strokeStyle=C_LINE;c.lineWidth=2;
  for(i=0;i<6;i++){c.strokeRect((i%3)*400+1,(i/3|0)*400+1,398,398)}
  c.strokeRect(1,1,AW-2,AH-2);
}
buildArt();

/* ---------- Tiles ---------- */
var card3d=$('#card3d'),tilesEl=$('#tiles'),shadowEl=$('#shadow');
var tiles=[],trail=[],needsRender=true;
for(var ti=0;ti<6;ti++){
  var d=document.createElement('div');d.className='tile';
  d.style.left=((ti%3)*33.3333)+'%';d.style.top=((ti/3|0)*50)+'%';
  var cv=document.createElement('canvas');cv.width=400;cv.height=400;
  var ic=document.createElement('i'),du=document.createElement('u');d.appendChild(cv);d.appendChild(ic);d.appendChild(du);card3d.appendChild(d);
  tiles.push({el:d,cv:cv,ctx:cv.getContext('2d'),col:ti%3,row:ti/3|0});
}
function renderTiles(now){
  var fc=frameCv.getContext('2d');fc.clearRect(0,0,AW,AH);fc.drawImage(art,0,0);
  trail=trail.filter(function(g){return now-g.t<1100});
  trail.forEach(function(g){
    var a=1-(now-g.t)/1100;
    fc.save();fc.shadowColor=MINT;fc.shadowBlur=18;
    fc.fillStyle='rgba(200,255,228,'+(a*.95).toFixed(3)+')';fc.fillRect(g.x*BS+1,g.y*BS+1,BS-2,BS-2);
    fc.fillStyle='rgba(109,211,160,'+(a*.45).toFixed(3)+')';fc.fillRect((g.x+1)*BS+1,g.y*BS+1,BS-2,BS-2);fc.fillRect((g.x-1)*BS+1,g.y*BS+1,BS-2,BS-2);
    fc.restore();
  });
  tiles.forEach(function(t){t.ctx.drawImage(frameCv,t.col*400,t.row*400,400,400,0,0,400,400)});
}

/* ---------- Keyframes: absolute tile centres (vw, vh, deg) from the card centre ---------- */
var K=[null,
 [[-31,-18,-14],[-28,22,8],[-20,-40,-5],[30,-20,12],[26,24,-10],[18,42,6]],
 [[-29,20,10],[-33,-16,-8],[22,-38,14],[29,12,-12],[33,-22,6],[-18,41,-9]],
 [[-32,-4,-16],[-22,32,12],[-17,-41,10],[31,22,8],[24,-30,-14],[20,40,-6]],
 [[-30,-24,6],[-27,26,-12],[-21,-40,14],[28,-18,-8],[31,28,12],[17,41,-10]]];
var TK=[.17,.31,.51,.71,.91];

var W=innerWidth,H=innerHeight,isMobile=W<900;
var wipe=$('#wipe'),wctx=wipe.getContext('2d'),wlast='',wrr=[];
(function(){var r=rng(5);for(var i=0;i<140;i++)wrr.push(r())})();
function drawWipe(t){
  var key=Math.round(t*240)+':'+W+':'+H;if(key===wlast)return;wlast=key;
  wctx.clearRect(0,0,wipe.width,wipe.height);if(t<=0)return;
  var bs=Math.max(18,Math.round(W/56)),cols=Math.ceil(W/bs);
  wctx.fillStyle=PAPER;
  for(var c=0;c<cols;c++){
    var y=H*(1-t)+(wrr[c%wrr.length]-.5)*bs*9*Math.sin(Math.PI*t);
    y=Math.floor(y/bs)*bs;if(t>=.999)y=0;if(y<H)wctx.fillRect(c*bs,y,bs+1,H-y);
  }
}

/* ---------- Edges ---------- */
var edges=$$('.edge').map(function(el,i){
  var r=rng(40+i),hs=[];for(var k=0;k<140;k++)hs.push(1+Math.floor(r()*4));
  return {el:el,cv:$('canvas',el),top:el.dataset.top,bot:el.dataset.bot,hs:hs,q:-1};
});
function drawEdge(e,q){
  var key=Math.round(q*20);if(key===e.q)return;e.q=key;
  var cv=e.cv,c=cv.getContext('2d'),bs=24,cols=Math.ceil(cv.width/bs),rows=5;
  c.fillStyle=e.top;c.fillRect(0,0,cv.width,cv.height);c.fillStyle=e.bot;
  for(var i=0;i<cols;i++){
    var n=Math.max(1,Math.round(e.hs[i%e.hs.length]*q));
    c.fillRect(i*bs,(rows-n)*bs,bs+1,n*bs+bs);
  }
}

/* ---------- Scramble text ---------- */
var GL='abcdefghijklmnopqrstuvwxyzabcdeghnoprstu0123456789#%&*+';
function prepScr(el){el._f=el.textContent;el._cur=el._f;var h=el.parentNode;h.setAttribute('aria-label',el._f.replace(/\s*\n\s*/g,' '));el.setAttribute('aria-hidden','true')}
function scr(el,k,ts){
  var f=el._f;
  if(reduce||k>=1){if(el._cur!==f){el.textContent=f;el._cur=f}return}
  if(ts-(el._t||0)<50)return;el._t=ts;
  var n=f.length,rev=k*n*1.1,o='',i,c;
  for(i=0;i<n;i++){c=f[i];if(c===' '||c==='\n')o+=c;else if(i<rev-1)o+=c;else o+=GL[(Math.random()*GL.length)|0]}
  el.textContent=o;el._cur=o;
}
/* fixed-time scramble: starts when the headline comes into view, settles in 0.9s whatever the scroll speed */
function scrT(el,on,ts){
  if(!on){el._on=false;return}
  if(!el._on){el._on=true;el._s=ts}
  scr(el,clamp((ts-el._s)/900),ts);
}
$$('.scr').forEach(prepScr);

/* ---------- Stage A slides ---------- */
var A=$('#stageA'),B=$('#stageB'),Dg=$('#stageD');
var aSl=$$('.slide',A).map(function(el,i){return {el:el,a:parseFloat(el.dataset.a),b:parseFloat(el.dataset.b),scr:$('.scr',el),i:i}});
function applySlide(s,o,k,ts){
  s.el.style.opacity=o.toFixed(3);
  s.el.style.visibility=o<.01?'hidden':'visible';
  s.el.style.pointerEvents=o>.5?'auto':'none';
  if(s.scr)s.i===0?scr(s.scr,1,ts):scrT(s.scr,o>.01,ts);
}
var tcache=[],TILE_OF=[null,[0,1,2],[3],[4],[5]];
function updateA(p,ts,tilt){
  var so=aSl.map(function(s){
    if(s.i===0)return 1-sstep(0,.05,p);
    var inn=sstep(s.a,s.a+.04,p),out=s.b>1?1:1-sstep(s.b-.035,s.b,p);return inn*out;
  });
  var hl=[0,0,0,0,0,0],act=0;
  aSl.forEach(function(s){if(s.i>0){act=Math.max(act,so[s.i]);TILE_OF[s.i].forEach(function(t){hl[t]=Math.max(hl[t],so[s.i])})}});
  var a1=sstep(0,.09,p),a2=sstep(.09,.17,p),flat=a1-a2;
  var rx=flat*52+tilt.x*(1-sstep(0,.17,p)),ry=tilt.y*(1-sstep(0,.17,p));
  card3d.style.transform='translateY('+(flat*7).toFixed(2)+'vh) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)';
  var sep=sstep(.15,.22,p);
  shadowEl.style.opacity=(1-sep).toFixed(3);
  var cw=tilesEl.offsetWidth,R=Math.round(cw*.03),inner=Math.round(R*sep);
  tilesEl.style.opacity=isMobile?lerp(1,.22,sstep(.17,.25,p)).toFixed(3):'1';
  tiles.forEach(function(t,i){
    var ax=(t.col-1)*cw/3,ay=(t.row-.5)*(cw/1.5)/2,x=0,y=0,r=0;
    if(p>TK[0]){
      var k=0;while(k<3&&p>TK[k+1])k++;
      var fx,fy,fr;
      if(k===0){fx=ax;fy=ay;fr=0}else{var f=K[k][i];fx=f[0]*W/100;fy=f[1]*H/100;fr=f[2]}
      var b=K[k+1][i],e=sstep(TK[k],TK[k+1],p);
      x=lerp(fx,b[0]*W/100,e)-ax;y=lerp(fy,b[1]*H/100,e)-ay;r=lerp(fr,b[2],e);
      if(!reduce){var fl=sstep(.2,.3,p);y+=Math.sin(ts/1200+i*1.7)*6*fl;r+=Math.sin(ts/1700+i)*1.5*fl}
    }
    var tr='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) rotate('+r.toFixed(2)+'deg) scale('+(1+.1*hl[i]*sep).toFixed(3)+')';
    if(tcache[i]!==tr){t.el.style.transform=tr;tcache[i]=tr}
    var tl=(t.col===0&&t.row===0)?R:inner,trr=(t.col===2&&t.row===0)?R:inner,br=(t.col===2&&t.row===1)?R:inner,bl=(t.col===0&&t.row===1)?R:inner;
    t.el.style.borderRadius=tl+'px '+trr+'px '+br+'px '+bl+'px';
    t.el.style.setProperty('--h',(hl[i]*sep).toFixed(2));
    t.el.style.setProperty('--d',(act*(1-hl[i])*sep*.9).toFixed(2));
  });
  drawWipe(sstep(0,.1,p));
  aSl.forEach(function(s){applySlide(s,so[s.i],s.i===0?1:clamp((p-s.a)/((s.b-s.a)*.42)),ts)});
}

/* ---------- Stage B ---------- */
var bS=[$('#b1'),$('#b2'),$('#b3')],bScr=bS.map(function(e){return $('.scr',e)});
var dev=$('#dev'),winL=$('#winL'),winR=$('#winR'),ost=$$('.ostep'),strip=$('#strip'),bnote=$('#bnote');
function setB(el,o){el.style.opacity=o.toFixed(3);el.style.visibility=o<.01?'hidden':'visible'}
function updateB(p,ts){
  var w1=1-sstep(.27,.31,p),w2=sstep(.33,.37,p)*(1-sstep(.58,.62,p)),w3=sstep(.65,.69,p);
  setB(bS[0],w1);setB(bS[1],w2);setB(bS[2],w3);
  scrT(bScr[1],w2>.01,ts);
  scrT(bScr[2],w3>.01,ts);
  var dy=(1-sstep(0,.26,p))*62+sstep(.62,.72,p)*34;
  dev.style.transform='translateY('+dy.toFixed(2)+'vh)';dev.style.opacity=(1-sstep(.62,.7,p)).toFixed(3);
  winL.style.opacity=w2.toFixed(3);winR.style.opacity=w2.toFixed(3);
  winL.style.transform='translate('+(-36*w2).toFixed(1)+'%,'+(5*w2).toFixed(1)+'%) rotate('+(-5*w2).toFixed(1)+'deg) scale('+(1-.1*w2).toFixed(3)+')';
  winR.style.transform='translate('+(36*w2).toFixed(1)+'%,'+(5*w2).toFixed(1)+'%) rotate('+(5*w2).toFixed(1)+'deg) scale('+(1-.1*w2).toFixed(3)+')';
  ost.forEach(function(el,j){var o=sstep(.66+.04*j,.70+.04*j,p);el.style.opacity=o.toFixed(3);el.style.transform='translateY('+((1-o)*14).toFixed(1)+'px)'});
  bnote.style.opacity=sstep(.78,.84,p).toFixed(3);
}

/* ---------- Stage C: how it works ---------- */
var Cs=$('#stageC'),cSl=$$('.cslide',Cs),cScr=cSl.map(function(e){return $('.scr',e)}),cPn=$$('.pane',Cs),cPills=$$('#hsteps span'),cLast=-1;
var cRv=cPn.map(function(pn){return $$('.rv',pn)}),cPb=cPn.map(function(pn){return $$('.pb i',pn)});
function updateC(p,ts){
  var n=5,pre=clamp(1-Cs.getBoundingClientRect().top/H),cur=Math.min(n-1,Math.floor(p*n));
  if(cur!==cLast){cLast=cur;cPills.forEach(function(sp,j){sp.className=j<cur?'ok':(j===cur?'now':'')})}
  for(var i=0;i<n;i++){
    var a=i/n,b=(i+1)/n;
    var inn=i===0?1:sstep(a,a+.04,p),out=i===n-1?1:1-sstep(b-.04,b,p),o=inn*out;
    setB(cSl[i],o);
    scrT(cScr[i],o>.01&&(i>0||pre>.5),ts);
    var pn=cPn[i];pn.style.opacity=o.toFixed(3);pn.style.visibility=o<.01?'hidden':'visible';
    pn.style.transform='translateY('+(((1-inn)*16)-((1-out)*16)).toFixed(1)+'px)';
    if(o<.01)continue;
    var lp=clamp((p-a)/(b-a));if(i===0)lp=clamp(lp+pre*.3);
    cRv[i].forEach(function(el,j){var q=sstep(.04+.07*j,.16+.07*j,lp);el.style.opacity=q.toFixed(3);el.style.transform='translateY('+((1-q)*8).toFixed(1)+'px)'});
    cPb[i].forEach(function(el,j){el.style.width=(sstep(.08+.08*j,.5+.08*j,lp)*100).toFixed(1)+'%'});
  }
}

/* ---------- Stage D: the business ---------- */
var dcs=$$('.dcard',$('#dcards')),DS=[108,150,192,232,276,316],DIST=268;
var dB=$$('.dbeat',Dg),dBs=dB.map(function(e){return $('.scr',e)}),DE=[0,.27,.52,.77,1.01],cmpEl=$('#cmp'),dMob=false;
function updateD(p,ts){
  if(isMobile){
    dcs.forEach(function(c){c.style.transform=''});
    if(!dMob){dMob=true;dBs.forEach(function(e){scr(e,1,0)});cmpEl.classList.add('in')}
    return;
  }
  dMob=false;
  var pre=clamp(1-Dg.getBoundingClientRect().top/H);
  dcs.forEach(function(c,i){c.style.transform='translateY('+((DS[i]-p*DIST)*H/100).toFixed(1)+'px)'});
  dB.forEach(function(el,i){
    var a=DE[i],b=DE[i+1];
    var inn=i===0?1:sstep(a,a+.05,p),out=i===3?1:1-sstep(b-.05,b,p),o=inn*out;
    el.style.opacity=o.toFixed(3);el.style.visibility=o<.01?'hidden':'visible';
    el.style.transform='translateY('+(((1-inn)*14)-((1-out)*14)).toFixed(1)+'px)';
    scrT(dBs[i],o>.01&&(i>0||pre>.8),ts);
    if(i===0&&o>.5)cmpEl.classList.add('in');
  });
}

/* ---------- Layout ---------- */
function layout(){
  W=innerWidth;H=innerHeight;isMobile=W<900;
  wipe.width=W;wipe.height=H;wlast='';
  edges.forEach(function(e){e.cv.width=Math.ceil(W);e.cv.height=120;e.q=-1});
  needsRender=true;tcache=[];
}
addEventListener('resize',layout);layout();

/* ---------- Pointer ---------- */
var mouse={x:W/2,y:H/2,nx:0,ny:0},tilt={x:0,y:0},cur={x:W/2,y:H/2},curEl=$('#cur'),lastCell='';
addEventListener('pointermove',function(e){
  mouse.x=e.clientX;mouse.y=e.clientY;mouse.nx=e.clientX/W*2-1;mouse.ny=e.clientY/H*2-1;
  curEl.style.opacity=e.pointerType==='mouse'?'1':'0';
  if(!homeOn||reduce)return;
  var r=tilesEl.getBoundingClientRect();
  if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom&&pA<.16){
    var gx=Math.floor((e.clientX-r.left)/r.width*AW/BS),gy=Math.floor((e.clientY-r.top)/r.height*AH/BS);
    var key=gx+','+gy;
    if(key!==lastCell&&gx>=0){lastCell=key;trail.push({x:gx,y:gy,t:performance.now()})}
  }
},{passive:true});
document.documentElement.addEventListener('mouseleave',function(){curEl.style.opacity='0'});

/* ---------- Main loop ---------- */
var homeOn=true,raf=0,sm=scrollY,pA=0;
var dot=$('#dot'),eyesGroups=$$('.eyes',$('#disc'));
function stageP(el){var r=el.getBoundingClientRect();return clamp((sm-(r.top+scrollY))/Math.max(1,r.height-H))}
function frame(ts){
  if(!homeOn||document.hidden){raf=0;return}
  sm+=(scrollY-sm)*(reduce?1:.16);if(Math.abs(scrollY-sm)<.4)sm=scrollY;
  if(!reduce){
    tilt.x+=((-mouse.ny*7)-tilt.x)*.07;tilt.y+=((mouse.nx*9)-tilt.y)*.07;
    cur.x+=(mouse.x-cur.x)*.2;cur.y+=(mouse.y-cur.y)*.2;
    curEl.style.transform='translate('+(cur.x-5).toFixed(1)+'px,'+(cur.y-5).toFixed(1)+'px)';
  }
  pA=stageP(A);
  if(trail.length||needsRender){renderTiles(performance.now());needsRender=false}
  updateA(pA,ts,reduce?{x:0,y:0}:tilt);
  updateB(stageP(B),ts);
  updateC(stageP(Cs),ts);
  updateD(stageP(Dg),ts);
  edges.forEach(function(e){var r=e.el.getBoundingClientRect();if(r.bottom>-20&&r.top<H+20)drawEdge(e,clamp((H-r.top)/(H*.9)))});
  var dh=document.documentElement.scrollHeight-H;dot.style.transform='translateY('+(dh>0?sm/dh*(H-12):0).toFixed(1)+'px)';
  var ex=mouse.nx*2.6,ey=mouse.ny*2;
  eyesGroups.forEach(function(g){g.style.transform='translate('+ex.toFixed(2)+'px,'+ey.toFixed(2)+'px)'});
  var cr=$('#ctaCard').getBoundingClientRect();
  if(cr.bottom>0&&cr.top<H){var ccv=$('#ctaCv');ccv.style.transform=reduce?'':'rotateY('+(mouse.nx*6).toFixed(2)+'deg) rotateX('+(-mouse.ny*5).toFixed(2)+'deg)'}
  raf=requestAnimationFrame(frame);
}
function start(){if(!raf&&homeOn)raf=requestAnimationFrame(frame)}
document.addEventListener('visibilitychange',function(){if(!document.hidden)start()});

/* ---------- Wordmarks and CTA card ---------- */
function drawFixed(){
  drawWord($('#ghost'),40,'#191e1c','#191e1c',null);
  var cc=$('#ctaCv').getContext('2d');cc.drawImage(art,0,0);
}
function redrawArt(){buildArt();needsRender=true;drawFixed()}
drawFixed();
if(document.fonts&&document.fonts.load){
  Promise.all([document.fonts.load('500 17px "Pixelify Sans"'),document.fonts.load('700 32px "Bricolage Grotesque"'),document.fonts.load('600 28px "Bricolage Grotesque"'),document.fonts.load('500 19px "Geist"'),document.fonts.load('400 14px "Geist Mono"'),document.fonts.load('500 16px "Geist Mono"'),document.fonts.ready]).then(redrawArt).catch(function(){});
}

/* ---------- Intro ---------- */
(function(){
  var intro=$('#intro'),hashNow=location.hash.replace('#',''),seen=false;
  try{seen=sessionStorage.getItem('paraiq-intro')==='1'}catch(e){}
  function unlock(){document.documentElement.style.overflow='';document.body.style.overflow=''}
  if(reduce||seen||hashNow==='privacy'||hashNow==='terms'){intro.style.display='none';return}
  drawWord($('#lcv'),6,MINT,MINT,null);
  document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  var vs=[$('#v1'),$('#v2')],D=[6.43,11.45],TOT=D[0]+D[1];
  var BEATS=[
   [[0,'Humans began with wonder.','The curiosity to ask. The patience to look closer. The judgement to know what matters.'],
    [3.2,'Every great idea started as a question.','Care, imagination and doubt are still the most powerful tools we have.']],
   [[0,'AI brings something different.','Tireless attention. A memory without edges. The patience to read everything.'],
    [2.9,'Together, we see further.','AI widens what we can notice. We decide what is worth noticing.'],
    [5.7,'New ideas. New ways to solve old problems.','Not a replacement for the mind, but room for it to grow.'],
    [8.5,'But can we trust it?','Trust isn’t given, it’s earned. Through privacy that is kept, honesty about how it works, and a human always in charge.']]
  ];
  var pBegin=$('#inBegin'),pPlay=$('#inPlay'),pEnd=$('#inEnd'),top=$('#inTop'),bot=$('#inBot'),prog=$('#inProg'),snd=$('#inSnd');
  var idx=0,beat=-1,beatT=0,virt=false,t0=0,raf=0,state='begin',muted=false,watch=0;
  function finish(){
    if(state==='done')return;state='done';cancelAnimationFrame(raf);clearTimeout(watch);
    vs.forEach(function(v){try{v.pause()}catch(e){}});
    try{sessionStorage.setItem('paraiq-intro','1')}catch(e){}
    intro.classList.add('done');unlock();scrollTo(0,0);needsRender=true;
    setTimeout(function(){intro.style.display='none'},800);
  }
  function clipTime(){return virt?(performance.now()-t0)/1000:vs[idx].currentTime}
  function setBeat(b){
    beat=b;var B=BEATS[idx][b];top._f=B[1];top._cur='';top._t=0;top.textContent='';beatT=performance.now();
    bot.textContent=B[2];bot.style.opacity='0';
  }
  function loop(now){
    if(state!=='play')return;
    var t=clipTime(),bs=BEATS[idx],b=0,i;
    for(i=0;i<bs.length;i++)if(t>=bs[i][0])b=i;
    if(b!==beat)setBeat(b);
    scr(top,clamp((now-beatT)/650),now);
    bot.style.opacity=clamp((now-beatT-250)/500).toFixed(2);
    var done=(idx?D[0]:0)+Math.min(t,D[idx]);prog.style.width=(done/TOT*100).toFixed(1)+'%';
    if(virt&&t>=D[idx]){endClip();return}
    raf=requestAnimationFrame(loop);
  }
  function fallback(i){
    if(i!==idx||virt||state!=='play')return;
    virt=true;t0=performance.now();vs[i].classList.remove('on');
  }
  function startClip(i){
    idx=i;beat=-1;virt=false;t0=performance.now();
    vs.forEach(function(v,j){v.classList.toggle('on',j===i)});
    var v=vs[i];v.currentTime=0;v.onerror=function(){fallback(i)};
    v.onended=endClip;
    try{var pr=v.play();if(pr&&pr.catch)pr.catch(function(){fallback(i)})}catch(e){fallback(i)}
    clearTimeout(watch);watch=setTimeout(function(){if(!virt&&idx===i&&state==='play'&&v.currentTime<.05)fallback(i)},3500);
    cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  }
  function endClip(){
    if(state!=='play')return;
    if(idx===0){startClip(1);return}
    state='end';cancelAnimationFrame(raf);vs.forEach(function(v){try{v.pause()}catch(e){}});
    pPlay.hidden=true;pEnd.hidden=false;snd.hidden=true;
    try{$('#inCta').focus({preventScroll:true})}catch(e){}
  }
  function begin(){
    if(state!=='begin')return;state='play';
    vs.forEach(function(v){v.muted=false});
    /* unlock the second clip for sound inside this tap */
    try{var v2=vs[1];v2.volume=0;var q=v2.play();if(q&&q.then)q.then(function(){v2.pause();v2.currentTime=0;v2.volume=1}).catch(function(){v2.volume=1});else{v2.volume=1}}catch(e){}
    pBegin.hidden=true;pPlay.hidden=false;snd.hidden=false;
    startClip(0);
  }
  $('#inGo').addEventListener('click',begin);
  $('#inSkipB').addEventListener('click',finish);
  $('#inSkip').addEventListener('click',finish);
  $('#inCont').addEventListener('click',finish);
  snd.addEventListener('click',function(){muted=!muted;vs.forEach(function(v){v.muted=muted});snd.textContent=muted?'Sound off':'Sound on'});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&state!=='done')finish()});
  $('#inCopy').addEventListener('click',function(){
    var b=this,t=$('#inMailText');
    function ok(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}
    function pick(){var rg=document.createRange();rg.selectNodeContents(t);var sl=getSelection();sl.removeAllRanges();sl.addRange(rg);b.textContent='Selected';setTimeout(function(){b.textContent='Copy'},1600)}
    try{navigator.clipboard.writeText(t.textContent).then(ok,pick)}catch(e){pick()}
  });
  try{$('#inGo').focus({preventScroll:true})}catch(e){}
})();

/* ---------- Try it ---------- */
var DOCS=[
 {id:'fact',name:'Fact find',query:'Please send the signed fact find, or confirm dependants and stated income.'},
 {id:'tax',name:'Tax return',query:'Please send the latest tax return.'},
 {id:'super',name:'Super statement',query:'Please send the current super statement.'},
 {id:'ins',name:'Insurance schedule',query:'Please send the insurance policy schedule.'},
 {id:'loan',name:'Loan statement',query:'Please send the latest loan statement.'}
];
function compute(sel){
  var has=function(id){return sel.indexOf(id)>-1},rows=[],conf=[],gaps=[];
  if(has('fact'))rows.push(['Dependants','Two children','Fact find · p.2']);
  if(has('fact')&&has('tax'))conf.push(['Income','A$90,000 (fact find, p.3) or A$96,000 (tax return, p.1)','2 sources']);
  else if(has('fact'))rows.push(['Income','A$90,000','Fact find · p.3']);
  else if(has('tax'))rows.push(['Income','A$96,000','Tax return · p.1']);
  if(has('super'))rows.push(['Super balance','A$142,300','Super stmt · p.2']);
  if(has('ins')){rows.push(['Life cover','A$500,000','Insurance · p.1']);rows.push(['TPD cover','A$300,000','Insurance · p.1'])}
  if(has('loan'))rows.push(['Mortgage balance','A$410,000','Loan stmt · p.1']);
  DOCS.forEach(function(d){if(!has(d.id))gaps.push([d.name,d.query])});
  return {rows:rows,conf:conf,gaps:gaps};
}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function rr(cls,label,val,chip){var r=el('div','rr '+cls);r.appendChild(el('small',null,label));r.appendChild(el('b',null,val));r.appendChild(el('code',null,chip));return r}
var tpick=$('#tpick'),tres=$('#tres'),tgo=$('#tgo'),tprog=$('#tprog'),tbar=$('#tbar'),tstep=$('#tstep'),ttitle=$('#ttitle'),tTimer=null;
function showResult(sel){
  var res=compute(sel);tres.textContent='';
  var nf=res.rows.length+res.conf.length;
  tres.appendChild(el('p','sum',nf+' facts found · '+res.conf.length+' conflict · '+res.gaps.length+' gaps'));
  tres.appendChild(el('h3',null,'Client picture'));
  if(!res.rows.length&&!res.conf.length)tres.appendChild(el('p','fine','Nothing read yet.'));
  res.rows.forEach(function(r){tres.appendChild(rr('',r[0],r[1],r[2]))});
  if(res.conf.length){tres.appendChild(el('h3',null,'Conflict shown, not averaged'));res.conf.forEach(function(r){tres.appendChild(rr('cf',r[0],r[1],r[2]))})}
  tres.appendChild(el('h3',null,res.gaps.length?'Gaps and queries drafted':'Gaps'));
  if(!res.gaps.length)tres.appendChild(el('p','fine','No gaps. Every sample document was read.'));
  res.gaps.forEach(function(g){tres.appendChild(rr('gp',g[0]+' missing',g[1],'Query'))});
  var again=el('button','btn-g','Start over');again.type='button';again.id='tagain';
  again.addEventListener('click',function(){tres.hidden=true;tpick.hidden=false;tprog.hidden=true;tbar.style.width='0';tgo.disabled=false;tgo.textContent='Read documents';tstep.textContent='1/2';ttitle.textContent='Pick documents'});
  tres.appendChild(again);
  tres.appendChild(el('p','fine','Example data. Nothing is uploaded or sent anywhere.'));
  tpick.hidden=true;tres.hidden=false;tstep.textContent='2/2';ttitle.textContent='What ParaIQ found';
}
tgo.addEventListener('click',function(){
  var sel=$$('#tpick input:checked').map(function(i){return i.value});
  if(reduce||!sel.length){showResult(sel);return}
  tgo.disabled=true;tprog.hidden=false;tbar.style.width='0';
  var n=0;
  (function next(){
    n++;tgo.textContent='Reading '+n+' of '+sel.length+'…';tbar.style.width=(n/sel.length*100)+'%';
    if(n<sel.length)tTimer=setTimeout(next,480);else tTimer=setTimeout(function(){showResult(sel)},520);
  })();
});

/* ---------- Misc ---------- */
$('#goPrivacy').addEventListener('click',function(){
  var r=B.getBoundingClientRect();scrollTo({top:r.top+scrollY+2,behavior:reduce?'auto':'smooth'});
});
$('#copyMail').addEventListener('click',function(){
  var b=this,t=$('#mailText');
  function ok(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}
  function sel(){var rg=document.createRange();rg.selectNodeContents(t);var s=getSelection();s.removeAllRanges();s.addRange(rg);b.textContent='Selected';setTimeout(function(){b.textContent='Copy'},1600)}
  try{navigator.clipboard.writeText(t.textContent).then(ok,sel)}catch(e){sel()}
});
/* ---------- Routing (#privacy, #terms) ---------- */
var homeEl=$('#home'),vP=$('#view-privacy'),vT=$('#view-terms'),savedY=0;
function route(){
  var h=location.hash.replace('#','');
  var v=(h==='privacy'||h==='terms')?h:'home';
  if(v==='home'){
    vP.hidden=true;vT.hidden=true;document.body.classList.remove('policy');
    if(!homeOn){homeEl.hidden=false;homeOn=true;scrollTo(0,savedY);sm=savedY;needsRender=true;start()}
  }else{
    if(homeOn)savedY=scrollY;
    homeOn=false;homeEl.hidden=true;document.body.classList.add('policy');
    vP.hidden=v!=='privacy';vT.hidden=v!=='terms';scrollTo(0,0);
    var l=$('#intro');if(l)l.style.display='none';
  }
}
addEventListener('hashchange',route);
route();
start();
})();

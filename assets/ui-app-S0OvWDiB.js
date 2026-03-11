const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/game-app-DEmQrFkK.js","assets/other-vendor-CQiTX5cC.js","assets/phaser-core-UqVUGhlF.js","assets/phaser-extras-DYrhJe6a.js","assets/react-vendor-Bj8QGiRM.js"])))=>i.map(i=>d[i]);
import{r as i,j as e}from"./react-vendor-Bj8QGiRM.js";import{A as Y,g as E,G as k,O as me,a as ht,l as qe,m as ft,c as mt,b as gt,d as bt,p as Te,B as _e,e as Ie,f as Ae,E as C,h as oe}from"./game-app-DEmQrFkK.js";import{d as g,F as Et,a as yt,b as jt,c as wt,e as we,f as St,g as Ne,G as vt,h as Ct}from"./ui-vendor-ITWqKVib.js";const Se=t=>{const n=document.getElementById("game-container");n&&(t===void 0&&(document.fullscreenElement?Pe():Oe(n)),t===!0?Oe(n):Pe())},Oe=t=>{t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.msRequestFullscreen&&t.msRequestFullscreen()},Pe=()=>{document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()},Re=g.div`
  position: fixed;
  max-width: 500px;
  max-height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  z-index: 100;
`;g(Re)`
  width: 500px;
  height: 150px;
  bottom: 10px;
  left: ${({collapsed:t})=>t?"-510px":"10px"};
  top: auto;
  transform: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 10px;
  border-radius: 10px;
  transition: left 0.3s ease;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 100;
`;const Mt=g.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;g.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 30px;
`;const Le=g.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 5px;
`;g.div`
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;const Ke=g.div`
  position: absolute;
  top: 10px;
  left: 10px;
`,_t=g.div`
  position: absolute;
  top: 10px;
  right: 10px;
`,It=g.div`
  position: absolute;
  top: 10px;
  right: 60px;
`,Rt=g.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`,Dt=g.div`
  flex-direction: column;
  display: flex;
`,kt=g(Re)`
  max-width: 800px;
  max-height: 912px;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
`;g.div`
  padding-top: 60px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex: 1;
  width: 100%;
`;g.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;g.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;g(Mt)`
  margin-bottom: 10px;
`;g.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;g.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;const Tt=g.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;g.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;g.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  height: 150px;
  background-color: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  overflow-y: auto;
`;const ge=g.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`,B=g.button`
  padding: 12px 24px;
  font-size: 18px;
  color: #00ffff;
  background-color: transparent;
  border: 2px solid #00ffff;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  text-shadow:
    0 0 5px #00ffff,
    0 0 10px #00ffff;
  box-shadow:
    0 0 5px #00ffff,
    0 0 20px #00ffff;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: #00ffff;
    color: #000000;
  }

  &:disabled {
    opacity: 0.7;
  }
`,F=g(B)`
  padding: 4px 8px;
  margin: 4px;
  font-size: 12px;
  text-shadow: none;
  box-shadow: none;
  border: 1px solid #00ffff;
`,X=g(B)`
  padding: 4px;
  font-size: 16px;
  width: 32px;
  height: 32px;
`;g(B)`
  position: absolute;
  right: -30px;
  top: 55px;
  border-radius: 0 5px 5px 0;
  padding: 6px 8px;
`;const re=g(B)`
  border-radius: 0 5px 5px 0;
  padding: 0;
  width: 25px;
  height: 25px;
`,le=g.input.attrs({type:"range"})`
  -webkit-appearance: none;
  width: ${({$isVertical:t})=>t?"8px":""};
  height: ${({$isVertical:t})=>t?"":"8px"};
  background: #00ffff;
  border-radius: 4px;
  outline: none;
  margin: 0 5px;
  transition: background 0.3s;
  flex: 1;
  ${({$isVertical:t})=>t?"writing-mode: vertical-lr; transform: rotate(180deg);":""}

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #00ffff;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px #00ffff;
    transition: background 0.3s;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #00ffff;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px #00ffff;
    transition: background 0.3s;
  }

  &:disabled {
    opacity: 0.7;
  }
`;g(F)`
  margin-top: 10px;
`;g(X)``;const Je=g.div`
  position: absolute;
  width: 50px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`,At=g(Je)`
  left: 0;
`,Nt=g(Je)`
  right: 0;
`,Ot=g.div`
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0;
  display: flex;
`,Be=g(B)`
  padding: 0 10px;
`,H=g.div`
  flex: 0;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`,ae=g.div`
  flex: 0;
  display: flex;
  padding: 10px;
`,Ge=g.div`
  flex: 1;
  display: flex;
`,Ze=g.h1`
  color: #ffffff;
  margin: 0 0 10px 0;
  font-size: 36px;
  text-align: center;
`,Qe=g.h2`
  color: #ffffff;
  margin: 0 0 20px 0;
  font-size: 18px;
  text-align: center;
  opacity: 1; /* Fully opaque */
`,Fe=g.h3`
  color: #ffffff;
  margin: 0 10px 20px 10px;
  font-size: 14px;
  text-align: justify;
  opacity: 1; /* Fully opaque */
`,ce=g.span`
  color: #fff;
  font-size: 12px;
  margin-left: 5px;
`,Pt=g(Ze)`
  font-size: 32px;
  margin-bottom: 10px;
`;g(Qe)`
  text-align: left;
  margin-bottom: 10px;
`;const Lt="0.9.1",Bt={version:Lt};var _=(t=>(t[t.FIRST_START=0]="FIRST_START",t[t.MAIN_MENU=1]="MAIN_MENU",t[t.CONFIG_GAME=2]="CONFIG_GAME",t[t.INGAME=3]="INGAME",t[t.SCORESCREEN=4]="SCORESCREEN",t[t.EDITOR=5]="EDITOR",t))(_||{});const Gt="modulepreload",Ft=function(t){return"/"+t},He={},be=function(n,s,o){let a=Promise.resolve();if(s&&s.length>0){let c=function(p){return Promise.all(p.map(b=>Promise.resolve(b).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=c(s.map(p=>{if(p=Ft(p),p in He)return;He[p]=!0;const b=p.endsWith(".css"),u=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${u}`))return;const x=document.createElement("link");if(x.rel=b?"stylesheet":Gt,b||(x.as="script"),x.crossOrigin="",x.href=p,d&&x.setAttribute("nonce",d),document.head.appendChild(x),b)return new Promise((v,R)=>{x.addEventListener("load",v),x.addEventListener("error",()=>R(new Error(`Unable to preload CSS for ${p}`)))})}))}function l(c){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=c,window.dispatchEvent(r),!r.defaultPrevented)throw c}return a.then(c=>{for(const r of c||[])r.status==="rejected"&&l(r.reason);return n().catch(l)})};let Ee=null;const de=async()=>(Ee||(Ee=(async()=>(await be(()=>import("./phaser-core-UqVUGhlF.js"),[]),await be(()=>import("./phaser-extras-DYrhJe6a.js"),[]),(await be(()=>import("./game-app-DEmQrFkK.js").then(n=>n.i),__vite__mapDeps([0,1,2,3,4]))).App))()),Ee),z={async createGame(){return(await de()).createGame()},async destroyGame(){return(await de()).destroyGame()},async startMode(t,n){return(await de()).startMode(t,n)},async stopMode(t){return(await de()).stopMode(t)}},ze=[_.MAIN_MENU,_.CONFIG_GAME],et=i.createContext(void 0),Ht=({children:t})=>{const[n,s]=i.useState(_.FIRST_START),[o,a]=i.useState(null),[l,c]=i.useState(null),r=async(d,p)=>{if(ze.includes(d)||await z.stopMode(Y.BACKGROUND),d!==_.EDITOR&&await z.stopMode(Y.EDITOR),d!==_.INGAME&&(await z.stopMode(Y.GAME),E.off(k.GAME_END)),d===_.INGAME){const b=p||l;if(!b)throw new Error("Tried to start game without game config");E.on(k.GAME_END,u=>{const x=u[0];a(x),r(_.SCORESCREEN),E.off(k.GAME_END)}),c(b),z.startMode(Y.GAME,b)}d===_.EDITOR&&z.startMode(Y.EDITOR),ze.includes(d)&&(n===_.FIRST_START?z.createGame().then(()=>z.startMode(Y.BACKGROUND)):z.startMode(Y.BACKGROUND)),s(d)};return i.useEffect(()=>{n===_.FIRST_START&&r(_.MAIN_MENU)}),e.jsx(et.Provider,{value:{gameState:n,setGameState:r,winnerData:o,lastConfig:l},children:t})},J=()=>{const t=i.useContext(et);if(!t)throw new Error("useGameState must be used within GameStateProvider");return t},zt=()=>{const[t,n]=i.useState(!0);return{setMute:o=>{n(o),E.emit(k.SET_VOLUME,{mute:o})},muted:t}},Wt=`
Take turns to fire at each other by adjusting the angle and the power using the sliders or the firing control. When you are happy with the angle and power, press the end turn button to let the next player go. All players' shots will then be fired. All shots are affected by the gravity of stars and planets. If things get sticky, the hyperspace button will transport you to a random location. The last surviving station wins. Watch bots go at it in fullscreen with the top-right button!
`,Ut=()=>{const{setGameState:t}=J(),{muted:n,setMute:s}=zt(),[o,a]=i.useState(!1),l=n?jt:wt,c=o?Et:yt,r=()=>s(!n),d=()=>{const p=!o;a(p),Se(p)};return o?e.jsx(Ke,{children:e.jsx(X,{onClick:d,children:e.jsx(c,{})})}):e.jsxs(Re,{style:{padding:"50px 0"},children:[e.jsx(_t,{children:e.jsx(X,{onClick:d,children:e.jsx(c,{})})}),e.jsx(It,{children:e.jsx(X,{onClick:r,children:e.jsx(l,{})})}),e.jsx(Ze,{children:"Death Star Battles"}),e.jsxs(Qe,{children:["© 2001 Ian Bolland // © 2025 Sergei Gmyria // v.",Bt.version]}),e.jsx(Fe,{children:Wt}),e.jsxs(Fe,{children:[e.jsx("a",{href:"https://github.com/Moai-/deathstarbattles",target:"_blank",children:"Github Repo"})," | ",e.jsx("a",{href:"http://deathstarbattles.co.uk",target:"_blank",children:"Original Website"})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(B,{onClick:()=>t(_.CONFIG_GAME),children:"New game"}),e.jsx(B,{onClick:()=>t(_.EDITOR),children:"Editor"})]})]})},Yt=()=>{const[t,n]=i.useState(!1),[s,o]=i.useState(!1);return i.useLayoutEffect(()=>{const a=window.innerWidth,l=window.innerHeight;n(a>l),o(Math.min(a,l)<900)},[]),{isLandscape:t,isMobile:s}},Xt=()=>{const{isMobile:t,isLandscape:n}=Yt(),[s,o]=i.useState(90),[a,l]=i.useState(50),[c,r]=i.useState(!1),[d,p]=i.useState(!1),{setGameState:b}=J();i.useEffect(()=>{d&&(p(!1),E.emit(k.ANGLE_POWER_UI,{angle:s,power:a}))},[d]),i.useEffect(()=>(E.on(k.ANGLE_POWER_GAME,({angle:j,power:I})=>{o(Math.trunc(j)),l(Math.trunc(I))}),E.on(k.OTHER_ACTION_GAME,j=>{j===me.HYPERSPACE?r(!0):j||r(!1)}),()=>{E.off(k.ANGLE_POWER_GAME),E.off(k.OTHER_ACTION_GAME)}),[]);const u=(j,I,h,D)=>{j(T=>Math.min(D,Math.max(h,T+I))),p(!0)},x=j=>{o(j),E.emit(k.ANGLE_POWER_UI,{angle:j,power:a})},v=j=>{l(j),E.emit(k.ANGLE_POWER_UI,{angle:s,power:j})},R=()=>E.emit(k.END_TURN),y=()=>{c?(r(!1),E.emit(k.OTHER_ACTION_UI,me.NONE)):(r(!0),E.emit(k.OTHER_ACTION_UI,me.HYPERSPACE))},S=()=>{b(_.MAIN_MENU)};return t&&n?e.jsxs(e.Fragment,{children:[e.jsxs(At,{children:[e.jsx(H,{children:e.jsx(re,{onClick:S,children:e.jsx(we,{size:15})})}),e.jsxs(H,{children:[e.jsxs(ce,{children:[s,"°"]}),e.jsx(F,{onClick:()=>u(o,1,-180,180),disabled:c,children:"+"})]}),e.jsx(Ge,{children:e.jsx(le,{$isVertical:!0,min:-180,max:180,value:Math.floor(s),onChange:j=>x(Number(j.target.value)),disabled:c})}),e.jsx(H,{children:e.jsx(F,{onClick:()=>u(o,-1,-180,180),disabled:c,children:"-"})}),e.jsx(H,{children:e.jsx(re,{onClick:R,children:e.jsx(St,{size:15})})})]}),e.jsxs(Nt,{children:[e.jsx(H,{children:e.jsx(re,{onClick:()=>Se(),children:e.jsx(Ne,{size:15})})}),e.jsxs(H,{children:[e.jsxs(ce,{children:[a,"%"]}),e.jsx(F,{onClick:()=>u(l,-1,20,100),disabled:c,children:"-"})]}),e.jsx(Ge,{children:e.jsx(le,{$isVertical:!0,min:20,max:100,value:Math.floor(a),onChange:j=>v(Number(j.target.value)),disabled:c})}),e.jsx(H,{children:e.jsx(F,{onClick:()=>u(l,1,20,100),disabled:c,children:"+"})}),e.jsx(H,{children:e.jsx(re,{onClick:y,children:c?e.jsx(vt,{size:15}):e.jsx(Ct,{size:15})})})]})]}):e.jsxs(Ot,{children:[e.jsx(ae,{children:e.jsx(Be,{onClick:R,children:"End Turn"})}),e.jsx(ae,{children:e.jsxs(Be,{onClick:y,children:["Hyperspace",c?" [On] ":" [Off]"]})}),e.jsxs(Le,{children:[e.jsx(F,{onClick:()=>u(o,-1,-180,180),disabled:c,children:"-"}),e.jsx(le,{min:-180,max:180,value:Math.floor(s),onChange:j=>x(Number(j.target.value)),disabled:c}),e.jsx(F,{onClick:()=>u(o,1,-180,180),disabled:c,children:"+"}),e.jsxs(ce,{children:["Angle: ",s,"°"]})]}),e.jsxs(Le,{children:[e.jsxs(ce,{children:["Power: ",a,"%"]}),e.jsx(F,{onClick:()=>u(l,-1,20,100),disabled:c,children:"-"}),e.jsx(le,{min:20,max:100,value:Math.floor(a),onChange:j=>v(Number(j.target.value)),disabled:c}),e.jsx(F,{onClick:()=>u(l,1,20,100),disabled:c,children:"+"})]}),e.jsx(ae,{children:e.jsx(X,{onClick:()=>Se(),children:e.jsx(Ne,{})})}),e.jsx(ae,{children:e.jsx(X,{onClick:S,children:e.jsx(we,{})})})]})},Vt=t=>`#${t.toString(16).padStart(6,"0")}`,$t=()=>{const{setGameState:t,winnerData:n}=J(),s=()=>{if(!n)return e.jsx("h1",{style:{color:"white"},children:"Nobody won! Total annihilation!"});const{playerId:o,col:a}=n;return e.jsxs("h1",{style:{color:Vt(a)},children:["Player ",o+1," wins!"]})};return e.jsx(Rt,{children:e.jsxs(Dt,{children:[s(),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(B,{onClick:()=>t(_.MAIN_MENU),children:"Menu"}),e.jsx(B,{onClick:()=>t(_.INGAME),children:"Play again"}),e.jsx(B,{onClick:()=>t(_.CONFIG_GAME),children:"Change settings"})]})]})})},$=g.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,q=g.label`
  font-size: 14px;
  color: #00ffff;
`,K=g.select`
  padding: 8px 12px;
  font-size: 16px;
  background-color: #111;
  color: #00ffff;
  border: 1px solid #00ffff;
  border-radius: 6px;
  outline: none;

  &:focus {
    box-shadow: 0 0 8px #00ffff;
  }
`,qt=["Tiny","Small","Large","That's no moon"],Kt=[{label:"5",amount:5,isMax:!1},{label:"10",amount:10,isMax:!1},{label:"15",amount:15,isMax:!1},{label:"20",amount:20,isMax:!1},{label:"25",amount:25,isMax:!1},{label:"30",amount:30,isMax:!1},{label:"Up to 10",amount:10,isMax:!0},{label:"Up to 20",amount:20,isMax:!0},{label:"Up to 30",amount:30,isMax:!0}],Jt=[1,2,3,4],Zt=()=>{const{setGameState:t,lastConfig:n}=J(),[s,o]=i.useState("7"),[a,l]=i.useState("3"),[c,r]=i.useState("10"),[d,p]=i.useState("2"),[b,u]=i.useState("1"),[x,v]=i.useState("0"),R=ht({random:gt(Math.random)}),y=i.useMemo(()=>qe(),[]),S=i.useMemo(()=>{const h=R.map(({name:T},P)=>({value:String(P),label:T})),D=y.map(T=>({value:ft(T),label:T}));return[...h,...D]},[R,y]),j=mt(x),I=()=>{const h=[],D=parseInt(s,10),T=parseInt(a,10),P=parseInt(d);h.push({id:0,type:0,difficulty:0,col:Te[0]});for(let A=0;A<D;A++)h.push({id:0,type:1,difficulty:T,col:Te[A+1]});if(j)t(_.INGAME,{justBots:!1,players:h,stationSize:P,stationPerPlayer:Number(b),savedScenario:bt(x)});else{const[A,te]=c.split("|"),Z=parseInt(A,10),W=te==="true",ne=parseInt(x,10),se=R[ne];t(_.INGAME,{justBots:!1,players:h,maxItems:W?Z:void 0,numItems:W?void 0:Z,background:se.background,itemRules:se.items,stationSize:P,stationPerPlayer:Number(b)})}};return e.jsxs(kt,{children:[e.jsx(Ke,{children:e.jsx(X,{onClick:()=>t(_.MAIN_MENU),children:e.jsx(we,{})})}),e.jsx(Pt,{children:"Game Setup"}),e.jsxs(Tt,{children:[e.jsxs(ge,{children:[e.jsxs($,{children:[e.jsx(q,{htmlFor:"botCount",children:"Number of Bots"}),e.jsx(K,{id:"botCount",value:s,onChange:h=>o(h.target.value),children:[1,2,3,4,5,6,7,8,9,10,11].map(h=>e.jsx("option",{value:h,children:h},h))})]}),e.jsxs($,{children:[e.jsx(q,{htmlFor:"difficulty",children:"Bot Difficulty"}),e.jsx(K,{id:"difficulty",value:a,onChange:h=>l(h.target.value),children:["Failbot","Aimbot","Cleverbot","Superbot","Megabot","All Random","Per-Bot Random"].map((h,D)=>e.jsx("option",{value:D-0+1,children:h},h))})]})]}),e.jsxs(ge,{children:[e.jsxs($,{children:[e.jsx(q,{htmlFor:"scenario",children:"Scenario"}),e.jsx(K,{id:"scenario",value:x,onChange:h=>v(h.target.value),children:S.map(({value:h,label:D})=>e.jsx("option",{value:h,children:D},h))})]}),e.jsxs($,{children:[e.jsx(q,{htmlFor:"objectCount",children:"Number of Objects"}),e.jsx(K,{id:"objectCount",value:c,onChange:h=>r(h.target.value),disabled:j,children:Kt.map(({label:h,amount:D,isMax:T})=>e.jsx("option",{value:`${D}|${T}`,children:h},h))})]})]}),e.jsxs(ge,{children:[e.jsxs($,{children:[e.jsx(q,{htmlFor:"stationSize",children:"Station Size"}),e.jsx(K,{id:"stationSize",value:d,onChange:h=>p(h.target.value),children:qt.map((h,D)=>e.jsx("option",{value:D-0+1,children:h},h))})]}),e.jsxs($,{children:[e.jsx(q,{htmlFor:"stationCount",children:"Station Count"}),e.jsx(K,{id:"stationCount",value:b,onChange:h=>u(h.target.value),children:Jt.map(h=>e.jsx("option",{value:h,children:h},h))})]})]})]}),e.jsx(B,{style:{marginTop:"30px"},onClick:I,children:"Start Game"})]})},Qt=(t,n)=>{t.style.setProperty("--ui-top",`${n.top}px`),t.style.setProperty("--ui-right",`${n.right}px`),t.style.setProperty("--ui-bottom",`${n.bottom}px`),t.style.setProperty("--ui-left",`${n.left}px`)},en=()=>{const t=window.innerWidth,n=window.innerHeight,s=t>n;return!(Math.min(t,n)<900)||!s?{top:0,right:0,bottom:50,left:0}:{top:0,right:50,bottom:0,left:50}},tn=()=>{i.useLayoutEffect(()=>{const t=document.getElementById("game-container");if(!t)return;const n=()=>Qt(t,en());n();const s=()=>n();return window.addEventListener("resize",s),window.addEventListener("orientationchange",s),()=>{window.removeEventListener("resize",s),window.removeEventListener("orientationchange",s)}},[])};function ye(t){const{position:n,title:s,items:o,onSelect:a,menuRef:l,width:c=240}=t;return n?e.jsxs("div",{ref:l,style:{position:"fixed",left:n.x,top:n.y,border:"1px solid #999",background:"white",padding:6,zIndex:999,width:c},children:[e.jsx("div",{style:{marginBottom:6,fontWeight:600},children:s}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:o.map((r,d)=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>a(r.value),children:r.label})},r.label+String(d)))})]}):null}const nn=(t,n,s)=>{i.useEffect(()=>{if(!s)return;const o=a=>{const l=a.target;t.some(r=>r.current!=null&&r.current.contains(l))||n()};return window.addEventListener("mousedown",o),()=>{window.removeEventListener("mousedown",o)}},[t,n,s])},We=(t,n,s)=>Math.max(n,Math.min(s,t)),tt=t=>{const{position:n,getBounds:s,onMove:o}=t,a=i.useRef(!1),l=i.useRef({dx:0,dy:0}),c=i.useRef(o),r=i.useRef(s);return c.current=o,r.current=s,i.useEffect(()=>{const p=u=>{if(!a.current)return;const{minX:x,minY:v,maxX:R,maxY:y}=r.current(),S=We(u.clientX-l.current.dx,x,R),j=We(u.clientY-l.current.dy,v,y);c.current(S,j)},b=()=>{a.current=!1};return window.addEventListener("mousemove",p),window.addEventListener("mouseup",b),()=>{window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",b)}},[]),{onMouseDown:p=>{a.current=!0,l.current={dx:p.clientX-n.x,dy:p.clientY-n.y},p.preventDefault(),p.stopPropagation()}}},V=(t,n,s)=>Math.max(n,Math.min(s,t)),sn=(t,n)=>{if(typeof n=="number"){const s=t.trim();if(s==="")return"";const o=Number(s);return Number.isFinite(o)?o:n}return t},De=()=>{const t=document.getElementById("phaser-root");if(!t)return null;const n=t.querySelector("canvas");return n?n.getBoundingClientRect():null},on=(t,n)=>{const s=De();if(!s)return{x:t,y:n};const o=s.width/_e,a=s.height/Ie;return{x:s.left+t*o,y:s.top+n*a}},Ue=(t,n=220,s=140)=>{const o=De();if(!o)return{x:8,y:8};const a=o.width/_e,l=o.height/Ie,c=o.left+t.x*a,r=o.top+t.y*l,d=8,p=window.innerWidth-n-d,b=window.innerHeight-s-d;return{x:V(c,d,p),y:V(r,d,b)}},G=8,Ye=5,rn=(t,n,s,o,a)=>{const l=De();if(!l)return{x:G,y:G};const c=l.width/_e,r=l.height/Ie,d=l.left+t*c,p=l.top+n*r,b=p+s*r,u=d-o/2,x=window.innerWidth-o-G,R=V(u,G,x),y=b+Ye,S=p-s*r-Ye-a,j=y+a>window.innerHeight-G,I=S<G;let h;return j&&!I?h=S:I&&!j?h=y:j&&I?h=V(y,G,window.innerHeight-a-G):h=y,{x:R,y:V(h,G,window.innerHeight-a-G)}},nt=360,ve=260,je=35,ln=["NONE","DEATHBEAM"],Ce=270,st=160,an=()=>Object.entries(Ae).filter(([,t])=>!ln.includes(t)).filter(([,t])=>isNaN(Number(t))).map(([,t])=>({label:t,value:Ae[t]})),ue=6,cn=t=>{const{position:n,eid:s,initialAngle:o,initialPower:a,onFire:l,onCancel:c,onMove:r}=t,[d,p]=i.useState(o),[b,u]=i.useState(a),x=i.useCallback(()=>({minX:ue,minY:ue,maxX:window.innerWidth-Ce-ue,maxY:window.innerHeight-st-ue}),[]),{onMouseDown:v}=tt({position:n,getBounds:x,onMove:r}),R=i.useCallback(()=>{E.emit(k.ANGLE_POWER_UI,{angle:d,power:b})},[d,b]);return i.useEffect(()=>{R()},[d,b,R]),i.useEffect(()=>{const y=({angle:S,power:j})=>{p(Math.trunc(S)),u(Math.trunc(j))};return E.on(k.ANGLE_POWER_GAME,y),()=>{E.off(k.ANGLE_POWER_GAME,y)}},[]),e.jsxs("div",{style:{position:"fixed",left:n.x,top:n.y,width:Ce,border:"1px solid #999",background:"white",padding:0,zIndex:999,display:"flex",flexDirection:"column"},children:[e.jsx("div",{onMouseDown:v,style:{cursor:"move",userSelect:"none",padding:"6px 8px",borderBottom:"1px solid #ddd",fontWeight:600},children:"Fire shot"}),e.jsxs("div",{style:{padding:8},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6},children:[e.jsx("span",{style:{width:44},children:"Angle"}),e.jsx("input",{type:"range",min:-180,max:180,value:d,onChange:y=>p(Number(y.target.value)),style:{flex:1}}),e.jsxs("span",{style:{minWidth:36,textAlign:"right"},children:[d,"°"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8},children:[e.jsx("span",{style:{width:44},children:"Power"}),e.jsx("input",{type:"range",min:20,max:100,value:b,onChange:y=>u(Number(y.target.value)),style:{flex:1}}),e.jsxs("span",{style:{minWidth:36,textAlign:"right"},children:[b,"%"]})]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx("button",{type:"button",onClick:()=>l(s,d,b),children:"Fire"}),e.jsx("button",{type:"button",onClick:c,children:"Cancel"})]})]})]})},Xe=(t,n,s)=>Math.max(n,Math.min(s,t)),dn=t=>{const{width:n,height:s,getMinSize:o,getMaxSize:a,onResize:l}=t,c=i.useRef(!1),r=i.useRef({startX:0,startY:0,startW:0,startH:0}),d=i.useRef(o),p=i.useRef(a),b=i.useRef(l);return d.current=o,p.current=a,b.current=l,i.useEffect(()=>{const x=R=>{if(!c.current)return;const y=R.clientX-r.current.startX,S=R.clientY-r.current.startY,{minW:j,minH:I}=d.current(),{maxW:h,maxH:D}=p.current(),T=Xe(r.current.startW+y,j,h),P=Xe(r.current.startH+S,I,D);b.current(T,P)},v=()=>{c.current=!1};return window.addEventListener("mousemove",x),window.addEventListener("mouseup",v),()=>{window.removeEventListener("mousemove",x),window.removeEventListener("mouseup",v)}},[]),{onMouseDown:x=>{c.current=!0,r.current={startX:x.clientX,startY:x.clientY,startW:n,startH:s},x.preventDefault(),x.stopPropagation()}}},pe=6,un=260,pn=t=>{const{win:n,onClose:s,onToggleCollapse:o,onMove:a,onResize:l,onEditProp:c,onRemoveComponent:r}=t,d=n.width??nt,p=n.collapsed?je:n.height??ve,b=()=>({minX:pe,minY:pe,maxX:window.innerWidth-220,maxY:window.innerHeight-40}),{onMouseDown:u}=tt({position:{x:n.x,y:n.y},getBounds:b,onMove:(y,S)=>a(n.eid,y,S)}),x=()=>({minW:un,minH:je}),v=()=>({maxW:window.innerWidth-n.x-pe,maxH:window.innerHeight-n.y-pe}),{onMouseDown:R}=dn({width:d,height:n.collapsed?je:n.height??ve,getMinSize:x,getMaxSize:v,onResize:(y,S)=>l(n.eid,y,S)});return e.jsxs("div",{style:{position:"fixed",left:n.x,top:n.y,width:d,height:p,border:"1px solid #999",background:"white",zIndex:1e3,display:"flex",flexDirection:"column"},children:[e.jsxs("div",{onMouseDown:u,style:{cursor:"move",userSelect:"none",padding:"6px",display:"flex",alignItems:"center",gap:"8px",borderBottom:n.collapsed?"none":"1px solid #ddd"},children:[e.jsxs("div",{style:{flex:1},children:["Inspecting entity ",n.entityName]}),e.jsx("button",{type:"button",onClick:y=>{y.stopPropagation(),o(n.eid)},title:n.collapsed?"Expand":"Collapse",children:"__"}),e.jsx("button",{type:"button",onClick:y=>{y.stopPropagation(),s(n.eid)},title:"Close",children:"X"})]}),!n.collapsed&&e.jsx("div",{style:{padding:"8px",overflow:"auto",flex:1},children:n.components.map(y=>e.jsxs("div",{style:{marginBottom:10},children:[e.jsxs("div",{style:{fontWeight:600,marginBottom:4,display:"flex",alignItems:"center",gap:6},children:[e.jsx("button",{type:"button",onClick:S=>{S.stopPropagation(),r(n.eid,y.key)},title:"Remove component",style:{padding:"0 4px",lineHeight:1,cursor:"pointer",flexShrink:0},children:"x"}),e.jsx("span",{children:y.key})]}),e.jsx("div",{style:{paddingLeft:10},children:Object.entries(y.props??{}).length===0?e.jsx("div",{children:"(no props)"}):Object.entries(y.props).filter(([S])=>S[0]!=="_").map(([S,j])=>{const I=`eid-${n.eid}-${y.key}-${S}`,h=typeof j;if(h==="boolean")return e.jsxs("div",{style:{marginBottom:4},children:[e.jsx("label",{htmlFor:I,style:{marginRight:6},children:S}),e.jsx("input",{id:I,type:"checkbox",checked:!!j,onChange:P=>c(n.eid,y.key,S,P.target.checked)})]},S);const D=h==="number",T=j==null;return e.jsxs("div",{style:{marginBottom:4,display:"flex"},children:[e.jsx("label",{htmlFor:I,style:{display:"inline-block",width:120},children:S}),e.jsx("input",{id:I,type:D?"number":"text",step:S==="rotation"?.01:1,value:T?"":String(j),onChange:P=>c(n.eid,y.key,S,sn(P.target.value,j)),style:{width:200}})]},S)})})]},y.key))}),!n.collapsed&&e.jsx("div",{onMouseDown:R,style:{position:"absolute",right:0,bottom:0,width:14,height:14,cursor:"nwse-resize",userSelect:"none"},title:"Resize"})]})},xn={0:"Tiny",1:"Small",2:"Large",3:"That's no moon"};function hn({position:t,menuRef:n,panel:s,onPanelChange:o,onClose:a}){const l=ot(),[c,r]=i.useState(""),d=i.useMemo(()=>qe(),[s]);if(!t)return null;const p={position:"fixed",left:t.x,top:t.y,border:"1px solid #999",background:"white",padding:6,zIndex:999,minWidth:200},b=e.jsx("button",{type:"button",onClick:()=>o("root"),children:"← Back"});if(s==="root")return e.jsxs("div",{ref:n,style:p,children:[e.jsx("div",{style:{marginBottom:6,fontWeight:600},children:"Options"}),e.jsxs("ul",{style:{margin:0,paddingLeft:18},children:[e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>o("trails"),children:"Trails"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>o("deathstars"),children:"Death stars"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>o("background"),children:"Background"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>o("save"),children:"Save"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>o("load"),children:"Load"})})]})]});if(s==="save"){const u=c.trim();return e.jsxs("div",{ref:n,style:p,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[e.jsx("button",{type:"button",onClick:()=>{r(""),o("root")},children:"← Back"}),e.jsx("span",{style:{marginLeft:6},children:"Save scenario"})]}),e.jsxs("div",{style:{marginBottom:6},children:[e.jsx("label",{style:{display:"block",marginBottom:4},children:"Name"}),e.jsx("input",{type:"text",value:c,onChange:x=>r(x.target.value),placeholder:"Scenario name",style:{width:"100%",boxSizing:"border-box"}})]}),e.jsxs("div",{style:{display:"flex",gap:6,justifyContent:"flex-end"},children:[e.jsx("button",{type:"button",onClick:()=>{r(""),o("root")},children:"Cancel"}),e.jsx("button",{type:"button",disabled:!u,onClick:()=>{u&&(E.emit(C.ED_UI_SAVE_SCENARIO,{name:u}),r(""),a())},children:"OK"})]})]})}if(s==="load")return e.jsxs("div",{ref:n,style:p,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[b,e.jsx("span",{style:{marginLeft:6},children:"Load scenario"})]}),d.length===0?e.jsx("div",{style:{padding:"4px 0",color:"#666"},children:"No saved scenarios"}):e.jsx("ul",{style:{margin:0,paddingLeft:18},children:d.map(u=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>{E.emit(C.ED_UI_LOAD_SCENARIO,{scenarioKey:u}),a()},children:u})},u))})]});if(s==="trails")return e.jsxs("div",{ref:n,style:p,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[b,e.jsx("span",{style:{marginLeft:6},children:"Trails"})]}),e.jsxs("ul",{style:{margin:0,paddingLeft:18},children:[e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>{E.emit(C.ED_UI_CLEAR_TRAILS),l.clearShotHistory(),a()},children:"Clear trails"})}),e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"checkbox",checked:l.persistTrails,onChange:u=>l.setPersistTrails(u.target.checked)}),"Persist trails"]})}),e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"checkbox",checked:l.labelTrails,onChange:u=>l.setLabelTrails(u.target.checked)}),"Label trails"]})})]})]});if(s==="deathstars")return e.jsxs("div",{ref:n,style:p,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[b,e.jsx("span",{style:{marginLeft:6},children:"Death stars"})]}),e.jsxs("ul",{style:{margin:0,paddingLeft:18},children:[e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"checkbox",checked:l.allDestructible,onChange:u=>{const x=u.target.checked;l.setAllDestructible(x),E.emit(C.ED_UI_OPTIONS_ALL_DESTRUCTIBLE,{enabled:x})}}),"All destructible"]})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>o("size"),children:"Size"})})]})]});if(s==="size"){const u=l.deathStarSizeIndex;return e.jsxs("div",{ref:n,style:p,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[b,e.jsx("span",{style:{marginLeft:6},children:"Size"})]}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:[0,1,2,3].map(x=>e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"radio",name:"deathstar-size",checked:u===x,onChange:()=>{l.setDeathStarSizeIndex(x),E.emit(C.ED_UI_OPTIONS_DEATHSTAR_SIZE,{sizeIndex:x})}}),xn[x]]})},x))})]})}if(s==="background"){const u=[{value:oe.NONE,label:"NONE"},{value:oe.STARS,label:"STARS"},{value:oe.DEEPSPACE,label:"DEEPSPACE"},{value:oe.NEBULAR,label:"NEBULAR"}];return e.jsxs("div",{ref:n,style:p,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[b,e.jsx("span",{style:{marginLeft:6},children:"Background"})]}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:u.map(({value:x,label:v})=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>{E.emit(C.ED_UI_OPTIONS_BACKGROUND,{bgType:x}),a()},children:v})},x))})]})}return null}const fn=t=>"#"+(t&16777215).toString(16).padStart(6,"0");function mn({hoverPayload:t}){var r;const n=ot();if(!n.labelTrails||!((r=t==null?void 0:t.entities)!=null&&r.length))return null;const s=t.entities.find(d=>d.name.toUpperCase().includes("DEATHSTAR"));if(!s)return null;const o=n.shotHistoryByDeathStarEid.get(s.eid)??[];if(o.length===0)return null;const{x:a,y:l}=on(t.clickLoc.x,t.clickLoc.y),c={position:"fixed",left:a+12,top:l,border:"1px solid #999",background:"white",padding:"6px 8px",zIndex:998,fontSize:12,maxWidth:200,boxShadow:"0 2px 8px rgba(0,0,0,0.15)"};return e.jsxs("div",{style:c,children:[e.jsx("div",{style:{fontWeight:600,marginBottom:4},children:"Shots"}),e.jsx("ul",{style:{margin:0,paddingLeft:16},children:o.map((d,p)=>e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{style:{display:"inline-block",width:10,height:10,borderRadius:"50%",backgroundColor:fn(d.color),flexShrink:0}}),e.jsxs("span",{children:["angle ",Math.round(d.angle),"°, power ",Math.round(d.power)]})]},p))})]})}const Q=(t,n,s)=>{const o=t.get(n);if(!o)return t;const a=new Map(t);return a.set(n,s(o)),a},gn=()=>{const{setGameState:t}=J(),[n,s]=i.useState(null),[o,a]=i.useState(null),[l,c]=i.useState(null),[r,d]=i.useState(null),[p,b]=i.useState([]),[u,x]=i.useState(null),[v,R]=i.useState(()=>new Map),y=i.useRef(v);y.current=v;const S=i.useRef(u);S.current=u;const[j,I]=i.useState(()=>new Map),[h,D]=i.useState("root"),[T,P]=i.useState(null),A=i.useCallback(()=>{c(null),d(null),b([])},[]);i.useEffect(()=>(E.on(C.ED_ENTITY_CLICKED,f=>{s(f)}),E.on(C.ED_ENTITY_HOVERED,f=>{P(f)}),E.on(C.ED_PH_DELETE_ENTITY,({eid:f})=>{I(m=>{const w=new Map(m);return w.delete(f),w}),A()}),E.on(C.ED_FIRE_MODE_EXITED,()=>{const f=S.current;f&&R(m=>{const w=new Map(m);return w.set(f.eid,f.panelPosition),w}),x(null)}),E.on(C.ED_FIRE_SHOT_READY,f=>{const w=y.current.get(f.eid)??rn(f.x,f.y,f.indicatorRadius,Ce,st);x({eid:f.eid,x:f.x,y:f.y,indicatorRadius:f.indicatorRadius,initialAngle:f.initialAngle,initialPower:f.initialPower,panelPosition:w})}),E.on(C.ED_PH_COMPONENT_REMOVED,({eid:f,name:m,components:w})=>{I(M=>Q(M,f,N=>({...N,entityName:m,components:w})))}),E.on(C.ED_SCENARIO_LOADED,()=>{I(()=>new Map),A()}),()=>{E.off(C.ED_ENTITY_CLICKED),E.off(C.ED_ENTITY_HOVERED),E.off(C.ED_PH_DELETE_ENTITY),E.off(C.ED_FIRE_MODE_EXITED),E.off(C.ED_FIRE_SHOT_READY),E.off(C.ED_PH_COMPONENT_REMOVED),E.off(C.ED_SCENARIO_LOADED)}),[A]);const te=i.useRef(null),Z=i.useRef(null),W=i.useRef(null),ne=i.useRef(null);nn([W,ne],A,l!==null),i.useEffect(()=>{if(!n)return;const{clickLoc:f,entities:m}=n;if(A(),!m||m.length===0){s(null);return}const w=m.length>1?Ue(f,240,200):Ue(f,160,140);d(w),m.length===1?(a(m[0]),c("actions")):(b(m),c("select")),s(null)},[n,A]);const se=i.useCallback(f=>{I(m=>{if(m.has(f.eid))return m;const w=new Map(m),M=r??{x:20,y:20};return w.set(f.eid,{eid:f.eid,entityName:f.name,components:JSON.parse(JSON.stringify(f.components??[])),x:V(M.x+20,6,window.innerWidth-240),y:V(M.y+20,6,window.innerHeight-60),collapsed:!1,width:nt,height:ve}),c(null),w})},[r]),ke=i.useCallback(f=>{const m=S.current;m&&R(w=>{const M=new Map(w);return M.set(m.eid,m.panelPosition),M}),x(null),f()},[]),rt=i.useCallback(()=>{var m;const f=(m=te.current)==null?void 0:m.getBoundingClientRect();f&&(d({x:f.left,y:f.bottom+4}),c("addEntity"))},[]),lt=i.useCallback(()=>{var m;const f=(m=Z.current)==null?void 0:m.getBoundingClientRect();f&&(d({x:f.left,y:f.bottom+4}),c("options"),D("root"))},[]),at=i.useCallback(f=>{a(f),c("actions")},[]),ct=i.useMemo(()=>an(),[]),dt=()=>{var f,m,w;if(!r||l!=="select"&&l!=="actions"&&l!=="addEntity"&&l!=="options")return null;if(l==="select")return e.jsx(ye,{position:r,title:"Select entity",items:p.map(M=>({label:M.name,value:M})),onSelect:at,menuRef:W,width:240});if(l==="actions"&&o){const M=o.name.includes("DEATHSTAR"),N=(f=o.components)==null?void 0:f.find(L=>L.key==="Position"),U=((m=N==null?void 0:N.props)==null?void 0:m.x)??0,ie=((w=N==null?void 0:N.props)==null?void 0:w.y)??0,fe=[{label:"Move",value:"move"},{label:"Inspect",value:"inspect"},...M?[{label:"Fire shot",value:"fireshot"}]:[],{label:"Delete",value:"delete"}];return e.jsx(ye,{position:r,title:o.name,items:fe,onSelect:L=>{L==="inspect"?se(o):L==="delete"?E.emit(C.ED_UI_DELETE_ENTITY,{eid:o.eid}):L==="move"?E.emit(C.ED_UI_START_MOVE_ENTITY,{eid:o.eid}):L==="fireshot"&&E.emit(C.ED_UI_START_FIRE_SHOT,{eid:o.eid,x:U,y:ie}),A()},menuRef:W,width:160})}return l==="addEntity"?e.jsx(ye,{position:r,title:"Add entity",items:ct,onSelect:M=>{E.emit(C.ED_UI_START_PLACE_ENTITY,{objectType:M}),A()},menuRef:W,width:240}):l==="options"?e.jsx(hn,{position:r,menuRef:ne,panel:h,onPanelChange:D,onClose:A}):null},ut=i.useMemo(()=>Array.from(j.values()),[j]),pt=i.useCallback(()=>{t(_.MAIN_MENU)},[t]);return e.jsx(In,{children:e.jsxs("div",{children:[e.jsx("button",{onClick:pt,children:"back"}),e.jsx("button",{ref:te,onClick:rt,children:"add"}),e.jsx("button",{ref:Z,onClick:lt,children:"options"}),dt(),e.jsx(mn,{hoverPayload:T}),u!=null&&e.jsx(cn,{position:u.panelPosition,eid:u.eid,initialAngle:u.initialAngle,initialPower:u.initialPower,onFire:(f,m,w)=>{ke(()=>{E.emit(C.ED_UI_FIRE_SHOT_CONFIRM,{eid:f,angle:m,power:w})})},onCancel:()=>{ke(()=>{E.emit(C.ED_UI_FIRE_SHOT_CANCEL)})},onMove:(f,m)=>x(w=>w!=null?{...w,panelPosition:{x:f,y:m}}:null)}),ut.map(f=>e.jsx(pn,{win:f,onClose:m=>{I(w=>{if(!w.has(m))return w;const M=new Map(w);return M.delete(m),M})},onToggleCollapse:m=>{I(w=>Q(w,m,M=>({...M,collapsed:!M.collapsed})))},onMove:(m,w,M)=>{I(N=>Q(N,m,U=>({...U,x:w,y:M})))},onResize:(m,w,M)=>{I(N=>Q(N,m,U=>({...U,width:w,height:M})))},onEditProp:(m,w,M,N)=>{I(U=>Q(U,m,ie=>{const fe=ie.components.map((L,xt)=>L.key!==w?L:(E.emit(C.ED_UI_PROP_CHANGED,{eid:m,compIdx:xt,propName:M,newVal:N}),{...L,props:{...L.props??{},[M]:N}}));return{...ie,components:fe}}))},onRemoveComponent:(m,w)=>{E.emit(C.ED_UI_REMOVE_COMPONENT,{eid:m,compKey:w})}},f.eid))]})})},bn={persistTrails:!1,labelTrails:!1,allDestructible:!0,deathStarSizeIndex:1,removedDestructibleEids:new Set,shotHistoryByDeathStarEid:new Map};let O={...bn},he=0;const Me=new Set;let xe=null,Ve=-1;const $e=()=>(Ve===he&&xe!==null||(Ve=he,xe={...O,_v:he}),xe),En=t=>(Me.add(t),()=>{Me.delete(t)}),ee=()=>{he+=1,Me.forEach(t=>t())},Nn=()=>O.persistTrails,yn=t=>{O.persistTrails=t,ee()},On=()=>O.labelTrails,jn=t=>{O.labelTrails=t,ee()},wn=t=>{O.allDestructible=t,ee()},Pn=()=>O.deathStarSizeIndex,Sn=t=>{O.deathStarSizeIndex=t,ee()},Ln=()=>O.removedDestructibleEids,vn=t=>{O.removedDestructibleEids.add(t)},Cn=()=>{O.removedDestructibleEids.clear()},Bn=t=>O.shotHistoryByDeathStarEid.get(t)??[],Mn=()=>{O.shotHistoryByDeathStarEid.clear()},_n=(t,n,s,o)=>{let a=O.shotHistoryByDeathStarEid.get(t);a||(a=[],O.shotHistoryByDeathStarEid.set(t,a)),a.push({angle:n,power:s,color:o}),ee()},it=i.createContext(null),In=({children:t})=>{const n=i.useSyncExternalStore(En,$e,$e),{_v:s,...o}=n,a=i.useCallback(v=>{yn(v)},[]),l=i.useCallback(v=>{jn(v)},[]),c=i.useCallback(v=>{wn(v)},[]),r=i.useCallback(v=>{Sn(v)},[]),d=i.useCallback(v=>{vn(v)},[]),p=i.useCallback(()=>{Cn()},[]),b=i.useCallback(()=>{Mn()},[]),u=i.useCallback((v,R,y,S)=>{_n(v,R,y,S)},[]),x={...o,setPersistTrails:a,setLabelTrails:l,setAllDestructible:c,setDeathStarSizeIndex:r,addRemovedDestructibleEid:d,clearRemovedDestructibleEids:p,clearShotHistory:b,recordShot:u};return e.jsx(it.Provider,{value:x,children:t})},ot=()=>{const t=i.useContext(it);if(t==null)throw new Error("useEditorOptions must be used within EditorOptionsProvider");return t},Rn=()=>{tn();const{gameState:t}=J();return e.jsxs(e.Fragment,{children:[t===_.MAIN_MENU&&e.jsx(Ut,{}),t===_.CONFIG_GAME&&e.jsx(Zt,{}),t===_.INGAME&&e.jsx(Xt,{}),t===_.SCORESCREEN&&e.jsx($t,{}),t===_.EDITOR&&e.jsx(gn,{})]})},Gn=()=>e.jsx(Ht,{children:e.jsx(Rn,{})}),Dn=()=>{{const t=document.createElement("script");t.async=!0,t.src="https://www.googletagmanager.com/gtag/js?id=G-8VGDCHXJ84",document.head.appendChild(t);const n=document.createElement("script");n.innerHTML=`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-8VGDCHXJ84');
    `,document.head.appendChild(n)}};Dn();export{Gn as W,Ln as a,vn as b,Cn as c,On as d,Bn as e,Pn as f,Nn as g,_n as r};

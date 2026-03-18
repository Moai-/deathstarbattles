const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/game-app-Do4Pz8z0.js","assets/other-vendor-CQiTX5cC.js","assets/phaser-core-UqVUGhlF.js","assets/phaser-extras-BGc8xhKk.js","assets/react-vendor-B52gqvOY.js"])))=>i.map(i=>d[i]);
import{r as o,j as e}from"./react-vendor-B52gqvOY.js";import{g as j,G as T,A as Q,O as Se,a as yt,l as st,m as bt,c as jt,b as Et,p as Pe,B as De,d as Ne,e as Be,u as wt,r as St,f as vt,h as Ct,E as C,i as ue}from"./game-app-Do4Pz8z0.js";import"./other-vendor-CQiTX5cC.js";import{c as g,F as kt,a as Mt,b as It,d as _t,e as Me,f as At,g as We,G as Rt,h as Tt,r as Dt,S as Nt}from"./ui-vendor-ClbfLyMU.js";const Ie=t=>{const n=document.getElementById("game-container");n&&(t===void 0&&(document.fullscreenElement?Ge():Fe(n)),t===!0?Fe(n):Ge())},Fe=t=>{t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.msRequestFullscreen&&t.msRequestFullscreen()},Ge=()=>{document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()},Lt=g.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: black;
`,Le=g.div`
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
`;g(Le)`
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
`;const Ot=g.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;g.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 30px;
`;const He=g.div`
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
`;const it=g.div`
  position: absolute;
  top: 10px;
  left: 10px;
`,Pt=g.div`
  position: absolute;
  top: 10px;
  right: 10px;
`,Bt=g.div`
  position: absolute;
  top: 10px;
  right: 60px;
`,Wt=g.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`,Ft=g.div`
  flex-direction: column;
  display: flex;
`,Gt=g(Le)`
  width: 570px;
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
`;g(Ot)`
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
`;const Ht=g.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
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
`;const oe=g.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`,F=g.button`
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
`,X=g(F)`
  padding: 4px 8px;
  margin: 4px;
  font-size: 12px;
  text-shadow: none;
  box-shadow: none;
  border: 1px solid #00ffff;
`,ee=g(F)`
  padding: 4px;
  font-size: 16px;
  width: 32px;
  height: 32px;
`;g(F)`
  position: absolute;
  right: -30px;
  top: 55px;
  border-radius: 0 5px 5px 0;
  padding: 6px 8px;
`;const xe=g(F)`
  border-radius: 0 5px 5px 0;
  padding: 0;
  width: 25px;
  height: 25px;
`,he=g.input.attrs({type:"range"})`
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
`;g(X)`
  margin-top: 10px;
`;g(ee)``;const ot=g.div`
  position: absolute;
  width: 50px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`,zt=g(ot)`
  left: 0;
`,Ut=g(ot)`
  right: 0;
`,Yt=g.div`
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0;
  display: flex;
`,ze=g(F)`
  padding: 0 10px;
`,V=g.div`
  flex: 0;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`,pe=g.div`
  flex: 0;
  display: flex;
  padding: 10px;
`,Ue=g.div`
  flex: 1;
  display: flex;
`,rt=g.h1`
  color: #ffffff;
  margin: 0 0 10px 0;
  font-size: 36px;
  text-align: center;
`,lt=g.h2`
  color: #ffffff;
  margin: 0 0 20px 0;
  font-size: 18px;
  text-align: center;
  opacity: 1; /* Fully opaque */
`,Ye=g.h3`
  color: #ffffff;
  margin: 0 10px 20px 10px;
  font-size: 14px;
  text-align: justify;
  opacity: 1; /* Fully opaque */
`,fe=g.span`
  color: #fff;
  font-size: 12px;
  margin-left: 5px;
`,$t=g(rt)`
  font-size: 32px;
  margin-bottom: 10px;
`;g(lt)`
  text-align: left;
  margin-bottom: 10px;
`;const Xt="0.9.1",Vt={version:Xt};var I=(t=>(t[t.FIRST_START=0]="FIRST_START",t[t.MAIN_MENU=1]="MAIN_MENU",t[t.CONFIG_GAME=2]="CONFIG_GAME",t[t.INGAME=3]="INGAME",t[t.SCORESCREEN=4]="SCORESCREEN",t[t.EDITOR=5]="EDITOR",t))(I||{});const qt="modulepreload",Kt=function(t){return"/"+t},$e={},ve=function(n,s,i){let r=Promise.resolve();if(s&&s.length>0){let a=function(x){return Promise.all(x.map(m=>Promise.resolve(m).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),p=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));r=a(s.map(x=>{if(x=Kt(x),x in $e)return;$e[x]=!0;const m=x.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${x}"]${u}`))return;const h=document.createElement("link");if(h.rel=m?"stylesheet":qt,m||(h.as="script"),h.crossOrigin="",h.href=x,p&&h.setAttribute("nonce",p),document.head.appendChild(h),m)return new Promise((S,A)=>{h.addEventListener("load",S),h.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${x}`)))})}))}function l(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return r.then(a=>{for(const c of a||[])c.status==="rejected"&&l(c.reason);return n().catch(l)})};class Jt{constructor(){this.appPromise=null,this.loading=!0,this.loadCallback=()=>{}}async loadApp(){return this.loading,this.appPromise||(this.appPromise=(async()=>{await ve(()=>import("./phaser-core-UqVUGhlF.js"),[]),await ve(()=>import("./phaser-extras-BGc8xhKk.js"),[]);const n=await ve(()=>import("./game-app-Do4Pz8z0.js").then(s=>s.j),__vite__mapDeps([0,1,2,3,4]));return this.loading&&(this.loadCallback(),this.loadCallback=()=>{}),this.loading=!1,n.App})()),this.appPromise}setLoadCallback(n){this.loadCallback=n}async createGame(){return(await this.loadApp()).createGame()}async destroyGame(){return(await this.loadApp()).destroyGame()}async startMode(n,s){return(await this.loadApp()).startMode(n,s)}async stopMode(n){return(await this.loadApp()).stopMode(n)}}const z=new Jt,Xe=[I.MAIN_MENU,I.CONFIG_GAME],at=o.createContext(void 0),Zt=({children:t})=>{const[n,s]=o.useState(I.FIRST_START),[i,r]=o.useState(null),[l,a]=o.useState(null),[c,p]=o.useState(!0),x=async(m,u)=>{if(Xe.includes(m)||await z.stopMode(Q.BACKGROUND),m!==I.EDITOR&&await z.stopMode(Q.EDITOR),m!==I.INGAME&&(await z.stopMode(Q.GAME),j.off(T.GAME_END)),m===I.INGAME){const h=u||l;if(!h)throw new Error("Tried to start game without game config");j.on(T.GAME_END,S=>{const A=S[0];r(A),x(I.SCORESCREEN),j.off(T.GAME_END)}),a(h),z.startMode(Q.GAME,h)}m===I.EDITOR&&z.startMode(Q.EDITOR),Xe.includes(m)&&(n===I.FIRST_START?z.createGame().then(()=>z.startMode(Q.BACKGROUND)):z.startMode(Q.BACKGROUND)),s(m)};return o.useEffect(()=>{n===I.FIRST_START&&(z.setLoadCallback(()=>{j.once(T.GAME_LOADED,()=>{p(!1)})}),x(I.MAIN_MENU))}),e.jsx(at.Provider,{value:{isLoading:c,gameState:n,setGameState:x,winnerData:i,lastConfig:l},children:t})},ie=()=>{const t=o.useContext(at);if(!t)throw new Error("useGameState must be used within GameStateProvider");return t},Qt=()=>{const[t,n]=o.useState(!0);return{setMute:i=>{n(i),j.emit(T.SET_VOLUME,{mute:i})},muted:t}},en=`
Take turns to fire at each other by adjusting the angle and the power using the sliders or the firing control. When you are happy with the angle and power, press the end turn button to let the next player go. All players' shots will then be fired. All shots are affected by the gravity of stars and planets. If things get sticky, the hyperspace button will transport you to a random location. The last surviving station wins. Watch bots go at it in fullscreen with the top-right button!
`,tn=()=>{const{setGameState:t}=ie(),{muted:n,setMute:s}=Qt(),[i,r]=o.useState(!1),l=n?It:_t,a=i?kt:Mt,c=()=>s(!n),p=()=>{const x=!i;r(x),Ie(x)};return i?e.jsx(it,{children:e.jsx(ee,{onClick:p,children:e.jsx(a,{})})}):e.jsxs(Le,{style:{padding:"50px 0"},children:[e.jsx(Pt,{children:e.jsx(ee,{onClick:p,children:e.jsx(a,{})})}),e.jsx(Bt,{children:e.jsx(ee,{onClick:c,children:e.jsx(l,{})})}),e.jsx(rt,{children:"Death Star Battles"}),e.jsxs(lt,{children:["© 2001 Ian Bolland // © 2025 Sergei Gmyria // v.",Vt.version]}),e.jsx(Ye,{children:en}),e.jsxs(Ye,{children:[e.jsx("a",{href:"https://github.com/Moai-/deathstarbattles",target:"_blank",children:"Github Repo"})," | ",e.jsx("a",{href:"http://deathstarbattles.co.uk",target:"_blank",children:"Original Website"})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(F,{onClick:()=>t(I.CONFIG_GAME),children:"New game"}),e.jsx(F,{onClick:()=>t(I.EDITOR),children:"Editor"})]})]})},nn=()=>{const[t,n]=o.useState(!1),[s,i]=o.useState(!1);return o.useLayoutEffect(()=>{const r=window.innerWidth,l=window.innerHeight;n(r>l),i(Math.min(r,l)<900)},[]),{isLandscape:t,isMobile:s}},sn=()=>{const{isMobile:t,isLandscape:n}=nn(),[s,i]=o.useState(90),[r,l]=o.useState(50),[a,c]=o.useState(!1),[p,x]=o.useState(!1),{setGameState:m}=ie();o.useEffect(()=>{p&&(x(!1),j.emit(T.ANGLE_POWER_UI,{angle:s,power:r}))},[p]),o.useEffect(()=>(j.on(T.ANGLE_POWER_GAME,({angle:b,power:v})=>{i(Math.trunc(b)),l(Math.trunc(v))}),j.on(T.OTHER_ACTION_GAME,b=>{b===Se.HYPERSPACE?c(!0):b||c(!1)}),()=>{j.off(T.ANGLE_POWER_GAME),j.off(T.OTHER_ACTION_GAME)}),[]);const u=(b,v,N,D)=>{b(k=>Math.min(D,Math.max(N,k+v))),x(!0)},h=b=>{i(b),j.emit(T.ANGLE_POWER_UI,{angle:b,power:r})},S=b=>{l(b),j.emit(T.ANGLE_POWER_UI,{angle:s,power:b})},A=()=>j.emit(T.END_TURN),E=()=>{a?(c(!1),j.emit(T.OTHER_ACTION_UI,Se.NONE)):(c(!0),j.emit(T.OTHER_ACTION_UI,Se.HYPERSPACE))},_=()=>{m(I.MAIN_MENU)};return t&&n?e.jsxs(e.Fragment,{children:[e.jsxs(zt,{children:[e.jsx(V,{children:e.jsx(xe,{onClick:_,children:e.jsx(Me,{size:15})})}),e.jsxs(V,{children:[e.jsxs(fe,{children:[s,"°"]}),e.jsx(X,{onClick:()=>u(i,1,-180,180),disabled:a,children:"+"})]}),e.jsx(Ue,{children:e.jsx(he,{$isVertical:!0,min:-180,max:180,value:Math.floor(s),onChange:b=>h(Number(b.target.value)),disabled:a})}),e.jsx(V,{children:e.jsx(X,{onClick:()=>u(i,-1,-180,180),disabled:a,children:"-"})}),e.jsx(V,{children:e.jsx(xe,{onClick:A,children:e.jsx(At,{size:15})})})]}),e.jsxs(Ut,{children:[e.jsx(V,{children:e.jsx(xe,{onClick:()=>Ie(),children:e.jsx(We,{size:15})})}),e.jsxs(V,{children:[e.jsxs(fe,{children:[r,"%"]}),e.jsx(X,{onClick:()=>u(l,-1,20,100),disabled:a,children:"-"})]}),e.jsx(Ue,{children:e.jsx(he,{$isVertical:!0,min:20,max:100,value:Math.floor(r),onChange:b=>S(Number(b.target.value)),disabled:a})}),e.jsx(V,{children:e.jsx(X,{onClick:()=>u(l,1,20,100),disabled:a,children:"+"})}),e.jsx(V,{children:e.jsx(xe,{onClick:E,children:a?e.jsx(Rt,{size:15}):e.jsx(Tt,{size:15})})})]})]}):e.jsxs(Yt,{children:[e.jsx(pe,{children:e.jsx(ze,{onClick:A,children:"End Turn"})}),e.jsx(pe,{children:e.jsxs(ze,{onClick:E,children:["Hyperspace",a?" [On] ":" [Off]"]})}),e.jsxs(He,{children:[e.jsx(X,{onClick:()=>u(i,-1,-180,180),disabled:a,children:"-"}),e.jsx(he,{min:-180,max:180,value:Math.floor(s),onChange:b=>h(Number(b.target.value)),disabled:a}),e.jsx(X,{onClick:()=>u(i,1,-180,180),disabled:a,children:"+"}),e.jsxs(fe,{children:["Angle: ",s,"°"]})]}),e.jsxs(He,{children:[e.jsxs(fe,{children:["Power: ",r,"%"]}),e.jsx(X,{onClick:()=>u(l,-1,20,100),disabled:a,children:"-"}),e.jsx(he,{min:20,max:100,value:Math.floor(r),onChange:b=>S(Number(b.target.value)),disabled:a}),e.jsx(X,{onClick:()=>u(l,1,20,100),disabled:a,children:"+"})]}),e.jsx(pe,{children:e.jsx(ee,{onClick:()=>Ie(),children:e.jsx(We,{})})}),e.jsx(pe,{children:e.jsx(ee,{onClick:_,children:e.jsx(Me,{})})})]})},on=t=>`#${t.toString(16).padStart(6,"0")}`,rn=()=>{const{setGameState:t,winnerData:n}=ie(),s=()=>{if(!n)return e.jsx("h1",{style:{color:"white"},children:"Nobody won! Total annihilation!"});const{playerId:i,col:r}=n;return e.jsxs("h1",{style:{color:on(r)},children:["Player ",i," wins!"]})};return e.jsx(Wt,{children:e.jsxs(Ft,{children:[s(),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(F,{onClick:()=>t(I.MAIN_MENU),children:"Menu"}),e.jsx(F,{onClick:()=>t(I.INGAME),children:"Play again"}),e.jsx(F,{onClick:()=>t(I.CONFIG_GAME),children:"Change settings"})]})]})})},U=g.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`,Y=g.label`
  font-size: 14px;
  color: #00ffff;
`,$=g.select`
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
`,Ve=["Tiny","Small","Large","That's no moon"],ln=[{label:"5",amount:5,isMax:!1},{label:"10",amount:10,isMax:!1},{label:"15",amount:15,isMax:!1},{label:"20",amount:20,isMax:!1},{label:"25",amount:25,isMax:!1},{label:"30",amount:30,isMax:!1},{label:"Up to 10",amount:10,isMax:!0},{label:"Up to 20",amount:20,isMax:!0},{label:"Up to 30",amount:30,isMax:!0}],qe=[1,2,3,4],an=g.div`
  display: flex;
  width: 100%;
  gap: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #00ffff40;
`,Ke=g.button`
  padding: 10px 20px;
  font-size: 14px;
  background: ${t=>t.$active?"#00ffff22":"transparent"};
  color: #00ffff;
  border: 1px solid ${t=>t.$active?"#00ffff":"transparent"};
  border-bottom: ${t=>t.$active?"1px solid transparent":"none"};
  margin-bottom: -1px;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  outline: none;
  &:hover {
    background: #00ffff18;
  }
`,cn=()=>{const{setGameState:t}=ie(),[n,s]=o.useState("generated"),[i,r]=o.useState("7"),[l,a]=o.useState("3"),[c,p]=o.useState("10"),[x,m]=o.useState("2"),[u,h]=o.useState("1"),[S,A]=o.useState("0"),[E,_]=o.useState(""),b=yt({random:jt(Math.random)}),v=o.useMemo(()=>st(),[]),N=o.useMemo(()=>b.map(({name:d},R)=>({value:String(R),label:d})),[b]),D=o.useMemo(()=>v.map(d=>({value:bt(d),label:d})),[v]),k=D.length>0&&!D.some(d=>d.value===E)?D[0].value:E,q=()=>{const d=[],R=parseInt(i,10),G=parseInt(l,10),K=parseInt(x);d.push({id:0,type:0,difficulty:0,col:Pe[0]});for(let B=0;B<R;B++)d.push({id:0,type:1,difficulty:G,col:Pe[B+1]});if(n==="saved"){const B=k;if(!B)return;t(I.INGAME,{justBots:!1,players:d,stationSize:K,stationPerPlayer:Number(u),savedScenario:Et(B)})}else{const[B,J]=c.split("|"),ne=parseInt(B,10),se=J==="true",Ee=parseInt(S,10),ce=b[Ee];t(I.INGAME,{justBots:!1,players:d,maxItems:se?ne:void 0,numItems:se?void 0:ne,background:ce.background,itemRules:ce.items,stationSize:K,stationPerPlayer:Number(u)})}},P=n!=="saved"||D.length>0;return e.jsxs(Gt,{children:[e.jsx(it,{children:e.jsx(ee,{onClick:()=>t(I.MAIN_MENU),children:e.jsx(Me,{})})}),e.jsx($t,{children:"Game Setup"}),e.jsxs(an,{children:[e.jsx(Ke,{$active:n==="generated",onClick:()=>s("generated"),children:"Generated scenarios"}),e.jsx(Ke,{$active:n==="saved",onClick:()=>s("saved"),children:"Saved scenarios"})]}),e.jsxs(Ht,{children:[e.jsxs(oe,{children:[e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"botCount",children:"Number of Bots"}),e.jsx($,{id:"botCount",value:i,onChange:d=>r(d.target.value),children:[1,2,3,4,5,6,7,8,9,10,11].map(d=>e.jsx("option",{value:d,children:d},d))})]}),e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"difficulty",children:"Bot Difficulty"}),e.jsx($,{id:"difficulty",value:l,onChange:d=>a(d.target.value),children:["Failbot","Aimbot","Cleverbot","Superbot","Megabot","All Random","Per-Bot Random"].map((d,R)=>e.jsx("option",{value:R-0+1,children:d},d))})]})]}),n==="generated"?e.jsxs(oe,{children:[e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"scenario",children:"Scenario"}),e.jsx($,{id:"scenario",value:S,onChange:d=>A(d.target.value),children:N.map(({value:d,label:R})=>e.jsx("option",{value:d,children:R},d))})]}),e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"objectCount",children:"Number of Objects"}),e.jsx($,{id:"objectCount",value:c,onChange:d=>p(d.target.value),children:ln.map(({label:d,amount:R,isMax:G})=>e.jsx("option",{value:`${R}|${G}`,children:d},d))})]})]}):e.jsxs(oe,{children:[e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"savedScenario",children:"Scenario"}),e.jsx($,{id:"savedScenario",value:k,onChange:d=>_(d.target.value),children:D.length===0?e.jsx("option",{value:"",children:"No saved scenarios"}):D.map(({value:d,label:R})=>e.jsx("option",{value:d,children:R},d))})]}),e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"stationSize",children:"Station Size"}),e.jsx($,{id:"stationSize",value:x,onChange:d=>m(d.target.value),children:Ve.map((d,R)=>e.jsx("option",{value:R-0+1,children:d},d))})]})]}),n==="generated"?e.jsxs(oe,{children:[e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"stationSize",children:"Station Size"}),e.jsx($,{id:"stationSize",value:x,onChange:d=>m(d.target.value),children:Ve.map((d,R)=>e.jsx("option",{value:R-0+1,children:d},d))})]}),e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"stationCount",children:"Station Count"}),e.jsx($,{id:"stationCount",value:u,onChange:d=>h(d.target.value),children:qe.map(d=>e.jsx("option",{value:d,children:d},d))})]})]}):e.jsx(oe,{children:e.jsxs(U,{children:[e.jsx(Y,{htmlFor:"stationCount",children:"Station Count"}),e.jsx($,{id:"stationCount",value:u,onChange:d=>h(d.target.value),children:qe.map(d=>e.jsx("option",{value:d,children:d},d))})]})})]}),e.jsx(F,{style:{marginTop:"30px"},onClick:q,disabled:n==="saved"&&!P,children:"Start Game"})]})},dn=(t,n)=>{t.style.setProperty("--ui-top",`${n.top}px`),t.style.setProperty("--ui-right",`${n.right}px`),t.style.setProperty("--ui-bottom",`${n.bottom}px`),t.style.setProperty("--ui-left",`${n.left}px`)},un=()=>{const t=window.innerWidth,n=window.innerHeight,s=t>n;return!(Math.min(t,n)<900)||!s?{top:0,right:0,bottom:50,left:0}:{top:0,right:50,bottom:0,left:50}},xn=()=>{o.useLayoutEffect(()=>{const t=document.getElementById("game-container");if(!t)return;const n=()=>dn(t,un());n();const s=()=>n();return window.addEventListener("resize",s),window.addEventListener("orientationchange",s),()=>{window.removeEventListener("resize",s),window.removeEventListener("orientationchange",s)}},[])};function Ce(t){const{position:n,title:s,items:i,onSelect:r,menuRef:l,width:a=240}=t;return n?e.jsxs("div",{ref:l,style:{position:"fixed",left:n.x,top:n.y,border:"1px solid #999",background:"white",padding:6,zIndex:999,width:a},children:[e.jsx("div",{style:{marginBottom:6,fontWeight:600},children:s}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:i.map((c,p)=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>r(c.value),children:c.label})},c.label+String(p)))})]}):null}const hn=(t,n,s)=>{o.useEffect(()=>{if(!s)return;const i=r=>{const l=r.target;t.some(c=>c.current!=null&&c.current.contains(l))||n()};return window.addEventListener("mousedown",i),()=>{window.removeEventListener("mousedown",i)}},[t,n,s])},Je=(t,n,s)=>Math.max(n,Math.min(s,t)),ct=t=>{const{position:n,getBounds:s,onMove:i}=t,r=o.useRef(!1),l=o.useRef({dx:0,dy:0}),a=o.useRef(i),c=o.useRef(s);return a.current=i,c.current=s,o.useEffect(()=>{const x=u=>{if(!r.current)return;const{minX:h,minY:S,maxX:A,maxY:E}=c.current(),_=Je(u.clientX-l.current.dx,h,A),b=Je(u.clientY-l.current.dy,S,E);a.current(_,b)},m=()=>{r.current=!1};return window.addEventListener("mousemove",x),window.addEventListener("mouseup",m),()=>{window.removeEventListener("mousemove",x),window.removeEventListener("mouseup",m)}},[]),{onMouseDown:x=>{r.current=!0,l.current={dx:x.clientX-n.x,dy:x.clientY-n.y},x.preventDefault(),x.stopPropagation()}}},te=(t,n,s)=>Math.max(n,Math.min(s,t)),pn=(t,n)=>{if(typeof n=="number"){const s=t.trim();if(s==="")return"";const i=Number(s);return Number.isFinite(i)?i:n}return t},Oe=()=>{const t=document.getElementById("phaser-root");if(!t)return null;const n=t.querySelector("canvas");return n?n.getBoundingClientRect():null},fn=(t,n)=>{const s=Oe();if(!s)return{x:t,y:n};const i=s.width/De,r=s.height/Ne;return{x:s.left+t*i,y:s.top+n*r}},Ze=(t,n=220,s=140)=>{const i=Oe();if(!i)return{x:8,y:8};const r=i.width/De,l=i.height/Ne,a=i.left+t.x*r,c=i.top+t.y*l,p=8,x=window.innerWidth-n-p,m=window.innerHeight-s-p;return{x:te(a,p,x),y:te(c,p,m)}},H=8,Qe=5,gn=(t,n,s,i,r)=>{const l=Oe();if(!l)return{x:H,y:H};const a=l.width/De,c=l.height/Ne,p=l.left+t*a,x=l.top+n*c,m=x+s*c,u=p-i/2,h=window.innerWidth-i-H,A=te(u,H,h),E=m+Qe,_=x-s*c-Qe-r,b=E+r>window.innerHeight-H,v=_<H;let N;return b&&!v?N=_:v&&!b?N=E:b&&v?N=te(E,H,window.innerHeight-r-H):N=E,{x:A,y:te(N,H,window.innerHeight-r-H)}},dt=360,_e=260,ke=35,mn=["NONE","DEATHBEAM"],Ae=270,ut=160,yn=()=>Object.entries(Be).filter(([,t])=>!mn.includes(t)).filter(([,t])=>isNaN(Number(t))).map(([,t])=>({label:t,value:Be[t]})),ge=6,bn=t=>{const{position:n,eid:s,initialAngle:i,initialPower:r,onFire:l,onCancel:a,onMove:c}=t,[p,x]=o.useState(i),[m,u]=o.useState(r),h=o.useCallback(()=>({minX:ge,minY:ge,maxX:window.innerWidth-Ae-ge,maxY:window.innerHeight-ut-ge}),[]),{onMouseDown:S}=ct({position:n,getBounds:h,onMove:c}),A=o.useCallback(()=>{j.emit(T.ANGLE_POWER_UI,{angle:p,power:m})},[p,m]);return o.useEffect(()=>{A()},[p,m,A]),o.useEffect(()=>{const E=({angle:_,power:b})=>{x(Math.trunc(_)),u(Math.trunc(b))};return j.on(T.ANGLE_POWER_GAME,E),()=>{j.off(T.ANGLE_POWER_GAME,E)}},[]),e.jsxs("div",{style:{position:"fixed",left:n.x,top:n.y,width:Ae,border:"1px solid #999",background:"white",padding:0,zIndex:999,display:"flex",flexDirection:"column"},children:[e.jsx("div",{onMouseDown:S,style:{cursor:"move",userSelect:"none",padding:"6px 8px",borderBottom:"1px solid #ddd",fontWeight:600},children:"Fire shot"}),e.jsxs("div",{style:{padding:8},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6},children:[e.jsx("span",{style:{width:44},children:"Angle"}),e.jsx("input",{type:"range",min:-180,max:180,value:p,onChange:E=>x(Number(E.target.value)),style:{flex:1}}),e.jsxs("span",{style:{minWidth:36,textAlign:"right"},children:[p,"°"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8},children:[e.jsx("span",{style:{width:44},children:"Power"}),e.jsx("input",{type:"range",min:20,max:100,value:m,onChange:E=>u(Number(E.target.value)),style:{flex:1}}),e.jsxs("span",{style:{minWidth:36,textAlign:"right"},children:[m,"%"]})]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx("button",{type:"button",onClick:()=>l(s,p,m),children:"Fire"}),e.jsx("button",{type:"button",onClick:a,children:"Cancel"})]})]})]})},et=(t,n,s)=>Math.max(n,Math.min(s,t)),jn=t=>{const{width:n,height:s,getMinSize:i,getMaxSize:r,onResize:l}=t,a=o.useRef(!1),c=o.useRef({startX:0,startY:0,startW:0,startH:0}),p=o.useRef(i),x=o.useRef(r),m=o.useRef(l);return p.current=i,x.current=r,m.current=l,o.useEffect(()=>{const h=A=>{if(!a.current)return;const E=A.clientX-c.current.startX,_=A.clientY-c.current.startY,{minW:b,minH:v}=p.current(),{maxW:N,maxH:D}=x.current(),k=et(c.current.startW+E,b,N),q=et(c.current.startH+_,v,D);m.current(k,q)},S=()=>{a.current=!1};return window.addEventListener("mousemove",h),window.addEventListener("mouseup",S),()=>{window.removeEventListener("mousemove",h),window.removeEventListener("mouseup",S)}},[]),{onMouseDown:h=>{a.current=!0,c.current={startX:h.clientX,startY:h.clientY,startW:n,startH:s},h.preventDefault(),h.stopPropagation()}}},je=({propKey:t,id:n,input:s,description:i})=>e.jsxs("div",{style:{marginBottom:4,display:"flex",maxWidth:380},children:[e.jsx("label",{htmlFor:n,style:{display:"inline-block",width:170},title:i,children:t}),s]},t),Re=t=>t==null,En=(t,n)=>{if(typeof n!="number")return t;let s=t;if(typeof t=="string"){const r=parseFloat(t);if(isNaN(r))return t;s=r}const i=parseInt(`1${new Array(n).fill(0).join("")}`,10);return(Math.round(s*i)/i).toFixed(n)},re=({step:t,precision:n,propKey:s,description:i,id:r,value:l,onChange:a})=>e.jsx(je,{id:r,propKey:s,description:i,input:e.jsx("input",{id:r,type:"number",step:t??1,value:Re(l)?"":String(En(l,n)),onChange:c=>a(c.target.value,l),style:{width:150}})}),wn=({propKey:t,description:n,id:s,enumValues:i,value:r,onChange:l})=>e.jsx(je,{id:s,propKey:t,description:n,input:e.jsx("select",{style:{width:160},id:s,value:r??"",onChange:a=>l(a.target.value,r),children:i==null?void 0:i.map(a=>e.jsx("option",{value:a.value,children:a.label},a.value))})}),Sn=({propKey:t,description:n,id:s,value:i,onChange:r})=>e.jsx(je,{id:s,propKey:t,description:n,input:e.jsx(vn,{colour:i,onChange:l=>r(String(l),i)})}),vn=({colour:t,onChange:n})=>{const[s,i]=o.useState(!1),r=typeof t=="string"?parseInt(t,10):t===null?0:t,l=wt(r),a=Dt(l),c=()=>{i(!s)};return e.jsxs("div",{style:{width:160,position:"relative"},children:[e.jsx("div",{onClick:c,style:{height:20,width:20,margin:1,borderRadius:5,backgroundColor:a,float:"right"}}),s&&e.jsx("div",{style:{position:"absolute",top:"100%",right:1},children:e.jsx(Nt,{color:a,disableAlpha:!0,onChange:p=>n(St(p.rgb).num())})})]})},Cn=({step:t,propKey:n,description:s,id:i,value:r,onChange:l})=>e.jsx(je,{id:i,propKey:n,description:s,input:e.jsxs("div",{style:{display:"flex",flexDirection:"row",width:150},children:[e.jsx("input",{id:i,type:"range",min:"-180",max:"180",step:t??.5,value:Re(r)?"":String((typeof r=="number"?r:parseInt(r,10))*(180/Math.PI)),onChange:a=>l(String(parseInt(a.target.value,10)*(Math.PI/180)),r),style:{width:120}}),e.jsxs("span",{children:[Re(r)?"":String(Math.round((typeof r=="number"?r:parseInt(r,10))*(180/Math.PI))),"º"]})]})}),kn={number:re,slider:re,colour:Sn,enum:wn,time:re,entity:re,angle:Cn,checkbox:re},me=6,Mn=260,In=t=>{const{win:n,onClose:s,onToggleCollapse:i,onMove:r,onResize:l,onEditProp:a,onRemoveComponent:c}=t,p=n.width??dt,x=n.collapsed?ke:n.height??_e,m=()=>({minX:me,minY:me,maxX:window.innerWidth-220,maxY:window.innerHeight-40}),{onMouseDown:u}=ct({position:{x:n.x,y:n.y},getBounds:m,onMove:(E,_)=>r(n.eid,E,_)}),h=()=>({minW:Mn,minH:ke}),S=()=>({maxW:window.innerWidth-n.x-me,maxH:window.innerHeight-n.y-me}),{onMouseDown:A}=jn({width:p,height:n.collapsed?ke:n.height??_e,getMinSize:h,getMaxSize:S,onResize:(E,_)=>l(n.eid,E,_)});return e.jsxs("div",{style:{position:"fixed",left:n.x,top:n.y,width:p,height:x,border:"1px solid #999",background:"white",zIndex:1e3,display:"flex",flexDirection:"column"},children:[e.jsxs("div",{onMouseDown:u,style:{cursor:"move",userSelect:"none",padding:"6px",display:"flex",alignItems:"center",gap:"8px",borderBottom:n.collapsed?"none":"1px solid #ddd"},children:[e.jsxs("div",{style:{flex:1},children:["Inspecting entity ",n.entityName]}),e.jsx("button",{type:"button",onClick:E=>{E.stopPropagation(),i(n.eid)},title:n.collapsed?"Expand":"Collapse",children:"__"}),e.jsx("button",{type:"button",onClick:E=>{E.stopPropagation(),s(n.eid)},title:"Close",children:"X"})]}),e.jsx("div",{style:{padding:8},children:e.jsx("span",{children:"Hover over component or property names to find out more about what they are or what they do."})}),!n.collapsed&&e.jsx("div",{style:{padding:8,overflow:"auto",flex:1},children:n.components.map(E=>{const _=vt(E.key),b=_&&Ct(_);return e.jsxs("div",{style:{marginBottom:10},children:[e.jsxs("div",{style:{fontWeight:600,marginBottom:4,display:"flex",alignItems:"center",gap:6},children:[e.jsx("button",{type:"button",onClick:v=>{v.stopPropagation(),c(n.eid,E.key)},title:"Remove component",style:{padding:"0 4px",lineHeight:1,cursor:"pointer",flexShrink:0},children:"x"}),e.jsx("span",{title:(b==null?void 0:b.description)??E.key,children:E.key})]}),e.jsx("div",{style:{paddingLeft:10},children:Object.entries(E.props??{}).length===0?e.jsx("div",{children:"(no props)"}):Object.entries(E.props).filter(([v])=>v[0]!=="_").map(([v,N])=>{var J;const D=`eid-${n.eid}-${E.key}-${v}`,k=(J=b==null?void 0:b.props)==null?void 0:J[v],q=k==null?void 0:k.control,P=(k==null?void 0:k.label)??v,d=(k==null?void 0:k.description)??v,R=k==null?void 0:k.precision,G=(k==null?void 0:k.step)??1,K=(k==null?void 0:k.enumOptions)??[],B=kn[q??"number"];return e.jsx(B,{precision:R,step:G,enumValues:K,id:D,propKey:P,description:d,value:N,onChange:(ne,se)=>a(n.eid,E.key,v,pn(ne,se))},D)})})]},(b==null?void 0:b.name)??E.key)})}),!n.collapsed&&e.jsx("div",{onMouseDown:A,style:{position:"absolute",right:0,bottom:0,width:14,height:14,cursor:"nwse-resize",userSelect:"none"},title:"Resize"})]})},_n={0:"Tiny",1:"Small",2:"Large",3:"That's no moon"};function An({position:t,menuRef:n,panel:s,onPanelChange:i,onClose:r}){const l=ht(),[a,c]=o.useState(""),p=o.useMemo(()=>st(),[s]);if(!t)return null;const x={position:"fixed",left:t.x,top:t.y,border:"1px solid #999",background:"white",padding:6,zIndex:999,minWidth:200},m=e.jsx("button",{type:"button",onClick:()=>i("root"),children:"← Back"});if(s==="root")return e.jsxs("div",{ref:n,style:x,children:[e.jsx("div",{style:{marginBottom:6,fontWeight:600},children:"Options"}),e.jsxs("ul",{style:{margin:0,paddingLeft:18},children:[e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>i("trails"),children:"Trails"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>i("deathstars"),children:"Death stars"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>i("background"),children:"Background"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>i("save"),children:"Save"})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>i("load"),children:"Load"})})]})]});if(s==="save"){const u=a.trim();return e.jsxs("div",{ref:n,style:x,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[e.jsx("button",{type:"button",onClick:()=>{c(""),i("root")},children:"← Back"}),e.jsx("span",{style:{marginLeft:6},children:"Save scenario"})]}),e.jsxs("div",{style:{marginBottom:6},children:[e.jsx("label",{style:{display:"block",marginBottom:4},children:"Name"}),e.jsx("input",{type:"text",value:a,onChange:h=>c(h.target.value),placeholder:"Scenario name",style:{width:"100%",boxSizing:"border-box"}})]}),e.jsxs("div",{style:{display:"flex",gap:6,justifyContent:"flex-end"},children:[e.jsx("button",{type:"button",onClick:()=>{c(""),i("root")},children:"Cancel"}),e.jsx("button",{type:"button",disabled:!u,onClick:()=>{u&&(j.emit(C.ED_UI_SAVE_SCENARIO,{name:u}),c(""),r())},children:"OK"})]})]})}if(s==="load")return e.jsxs("div",{ref:n,style:x,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[m,e.jsx("span",{style:{marginLeft:6},children:"Load scenario"})]}),p.length===0?e.jsx("div",{style:{padding:"4px 0",color:"#666"},children:"No saved scenarios"}):e.jsx("ul",{style:{margin:0,paddingLeft:18},children:p.map(u=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>{j.emit(C.ED_UI_LOAD_SCENARIO,{scenarioKey:u}),r()},children:u})},u))})]});if(s==="trails")return e.jsxs("div",{ref:n,style:x,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[m,e.jsx("span",{style:{marginLeft:6},children:"Trails"})]}),e.jsxs("ul",{style:{margin:0,paddingLeft:18},children:[e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>{j.emit(C.ED_UI_CLEAR_TRAILS),l.clearShotHistory(),r()},children:"Clear trails"})}),e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"checkbox",checked:l.persistTrails,onChange:u=>l.setPersistTrails(u.target.checked)}),"Persist trails"]})}),e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"checkbox",checked:l.labelTrails,onChange:u=>l.setLabelTrails(u.target.checked)}),"Label trails"]})})]})]});if(s==="deathstars")return e.jsxs("div",{ref:n,style:x,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[m,e.jsx("span",{style:{marginLeft:6},children:"Death stars"})]}),e.jsxs("ul",{style:{margin:0,paddingLeft:18},children:[e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"checkbox",checked:l.allDestructible,onChange:u=>{const h=u.target.checked;l.setAllDestructible(h),j.emit(C.ED_UI_OPTIONS_ALL_DESTRUCTIBLE,{enabled:h})}}),"All destructible"]})}),e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>i("size"),children:"Size"})})]})]});if(s==="size"){const u=l.deathStarSizeIndex;return e.jsxs("div",{ref:n,style:x,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[m,e.jsx("span",{style:{marginLeft:6},children:"Size"})]}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:[0,1,2,3].map(h=>e.jsx("li",{children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("input",{type:"radio",name:"deathstar-size",checked:u===h,onChange:()=>{l.setDeathStarSizeIndex(h),j.emit(C.ED_UI_OPTIONS_DEATHSTAR_SIZE,{sizeIndex:h})}}),_n[h]]})},h))})]})}if(s==="background"){const u=[{value:ue.NONE,label:"NONE"},{value:ue.STARS,label:"STARS"},{value:ue.DEEPSPACE,label:"DEEPSPACE"},{value:ue.NEBULAR,label:"NEBULAR"}];return e.jsxs("div",{ref:n,style:x,children:[e.jsxs("div",{style:{marginBottom:6,fontWeight:600},children:[m,e.jsx("span",{style:{marginLeft:6},children:"Background"})]}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:u.map(({value:h,label:S})=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>{j.emit(C.ED_UI_OPTIONS_BACKGROUND,{bgType:h}),r()},children:S})},h))})]})}return null}const Rn=t=>"#"+(t&16777215).toString(16).padStart(6,"0");function Tn({hoverPayload:t}){var c;const n=ht();if(!n.labelTrails||!((c=t==null?void 0:t.entities)!=null&&c.length))return null;const s=t.entities.find(p=>p.name.toUpperCase().includes("DEATHSTAR"));if(!s)return null;const i=n.shotHistoryByDeathStarEid.get(s.eid)??[];if(i.length===0)return null;const{x:r,y:l}=fn(t.clickLoc.x,t.clickLoc.y),a={position:"fixed",left:r+12,top:l,border:"1px solid #999",background:"white",padding:"6px 8px",zIndex:998,fontSize:12,maxWidth:200,boxShadow:"0 2px 8px rgba(0,0,0,0.15)"};return e.jsxs("div",{style:a,children:[e.jsx("div",{style:{fontWeight:600,marginBottom:4},children:"Shots"}),e.jsx("ul",{style:{margin:0,paddingLeft:16},children:i.map((p,x)=>e.jsxs("li",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{style:{display:"inline-block",width:10,height:10,borderRadius:"50%",backgroundColor:Rn(p.color),flexShrink:0}}),e.jsxs("span",{children:["angle ",Math.round(p.angle),"°, power ",Math.round(p.power)]})]},x))})]})}const le=(t,n,s)=>{const i=t.get(n);if(!i)return t;const r=new Map(t);return r.set(n,s(i)),r},Dn=()=>{const{setGameState:t}=ie(),[n,s]=o.useState(null),[i,r]=o.useState(null),[l,a]=o.useState(null),[c,p]=o.useState(null),[x,m]=o.useState([]),[u,h]=o.useState(null),[S,A]=o.useState(()=>new Map),E=o.useRef(S);E.current=S;const _=o.useRef(u);_.current=u;const[b,v]=o.useState(()=>new Map),[N,D]=o.useState("root"),[k,q]=o.useState(null),P=o.useCallback(()=>{a(null),p(null),m([])},[]);o.useEffect(()=>(j.on(C.ED_ENTITY_CLICKED,f=>{s(f)}),j.on(C.ED_ENTITY_HOVERED,f=>{q(f)}),j.on(C.ED_PH_DELETE_ENTITY,({eid:f})=>{v(y=>{const w=new Map(y);return w.delete(f),w}),P()}),j.on(C.ED_FIRE_MODE_EXITED,()=>{const f=_.current;f&&A(y=>{const w=new Map(y);return w.set(f.eid,f.panelPosition),w}),h(null)}),j.on(C.ED_FIRE_SHOT_READY,f=>{const w=E.current.get(f.eid)??gn(f.x,f.y,f.indicatorRadius,Ae,ut);h({eid:f.eid,x:f.x,y:f.y,indicatorRadius:f.indicatorRadius,initialAngle:f.initialAngle,initialPower:f.initialPower,panelPosition:w})}),j.on(C.ED_PH_COMPONENT_REMOVED,({eid:f,name:y,components:w})=>{v(M=>le(M,f,L=>({...L,entityName:y,components:w})))}),j.on(C.ED_SCENARIO_LOADED,()=>{v(()=>new Map),P()}),()=>{j.off(C.ED_ENTITY_CLICKED),j.off(C.ED_ENTITY_HOVERED),j.off(C.ED_PH_DELETE_ENTITY),j.off(C.ED_FIRE_MODE_EXITED),j.off(C.ED_FIRE_SHOT_READY),j.off(C.ED_PH_COMPONENT_REMOVED),j.off(C.ED_SCENARIO_LOADED)}),[P]);const d=o.useRef(null),R=o.useRef(null),G=o.useRef(null),K=o.useRef(null);hn([G,K],P,l!==null),o.useEffect(()=>{if(!n)return;const{clickLoc:f,entities:y}=n;if(P(),!y||y.length===0){s(null);return}const w=y.length>1?Ze(f,240,200):Ze(f,160,140);p(w),y.length===1?(r(y[0]),a("actions")):(m(y),a("select")),s(null)},[n,P]);const B=o.useCallback(f=>{v(y=>{if(y.has(f.eid))return y;const w=new Map(y),M=c??{x:20,y:20};return w.set(f.eid,{eid:f.eid,entityName:f.name,components:JSON.parse(JSON.stringify(f.components??[])),x:te(M.x+20,6,window.innerWidth-240),y:te(M.y+20,6,window.innerHeight-60),collapsed:!1,width:dt,height:_e}),a(null),w})},[c]),J=o.useCallback(f=>{const y=_.current;y&&A(w=>{const M=new Map(w);return M.set(y.eid,y.panelPosition),M}),h(null),f()},[]),ne=o.useCallback(()=>{var y;const f=(y=d.current)==null?void 0:y.getBoundingClientRect();f&&(p({x:f.left,y:f.bottom+4}),a("addEntity"))},[]),se=o.useCallback(()=>{var y;const f=(y=R.current)==null?void 0:y.getBoundingClientRect();f&&(p({x:f.left,y:f.bottom+4}),a("options"),D("root"))},[]),Ee=o.useCallback(f=>{r(f),a("actions")},[]),ce=o.useMemo(()=>yn(),[]),pt=()=>{var f,y,w;if(!c||l!=="select"&&l!=="actions"&&l!=="addEntity"&&l!=="options")return null;if(l==="select")return e.jsx(Ce,{position:c,title:"Select entity",items:x.map(M=>({label:M.name,value:M})),onSelect:Ee,menuRef:G,width:240});if(l==="actions"&&i){const M=i.name.includes("DEATHSTAR"),L=(f=i.components)==null?void 0:f.find(W=>W.key==="Position"),Z=((y=L==null?void 0:L.props)==null?void 0:y.x)??0,de=((w=L==null?void 0:L.props)==null?void 0:w.y)??0,we=[{label:"Move",value:"move"},{label:"Inspect",value:"inspect"},...M?[{label:"Fire shot",value:"fireshot"}]:[],{label:"Delete",value:"delete"}];return e.jsx(Ce,{position:c,title:i.name,items:we,onSelect:W=>{W==="inspect"?B(i):W==="delete"?j.emit(C.ED_UI_DELETE_ENTITY,{eid:i.eid}):W==="move"?j.emit(C.ED_UI_START_MOVE_ENTITY,{eid:i.eid}):W==="fireshot"&&j.emit(C.ED_UI_START_FIRE_SHOT,{eid:i.eid,x:Z,y:de}),P()},menuRef:G,width:160})}return l==="addEntity"?e.jsx(Ce,{position:c,title:"Add entity",items:ce,onSelect:M=>{j.emit(C.ED_UI_START_PLACE_ENTITY,{objectType:M}),P()},menuRef:G,width:240}):l==="options"?e.jsx(An,{position:c,menuRef:K,panel:N,onPanelChange:D,onClose:P}):null},ft=o.useMemo(()=>Array.from(b.values()),[b]),gt=o.useCallback(()=>{t(I.MAIN_MENU)},[t]);return e.jsx(Un,{children:e.jsxs("div",{children:[e.jsx("button",{onClick:gt,children:"back"}),e.jsx("button",{ref:d,onClick:ne,children:"add"}),e.jsx("button",{ref:R,onClick:se,children:"options"}),pt(),e.jsx(Tn,{hoverPayload:k}),u!=null&&e.jsx(bn,{position:u.panelPosition,eid:u.eid,initialAngle:u.initialAngle,initialPower:u.initialPower,onFire:(f,y,w)=>{J(()=>{j.emit(C.ED_UI_FIRE_SHOT_CONFIRM,{eid:f,angle:y,power:w})})},onCancel:()=>{J(()=>{j.emit(C.ED_UI_FIRE_SHOT_CANCEL)})},onMove:(f,y)=>h(w=>w!=null?{...w,panelPosition:{x:f,y}}:null)}),ft.map(f=>e.jsx(In,{win:f,onClose:y=>{v(w=>{if(!w.has(y))return w;const M=new Map(w);return M.delete(y),M})},onToggleCollapse:y=>{v(w=>le(w,y,M=>({...M,collapsed:!M.collapsed})))},onMove:(y,w,M)=>{v(L=>le(L,y,Z=>({...Z,x:w,y:M})))},onResize:(y,w,M)=>{v(L=>le(L,y,Z=>({...Z,width:w,height:M})))},onEditProp:(y,w,M,L)=>{v(Z=>le(Z,y,de=>{const we=de.components.map((W,mt)=>W.key!==w?W:(j.emit(C.ED_UI_PROP_CHANGED,{eid:y,compIdx:mt,propName:M,newVal:L}),{...W,props:{...W.props??{},[M]:L}}));return{...de,components:we}}))},onRemoveComponent:(y,w)=>{j.emit(C.ED_UI_REMOVE_COMPONENT,{eid:y,compKey:w})}},f.eid))]})})},Nn={persistTrails:!1,labelTrails:!1,allDestructible:!0,deathStarSizeIndex:1,removedDestructibleEids:new Set,shotHistoryByDeathStarEid:new Map};let O={...Nn},be=0;const Te=new Set;let ye=null,tt=-1;const nt=()=>(tt===be&&ye!==null||(tt=be,ye={...O,_v:be}),ye),Ln=t=>(Te.add(t),()=>{Te.delete(t)}),ae=()=>{be+=1,Te.forEach(t=>t())},Zn=()=>O.persistTrails,On=t=>{O.persistTrails=t,ae()},Qn=()=>O.labelTrails,Pn=t=>{O.labelTrails=t,ae()},Bn=t=>{O.allDestructible=t,ae()},es=()=>O.deathStarSizeIndex,Wn=t=>{O.deathStarSizeIndex=t,ae()},ts=()=>O.removedDestructibleEids,Fn=t=>{O.removedDestructibleEids.add(t)},Gn=()=>{O.removedDestructibleEids.clear()},ns=t=>O.shotHistoryByDeathStarEid.get(t)??[],Hn=()=>{O.shotHistoryByDeathStarEid.clear()},zn=(t,n,s,i)=>{let r=O.shotHistoryByDeathStarEid.get(t);r||(r=[],O.shotHistoryByDeathStarEid.set(t,r)),r.push({angle:n,power:s,color:i}),ae()},xt=o.createContext(null),Un=({children:t})=>{const n=o.useSyncExternalStore(Ln,nt,nt),{_v:s,...i}=n,r=o.useCallback(S=>{On(S)},[]),l=o.useCallback(S=>{Pn(S)},[]),a=o.useCallback(S=>{Bn(S)},[]),c=o.useCallback(S=>{Wn(S)},[]),p=o.useCallback(S=>{Fn(S)},[]),x=o.useCallback(()=>{Gn()},[]),m=o.useCallback(()=>{Hn()},[]),u=o.useCallback((S,A,E,_)=>{zn(S,A,E,_)},[]),h={...i,setPersistTrails:r,setLabelTrails:l,setAllDestructible:a,setDeathStarSizeIndex:c,addRemovedDestructibleEid:p,clearRemovedDestructibleEids:x,clearShotHistory:m,recordShot:u};return e.jsx(xt.Provider,{value:h,children:t})},ht=()=>{const t=o.useContext(xt);if(t==null)throw new Error("useEditorOptions must be used within EditorOptionsProvider");return t},Yn=()=>e.jsx(Lt,{children:e.jsxs("svg",{className:"loadingSplashSvg",viewBox:"0 0 800 450",xmlns:"http://www.w3.org/2000/svg","aria-label":"Death Star Battles loading screen",children:[e.jsx("rect",{width:"800",height:"450",fill:"#06080d"}),e.jsxs("g",{fill:"#cfd6e0",opacity:"0.9",children:[e.jsx("rect",{x:"210",y:"80",width:"2",height:"2"}),e.jsx("rect",{x:"300",y:"145",width:"2",height:"2"}),e.jsx("rect",{x:"390",y:"70",width:"2",height:"2"}),e.jsx("rect",{x:"615",y:"105",width:"2",height:"2"}),e.jsx("rect",{x:"680",y:"210",width:"2",height:"2"}),e.jsx("rect",{x:"720",y:"320",width:"2",height:"2"}),e.jsx("rect",{x:"560",y:"355",width:"2",height:"2"})]}),e.jsxs("g",{transform:"translate(640 95)",className:"heroStar",children:[e.jsx("circle",{r:"18",fill:"#dce6ff",opacity:"0.06"}),e.jsx("circle",{r:"10",fill:"#dce6ff",opacity:"0.12"}),e.jsx("circle",{r:"4.5",fill:"#ffffff",opacity:"0.95"}),e.jsx("path",{d:"M -22 0 H 22",stroke:"#dce6ff",strokeWidth:"1.5",opacity:"0.35"}),e.jsx("path",{d:"M 0 -22 V 22",stroke:"#dce6ff",strokeWidth:"1.5",opacity:"0.35"}),e.jsx("path",{d:"M -15 -15 L 15 15",stroke:"#dce6ff",strokeWidth:"1",opacity:"0.2"}),e.jsx("path",{d:"M -15 15 L 15 -15",stroke:"#dce6ff",strokeWidth:"1",opacity:"0.2"})]}),e.jsxs("g",{transform:"translate(-150 285)",children:[e.jsx("circle",{r:"250",fill:"#767d86"}),e.jsx("circle",{r:"247",fill:"none",stroke:"#98a1ab",strokeWidth:"5",opacity:"0.35"}),e.jsx("ellipse",{cx:"45",cy:"10",rx:"180",ry:"228",fill:"#000000",opacity:"0.12"}),e.jsx("ellipse",{cx:"-55",cy:"-25",rx:"120",ry:"170",fill:"#ffffff",opacity:"0.04"}),e.jsxs("g",{children:[e.jsx("path",{d:"M -160 -14 H 208",stroke:"#2b2f36",strokeWidth:"18",opacity:"0.16",strokeLinecap:"round"}),e.jsx("path",{d:"M -165 -6 H 212",stroke:"#4b515a",strokeWidth:"11",opacity:"0.9",strokeLinecap:"round"}),e.jsx("path",{d:"M -158 2 H 205",stroke:"#8f98a3",strokeWidth:"3",opacity:"0.22",strokeLinecap:"round"}),e.jsx("path",{d:"M -162 -6 H 209",stroke:"#2f333a",strokeWidth:"4",opacity:"0.55",strokeLinecap:"round"}),e.jsx("path",{d:"M 188 -6 C 214 -8, 232 2, 241 18",stroke:"#3a3f47",strokeWidth:"8",opacity:"0.55",fill:"none",strokeLinecap:"round"}),e.jsx("path",{d:"M 191 -2 C 212 0, 226 9, 234 22",stroke:"#8e97a1",strokeWidth:"2",opacity:"0.18",fill:"none",strokeLinecap:"round"})]}),e.jsxs("g",{opacity:"0.42",children:[e.jsx("rect",{x:"-40",y:"-150",width:"42",height:"8",fill:"#5b616a",rx:"2"}),e.jsx("rect",{x:"10",y:"-148",width:"28",height:"6",fill:"#666d76",rx:"2"}),e.jsx("rect",{x:"48",y:"-154",width:"58",height:"10",fill:"#5b616a",rx:"2"}),e.jsx("rect",{x:"116",y:"-149",width:"24",height:"7",fill:"#666d76",rx:"2"}),e.jsx("rect",{x:"-82",y:"-92",width:"52",height:"9",fill:"#5a6068",rx:"2"}),e.jsx("rect",{x:"-20",y:"-96",width:"22",height:"16",fill:"#4e545d",rx:"2"}),e.jsx("rect",{x:"14",y:"-91",width:"74",height:"8",fill:"#636a73",rx:"2"}),e.jsx("rect",{x:"98",y:"-95",width:"36",height:"14",fill:"#555b64",rx:"2"}),e.jsx("rect",{x:"145",y:"-90",width:"26",height:"7",fill:"#666d76",rx:"2"}),e.jsx("rect",{x:"92",y:"-48",width:"34",height:"7",fill:"#5b616a",rx:"2"}),e.jsx("rect",{x:"132",y:"-38",width:"22",height:"18",fill:"#4d535b",rx:"2"}),e.jsx("rect",{x:"160",y:"-24",width:"20",height:"7",fill:"#666d76",rx:"2"}),e.jsx("rect",{x:"-60",y:"64",width:"66",height:"8",fill:"#5a6068",rx:"2"}),e.jsx("rect",{x:"18",y:"59",width:"24",height:"16",fill:"#4e545d",rx:"2"}),e.jsx("rect",{x:"54",y:"65",width:"82",height:"8",fill:"#636a73",rx:"2"}),e.jsx("rect",{x:"146",y:"60",width:"28",height:"14",fill:"#555b64",rx:"2"}),e.jsx("rect",{x:"-18",y:"132",width:"52",height:"7",fill:"#5b616a",rx:"2"}),e.jsx("rect",{x:"44",y:"128",width:"30",height:"14",fill:"#4e545d",rx:"2"}),e.jsx("rect",{x:"86",y:"133",width:"40",height:"7",fill:"#666d76",rx:"2"})]}),e.jsxs("g",{opacity:"0.2",children:[e.jsx("path",{d:"M -18 -178 V 176",stroke:"#434952",strokeWidth:"3"}),e.jsx("path",{d:"M 42 -168 V 168",stroke:"#5e6670",strokeWidth:"2"}),e.jsx("path",{d:"M 98 -150 V 148",stroke:"#434952",strokeWidth:"3"})]}),e.jsxs("g",{transform:"translate(185 -85) rotate(-24)",children:[e.jsx("ellipse",{rx:"25",ry:"42",fill:"#4b5058"}),e.jsx("ellipse",{rx:"16",ry:"28",fill:"#353941"}),e.jsx("ellipse",{rx:"7",ry:"13",fill:"#23262c"}),e.jsx("ellipse",{cx:"-8",cy:"-5",rx:"5",ry:"10",fill:"#ffffff",opacity:"0.07"})]}),e.jsxs("g",{className:"dishGlow",children:[e.jsx("circle",{cx:"185",cy:"-85",r:"10",fill:"#79ff8f",opacity:"0.14"}),e.jsx("circle",{cx:"185",cy:"-85",r:"4",fill:"#d7ffe0",opacity:"0.55"})]})]}),e.jsxs("g",{className:"beam",children:[e.jsx("path",{d:"M 38 200 L 860 -150",stroke:"#79ff8f",strokeWidth:"11",strokeLinecap:"round",opacity:"0.75"}),e.jsx("path",{d:"M 38 200 L 860 -150",stroke:"#baffe0",strokeWidth:"4",strokeLinecap:"round",opacity:"0.92"}),e.jsx("path",{d:"M 38 200 L 860 -150",stroke:"#f3fff7",strokeWidth:"1.5",strokeLinecap:"round",opacity:"0.95"})]}),e.jsx("text",{x:"420",y:"405",textAnchor:"middle",fill:"#dbe1ea",fontSize:"34",fontWeight:"700",letterSpacing:"5",style:{fontFamily:"system-ui, sans-serif"},children:"DEATH STAR BATTLES"}),e.jsx("g",{opacity:"0.03",children:Array.from({length:38}).map((t,n)=>e.jsx("rect",{x:"0",y:n*12,width:"800",height:"6",fill:"#ffffff"},n))})]})}),$n=()=>{xn();const{gameState:t,isLoading:n}=ie();return e.jsxs(e.Fragment,{children:[n&&e.jsx(Yn,{}),t===I.MAIN_MENU&&e.jsx(tn,{}),t===I.CONFIG_GAME&&e.jsx(cn,{}),t===I.INGAME&&e.jsx(sn,{}),t===I.SCORESCREEN&&e.jsx(rn,{}),t===I.EDITOR&&e.jsx(Dn,{})]})},ss=()=>e.jsx(Zt,{children:e.jsx($n,{})}),Xn=()=>{{const t=document.createElement("script");t.async=!0,t.src="https://www.googletagmanager.com/gtag/js?id=G-8VGDCHXJ84",document.head.appendChild(t);const n=document.createElement("script");n.innerHTML=`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-8VGDCHXJ84');
    `,document.head.appendChild(n)}};Xn();export{ss as W,ts as a,Fn as b,Gn as c,Qn as d,ns as e,es as f,Zn as g,zn as r};

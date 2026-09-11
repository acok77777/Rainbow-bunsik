const menu={
"떡볶이":{price:3000,recipe:["떡","물","고추장","고춧가루","설탕"],emoji:"🌶️"},
"오뎅":{price:2000,recipe:[],emoji:"🍢"},
"로제떡볶이":{price:4000,recipe:["떡","물","생크림","고추장","고춧가루","설탕"],emoji:"🧀"},
"김말이":{price:2000,recipe:[],emoji:"🥢"},
"야채튀김":{price:2500,recipe:[],emoji:"🥕"},
"고구마튀김":{price:2500,recipe:[],emoji:"🍠"}};

const levels=[
{name:"작은 분식집",need:0},{name:"인기 분식집",need:30000},
{name:"맛집 분식집",need:80000},{name:"동네 최고 맛집",need:150000},
{name:"세아분식 왕국 👑",need:300000}];

const upgrades=[
{id:"pot",icon:"🍲",name:"큰 냄비",price:10000,desc:"조리 속도가 빨라져요"},
{id:"stove",icon:"🔥",name:"좋은 가스레인지",price:20000,desc:"조리 속도가 더 빨라져요"},
{id:"fryer",icon:"🍤",name:"큰 튀김기",price:25000,desc:"튀김이 더 빨리 완성돼요"},
{id:"sign",icon:"🏪",name:"가게 꾸미기",price:30000,desc:"가게 분위기를 업그레이드해요"}];

const defaults={money:0,shopName:"세아분식",order:"떡볶이",ingredients:[],ready:null,fryer:null,currentCustomer:0,upgrades:[]};
let state;
try{state={...defaults,...JSON.parse(localStorage.getItem("seabunsikState")||"{}")}}catch(e){state={...defaults}}
state.ingredients=Array.isArray(state.ingredients)?state.ingredients:[];
state.upgrades=Array.isArray(state.upgrades)?state.upgrades:[];

const $=id=>document.getElementById(id);
const won=n=>Number(n).toLocaleString("ko-KR");
function save(){localStorage.setItem("seabunsikState",JSON.stringify(state))}
function level(){let n=1;levels.forEach((x,i)=>{if(state.money>=x.need)n=i+1});return n}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>$("toast").classList.remove("show"),1800)}

function render(){
 const lv=level(), current=levels[lv-1], next=levels[lv];
 $("shopName").textContent=state.shopName;
 $("money").textContent=won(state.money);
 $("level").textContent=`Lv.${lv} ${current.name}`;
 if(next){
  $("next").textContent=`다음: Lv.${lv+1} ${next.name} — ${won(next.need-state.money)}원 남음`;
  $("progressText").textContent=`${won(state.money)} / ${won(next.need)}원`;
  const pct=Math.max(0,Math.min(100,(state.money-current.need)/(next.need-current.need)*100));
  $("bar").style.width=pct+"%";
 }else{$("next").textContent="👑 최고 레벨 달성!";$("progressText").textContent="최고 레벨 달성!";$("bar").style.width="100%"}
 renderCustomers();
 $("potText").textContent=state.ingredients.length?state.ingredients.join(" → "):"재료를 넣어주세요";
 $("roseText").textContent=state.ingredients.length?state.ingredients.join(" → "):"재료를 넣어주세요";
 $("ready").textContent=state.ready?menu[state.ready].emoji+" "+state.ready:"아직 없어요";
 $("fryerText").textContent=state.fryer?`🔥 ${state.fryer} 조리 중...`:"튀김 메뉴를 선택하세요";
}

function renderCustomers(){
 const orders=Object.keys(menu), faces=["👧🏻","👦🏻","👩🏻","🧒🏻","👨🏻","👩🏼"];
 const names=["세아","민준","지우","하윤","도윤","서윤"];
 $("customers").innerHTML="";
 for(let i=0;i<4;i++){
  const idx=(state.currentCustomer+i)%orders.length, order=orders[idx];
  const d=document.createElement("div");d.className="customer";
  d.innerHTML=`<div class="face">${faces[idx]}</div><b>${names[idx]} 손님</b><div class="order">${menu[order].emoji} ${order}<br><small>${won(menu[order].price)}원</small></div>`;
  d.onclick=()=>{state.order=order;state.ingredients=[];state.ready=null;state.fryer=null;save();render();toast(`${order} 주문 확인!`)}
  $("customers").appendChild(d);
 }
}

document.querySelectorAll("[data-ing]").forEach(b=>b.onclick=()=>{
 const ing=b.dataset.ing, recipe=menu[state.order].recipe;
 if(!recipe.length){toast(`${state.order}은 재료를 넣지 않아요.`);return}
 const expected=recipe[state.ingredients.length];
 if(ing!==expected){toast(`다음 재료는 ${expected}이에요!`);return}
 state.ingredients.push(ing);
 if(state.ingredients.length===recipe.length){state.ready=state.order;toast(`🎉 ${state.order} 완성!`)}
 else toast(`${ing} 넣기 완료!`);
 save();render();
});

document.querySelectorAll("[data-fry]").forEach(b=>b.onclick=()=>{
 const item=b.dataset.fry;
 if(state.order!==item){toast(`현재 손님의 주문은 ${state.order}이에요.`);return}
 state.fryer=item;state.ready=null;save();render();
 setTimeout(()=>{if(state.fryer===item){state.fryer=null;state.ready=item;save();render();toast(`🎉 ${item} 완성!`)}},state.upgrades.includes("fryer")?1200:2200);
});

$("sell").onclick=()=>{
 if(!state.ready){toast("먼저 음식을 완성해주세요!");return}
 if(state.ready!==state.order){toast("주문과 음식이 달라요!");return}
 const p=menu[state.ready].price;state.money+=p;state.ready=null;state.ingredients=[];state.fryer=null;state.currentCustomer++;
 save();render();toast(`💰 ${won(p)}원 획득!`);
};

function modal(html){$("card").innerHTML=html+`<button class="close" onclick="closeModal()">✕</button>`;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}

$("recipe").onclick=()=>modal(`<h2>📖 레시피북</h2><div class="recipe">
<div><b>🌶️ 떡볶이</b><p>떡 + 물 + 고추장 + 고춧가루 + 설탕</p></div>
<div><b>🍢 오뎅</b><p>오뎅을 담아서 바로 판매</p></div>
<div><b>🧀 로제떡볶이</b><p>떡 + 물 + 생크림 + 고추장 + 고춧가루 + 설탕</p></div>
<div><b>🥢 김말이</b><p>튀김기에 넣었다 빼기</p></div>
<div><b>🥕 야채튀김</b><p>튀김기에 넣었다 빼기</p></div>
<div><b>🍠 고구마튀김</b><p>튀김기에 넣었다 빼기</p></div></div>`);

$("shop").onclick=()=>{
 const lv=level();
 modal(`<h2>🛒 상점</h2><p><b>현재 Lv.${lv} ${levels[lv-1].name}</b> · 💰 ${won(state.money)}원</p>
 <div class="shopGrid">${upgrades.map((u,i)=>{
  const owned=state.upgrades.includes(u.id), unlocked=lv>=i+1;
  return `<div class="shopItem"><h3>${u.icon} ${u.name}</h3><p>${u.desc}</p><b>${owned?"구매 완료":won(u.price)+"원"}</b><br>
  <button class="buy" ${owned||!unlocked||state.money<u.price?"disabled":""} onclick="buy('${u.id}')">${owned?"완료":!unlocked?"상위 레벨 필요":"구매하기"}</button></div>`}).join("")}</div>`);
};

window.buy=id=>{
 const u=upgrades.find(x=>x.id===id);
 if(!u||state.upgrades.includes(id))return;
 if(state.money<u.price){toast("돈이 부족해요!");return}
 state.money-=u.price;state.upgrades.push(id);save();render();$("shop").click();toast(`${u.name} 구매 완료!`);
};

$("rename").onclick=()=>modal(`<h2>✏️ 가게 이름 정하기</h2><p>원하는 이름을 직접 정해보세요.</p><input class="nameInput" id="newName" maxlength="18" value="${state.shopName}"><button class="saveName" onclick="saveName()">이 이름으로 정하기</button>`);
window.saveName=()=>{const n=$("newName").value.trim()||"세아분식";state.shopName=n;save();closeModal();render();toast(`가게 이름: ${n}`)};
$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
render();
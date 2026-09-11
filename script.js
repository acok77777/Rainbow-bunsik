const menu={
  "떡볶이":{price:3000,recipe:["떡","물","고추장","고춧가루","설탕"],emoji:"🌶️"},
  "오뎅":{price:2000,recipe:[],emoji:"🍢"},
  "로제떡볶이":{price:4000,recipe:["떡","물","생크림","고추장","고춧가루","설탕"],emoji:"🧀"},
  "김말이":{price:2000,recipe:[],emoji:"🥢"},
  "야채튀김":{price:2500,recipe:[],emoji:"🥕"},
  "고구마튀김":{price:2500,recipe:[],emoji:"🍠"}
};

const levels=[
  {name:"작은 분식집",need:0},
  {name:"인기 분식집",need:30000},
  {name:"맛집 분식집",need:80000},
  {name:"동네 최고 맛집",need:150000},
  {name:"세아분식 왕국 👑",need:300000}
];

const upgrades=[
 {id:"pot",icon:"🍲",name:"큰 냄비",price:10000,desc:"떡볶이/로제 조리 속도 증가"},
 {id:"stove",icon:"🔥",name:"좋은 가스레인지",price:20000,desc:"조리 시간이 더 빨라져요"},
 {id:"fryer",icon:"🍤",name:"큰 튀김기",price:25000,desc:"튀김이 더 빨리 완성돼요"},
 {id:"sign",icon:"🏪",name:"가게 간판 꾸미기",price:30000,desc:"가게 분위기가 한 단계 업!"}
];

let state=JSON.parse(localStorage.getItem("seabunsikState")||"null")||{
 money:0, shopName:"세아분식", level:1, currentCustomer:0,
 order:"떡볶이", ingredients:[], ready:null, fryer:null, upgrades:[]
};

function save(){localStorage.setItem("seabunsikState",JSON.stringify(state))}
function won(n){return n.toLocaleString("ko-KR")}
function toast(msg){
 const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
 clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),1800)
}
function levelForMoney(m){
 let lv=1; levels.forEach((x,i)=>{if(m>=x.need)lv=i+1}); return lv
}
function render(){
 state.level=levelForMoney(state.money);
 document.getElementById("shopTitle").textContent=state.shopName;
 document.getElementById("money").textContent=won(state.money);
 document.getElementById("levelBadge").textContent=`Lv.${state.level} ${levels[state.level-1].name}`;
 const next=levels[state.level] ;
 const prev=levels[state.level-1].need;
 const max=next?next.need:levels[4].need;
 const pct=next?Math.min(100,Math.max(0,(state.money-prev)/(max-prev)*100)):100;
 document.getElementById("progressBar").style.width=pct+"%";
 document.getElementById("progressAmount").textContent=next?`${won(state.money)} / ${won(max)}원`:`최고 레벨 달성!`;
 document.getElementById("nextLevelText").textContent=next?`다음: Lv.${state.level+1} ${next.name} — ${won(next.need-state.money)}원 남음`:"👑 세아분식 왕국 달성!";
 renderCustomers();
 document.getElementById("tteokIngredients").textContent=state.ingredients.length?state.ingredients.join(" → "):"재료를 넣어주세요";
 document.getElementById("roseIngredients").textContent=state.ingredients.length?state.ingredients.join(" → "):"재료를 넣어주세요";
 document.getElementById("readyFood").textContent=state.ready?`${menu[state.ready].emoji} ${state.ready}`:"아직 없어요";
 document.getElementById("fryerStatus").textContent=state.fryer?`🔥 ${state.fryer} 조리 중...`:"튀김 메뉴를 선택하세요";
}
function renderCustomers(){
 const faces=["👧🏻","👦🏻","👩🏻","🧒🏻","👨🏻","👩🏼"];
 const names=["세아","민준","지우","하윤","도윤","서윤"];
 const orders=Object.keys(menu);
 const box=document.getElementById("customers"); box.innerHTML="";
 for(let i=0;i<4;i++){
   const idx=(state.currentCustomer+i)%orders.length, order=orders[idx];
   const c=document.createElement("div");c.className="customer";
   c.innerHTML=`<div class="face">${faces[idx%faces.length]}</div><b>${names[idx%names.length]} 손님</b>
   <div class="order">${menu[order].emoji} ${order}<br><small>${won(menu[order].price)}원</small></div>`;
   c.onclick=()=>{state.order=order;state.ingredients=[];state.ready=null;state.fryer=null;toast(`주문 확인: ${order}`);save();render()};
   box.appendChild(c);
 }
}
function addIngredient(ing){
 const recipe=menu[state.order].recipe;
 if(!recipe.length){toast(`${state.order}은 재료를 넣는 메뉴가 아니에요!`);return}
 const expected=recipe[state.ingredients.length];
 if(ing!==expected){toast(`지금은 "${expected}"을(를) 넣어야 해요!`);return}
 state.ingredients.push(ing); toast(`${ing} 넣기 완료!`);
 if(state.ingredients.length===recipe.length){state.ready=state.order;toast(`🎉 ${state.order} 완성!`)}
 save();render();
}
function chooseFry(item){
 if(state.order!==item){toast(`현재 주문은 ${state.order}이에요.`);return}
 state.fryer=item; state.ready=null; render(); save();
 setTimeout(()=>{if(state.fryer===item){state.ready=item;state.fryer=null;toast(`🎉 ${item} 완성!`);save();render()}}, state.upgrades.includes("fryer")?1200:2200);
}
function sell(){
 if(!state.ready){toast("먼저 음식을 완성해주세요!");return}
 if(state.ready!==state.order){toast("손님이 주문한 음식과 달라요!");return}
 const price=menu[state.ready].price; state.money+=price;
 toast(`💰 ${won(price)}원 벌었어요!`);
 state.ready=null;state.ingredients=[];state.fryer=null;state.currentCustomer++;
 save();render();
}
function openModal(id){document.getElementById(id).classList.remove("hidden")}
function closeModals(){document.querySelectorAll(".modal").forEach(x=>x.classList.add("hidden"))}
function renderShop(){
 const lv=state.level;
 document.getElementById("shopLevel").textContent=`현재 Lv.${lv} ${levels[lv-1].name} · 보유금액 ${won(state.money)}원`;
 const box=document.getElementById("shopItems");box.innerHTML="";
 upgrades.forEach((u,i)=>{
  const owned=state.upgrades.includes(u.id);
  const unlocked=lv>=Math.min(5,i+1);
  const d=document.createElement("div");d.className="shop-item";
  d.innerHTML=`<h3>${u.icon} ${u.name}</h3><div>${u.desc}</div><div class="price">${owned?"구매 완료":won(u.price)+"원"}</div>
  <button class="buy" ${owned||!unlocked||state.money<u.price?"disabled":""}>${owned?"완료":!unlocked?"상위 레벨 필요":"구매하기"}</button>`;
  d.querySelector("button").onclick=()=>{
   if(state.money<u.price)return toast("돈이 부족해요!");
   state.money-=u.price;state.upgrades.push(u.id);save();render();renderShop();toast(`${u.name} 구매 완료!`);
  };
  box.appendChild(d);
 });
}
document.querySelectorAll(".ingredient").forEach(b=>b.onclick=()=>addIngredient(b.dataset.ing));
document.querySelectorAll(".fried").forEach(b=>b.onclick=()=>chooseFry(b.dataset.fry));
document.getElementById("sellBtn").onclick=sell;
document.getElementById("tteokCook").onclick=()=>{if(state.ready==="떡볶이")toast("이미 완성됐어요!");else toast("재료를 순서대로 넣어주세요!")};
document.getElementById("roseCook").onclick=()=>{state.order="로제떡볶이";toast("로제떡볶이 주문을 선택했어요!");render()};
document.getElementById("recipeBtn").onclick=()=>openModal("recipeModal");
document.getElementById("shopBtn").onclick=()=>{renderShop();openModal("shopModal")};
document.getElementById("nameBtn").onclick=()=>{document.getElementById("nameInput").value=state.shopName;openModal("nameModal")};
document.getElementById("saveName").onclick=()=>{
 const n=document.getElementById("nameInput").value.trim()||"세아분식";
 state.shopName=n;save();render();closeModals();toast(`가게 이름을 "${n}"으로 정했어요!`);
};
document.querySelectorAll(".close").forEach(b=>b.onclick=closeModals);
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
document.getElementById("resetBtn").onclick=()=>{
 if(confirm("게임을 처음부터 다시 시작할까요?")){localStorage.removeItem("seabunsikState");location.reload()}
};
render();

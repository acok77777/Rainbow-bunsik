const menu={
"떡볶이":{price:3000,recipe:["떡","물","고추장","고춧가루","설탕"],emoji:"🌶️"},
"오뎅":{price:2000,recipe:[],emoji:"🍢"},
"로제떡볶이":{price:4000,recipe:["떡","물","생크림","고추장","고춧가루","설탕"],emoji:"🧀"},
"김말이":{price:2000,recipe:[],emoji:"🥢"},
"야채튀김":{price:2500,recipe:[],emoji:"🥕"},
"고구마튀김":{price:2500,recipe:[],emoji:"🍠"}};
const levels=[
{name:"작은 분식집",need:0},{name:"인기 분식집",need:30000},{name:"맛집 분식집",need:80000},
{name:"동네 최고 맛집",need:150000},{name:"무지개 분식 왕국 👑",need:300000}];
const upgrades=[
{id:"pot",icon:"🍲",name:"큰 냄비",price:10000,desc:"조리 속도가 빨라져요"},
{id:"stove",icon:"🔥",name:"좋은 가스레인지",price:20000,desc:"조리 속도가 더 빨라져요"},
{id:"fryer",icon:"🍤",name:"큰 튀김기",price:25000,desc:"튀김이 더 빨라져요"},
{id:"sign",icon:"🏪",name:"가게 꾸미기",price:30000,desc:"가게 분위기를 업그레이드해요"}];
const faces=["👧🏻","👦🏻","👩🏻","🧒🏻","👨🏻","👩🏼"],names=["세아","민준","지우","하윤","도윤","서윤"];
const defaults={money:0,shopName:"무지개 분식",order:"떡볶이",ingredients:[],ready:null,fryer:null,currentCustomer:0,upgrades:[]};
let state;
try{state={...defaults,...JSON.parse(localStorage.getItem("rainbowBunsikState")||"{}")}}catch(e){state={...defaults}}
if(!Array.isArray(state.ingredients))state.ingredients=[];if(!Array.isArray(state.upgrades))state.upgrades=[];
const $=id=>document.getElementById(id), won=n=>Number(n).toLocaleString("ko-KR");
function save(){localStorage.setItem("rainbowBunsikState",JSON.stringify(state))}
function lv(){let n=1;levels.forEach((x,i)=>{if(state.money>=x.need)n=i+1});return n}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>$("toast").classList.remove("show"),1700)}
function render(){
 $("money").textContent=won(state.money);$("level").textContent=`Lv.${lv()} ${levels[lv()-1].name}`;
 const next=levels[lv()];$("progressText").textContent=next?`${won(state.money)} / ${won(next.need)}원`:"최고 레벨!";
 $("bar").style.width=next?Math.min(100,Math.max(0,(state.money-levels[lv()-1].need)/(next.need-levels[lv()-1].need)*100))+"%":"100%";
 const text=state.ingredients.length?state.ingredients.join(" → "):"재료를 넣어주세요";
 $("potText").textContent=state.order==="떡볶이"?text:"떡볶이 주문을 눌러주세요";
 $("roseText").textContent=state.order==="로제떡볶이"?text:"로제떡볶이 주문을 눌러주세요";
 $("fryerText").textContent=state.fryer?`🔥 ${state.fryer} 조리 중...`:"튀김 메뉴를 선택하세요";
 $("ready").textContent=state.ready?menu[state.ready].emoji+" "+state.ready:"아직 없어요";
 renderCustomers();save()
}
function renderCustomers(){
 const orders=Object.keys(menu),box=$("customers");box.innerHTML="";
 for(let i=0;i<6;i++){
  const idx=(state.currentCustomer+i)%orders.length,o=orders[idx],d=document.createElement("div");d.className="customer";
  d.innerHTML=`<div class="face">${faces[idx]}</div><b>${names[idx]} 손님</b><div class="bubble">${menu[o].emoji} ${o}<br>${won(menu[o].price)}원</div>`;
  d.onclick=()=>selectOrder(o);box.appendChild(d)
 }
}
function selectOrder(o){state.order=o;state.ingredients=[];state.ready=null;state.fryer=null;save();render();toast(`${o} 주문을 선택했어요!`)}
document.querySelectorAll("[data-menu]").forEach(b=>b.onclick=()=>selectOrder(b.dataset.menu));
document.querySelectorAll("[data-ing]").forEach(b=>b.onclick=()=>{
 const ing=b.dataset.ing,recipe=menu[state.order].recipe;
 if(!recipe.length)return toast(`${state.order}은 재료를 넣지 않아요.`);
 const expected=recipe[state.ingredients.length];
 if(ing!==expected)return toast(`다음 재료는 "${expected}"이에요!`);
 state.ingredients.push(ing);
 if(state.ingredients.length===recipe.length){state.ready=state.order;toast(`🎉 ${state.order} 완성!`)}else toast(`${ing} 넣기 완료!`);
 render()
});
document.querySelectorAll("[data-fry]").forEach(b=>b.onclick=()=>{
 const item=b.dataset.fry;
 if(state.order!==item)return toast(`현재 주문은 ${state.order}이에요.`);
 state.fryer=item;state.ready=null;render();toast(`${item}을 튀김기에 넣었어요!`);
 setTimeout(()=>{if(state.fryer===item){state.fryer=null;state.ready=item;render();toast(`🎉 ${item} 완성!`)}},state.upgrades.includes("fryer")?900:1800)
});
$("odeng").onclick=()=>{if(state.order!=="오뎅")return toast(`현재 주문은 ${state.order}이에요.`);state.ready="오뎅";state.ingredients=[];render();toast("🍢 오뎅을 담았어요!")};
$("sell").onclick=()=>{
 if(!state.ready)return toast("먼저 음식을 완성해주세요!");
 if(state.ready!==state.order)return toast("주문과 음식이 달라요!");
 const p=menu[state.ready].price;state.money+=p;state.ready=null;state.ingredients=[];state.fryer=null;state.currentCustomer++;render();toast(`💰 ${won(p)}원 벌었어요!`)
};
function modal(html){$("card").innerHTML=html+`<button class="close" onclick="closeModal()">✕</button>`;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
$("recipe").onclick=()=>modal(`<h2>📕 레시피북</h2><div class="recipeGrid">${Object.entries(menu).map(([n,v])=>`<div><b>${v.emoji} ${n}</b><p>${v.recipe.length?v.recipe.join(" + "):n==="오뎅"?"오뎅 담기 → 바로 판매":"튀김기에 넣었다 빼기"}</p></div>`).join("")}</div>`);
$("shop").onclick=()=>{const l=lv();modal(`<h2>🛒 상점</h2><p>현재 Lv.${l} · 💰 ${won(state.money)}원</p><div class="shopGrid">${upgrades.map((u,i)=>{const owned=state.upgrades.includes(u.id),ok=l>=i+1&&state.money>=u.price;return `<div class="shopItem"><h3>${u.icon} ${u.name}</h3><p>${u.desc}</p><b>${won(u.price)}원</b><br><button class="buy" ${owned||!ok?"disabled":""} onclick="buy('${u.id}')">${owned?"구매 완료":l<i+1?"상위 레벨 필요":state.money<u.price?"돈 부족":"구매하기"}</button></div>`}).join("")}</div>`)};
window.buy=id=>{const u=upgrades.find(x=>x.id===id);if(!u||state.upgrades.includes(id)||state.money<u.price)return;state.money-=u.price;state.upgrades.push(id);save();render();$("shop").click();toast(`${u.name} 구매 완료!`)};
$("rename").onclick=()=>modal(`<h2>✏️ 가게 이름 정하기</h2><input class="nameInput" id="newName" maxlength="18" value="${state.shopName}"><br><br><button class="saveName" onclick="saveName()">이 이름으로 정하기</button>`);
window.saveName=()=>{state.shopName=($("newName").value.trim()||"무지개 분식");document.querySelector(".logo strong").textContent="🌈 "+state.shopName;save();closeModal();toast(`가게 이름: ${state.shopName}`)};
$("pause").onclick=()=>toast("⏸️ 잠시 쉬는 중! (게임은 계속 저장돼요)");
$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
document.querySelector(".logo strong").textContent="🌈 "+state.shopName;render();

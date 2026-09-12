const menu={
"떡볶이":{price:3000,recipe:["떡","물","고추장","고춧가루","설탕"],emoji:"🌶️"},
"오뎅":{price:2000,recipe:[],emoji:"🍢"},
"로제떡볶이":{price:4000,recipe:["떡","물","생크림","고추장","고춧가루","설탕"],emoji:"🧀"},
"김말이":{price:2000,recipe:[],emoji:"🥢"},
"야채튀김":{price:2500,recipe:[],emoji:"🥕"},
"고구마튀김":{price:2500,recipe:[],emoji:"🍠"}};
let s=JSON.parse(localStorage.getItem("rainbowExactGame")||'{"money":0,"order":"떡볶이","ings":[],"ready":null}');
const $=x=>document.getElementById(x),won=n=>n.toLocaleString("ko-KR");
function save(){localStorage.setItem("rainbowExactGame",JSON.stringify(s));$("moneyOverlay").textContent=won(s.money)+"원"}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");clearTimeout(window.x);window.x=setTimeout(()=>$("toast").classList.remove("show"),1500)}
function select(o){s.order=o;s.ings=[];s.ready=null;save();toast(o+" 주문을 선택했어요!")}
document.querySelectorAll("[data-order]").forEach(b=>b.onclick=()=>select(b.dataset.order));
document.querySelectorAll("[data-ing]").forEach(b=>b.onclick=()=>{
 let recipe=menu[s.order].recipe;if(!recipe.length)return toast(s.order+"은 재료를 넣지 않아요.");
 let expected=recipe[s.ings.length];
 if(b.dataset.ing!==expected)return toast("다음 재료는 "+expected+"이에요!");
 s.ings.push(b.dataset.ing);
 if(s.ings.length===recipe.length){s.ready=s.order;toast("🎉 "+s.order+" 완성!")}else toast(b.dataset.ing+" 넣기 완료!");
 save();
});
document.querySelectorAll("[data-fry]").forEach(b=>b.onclick=()=>{
 let item=b.dataset.fry;if(s.order!==item)return toast("현재 주문은 "+s.order+"이에요.");
 toast(item+"을 튀김기에 넣었어요!");
 setTimeout(()=>{s.ready=item;save();toast("🎉 "+item+" 완성!")},1000);
});
$("sell").onclick=()=>{
 if(!s.ready)return toast("먼저 음식을 완성해주세요!");
 if(s.ready!==s.order)return toast("주문과 음식이 달라요!");
 let p=menu[s.ready].price;s.money+=p;s.ready=null;s.ings=[];save();toast("💰 "+won(p)+"원 획득!");
};
$("recipe").onclick=()=>{
 $("modalCard").innerHTML=`<button class="close" onclick="closeM()">✕</button><h2>📕 레시피북</h2>
 <div class="recipeGrid">${Object.entries(menu).map(([n,v])=>`<div><b>${v.emoji} ${n}</b><p>${v.recipe.length?v.recipe.join(" + "):(n==="오뎅"?"오뎅 담기 → 판매":"튀김기에 넣었다 빼기")}</p></div>`).join("")}</div>`;
 $("modal").classList.remove("hidden")
};
$("shop").onclick=()=>{
 $("modalCard").innerHTML=`<button class="close" onclick="closeM()">✕</button><h2>🛒 상점</h2>
 <p>보유금액: <b>${won(s.money)}원</b></p><div class="shopGrid">
 <div><h3>🍲 큰 냄비</h3><p>10,000원</p><button class="buy" onclick="buy(10000,'큰 냄비')">구매</button></div>
 <div><h3>🔥 좋은 가스레인지</h3><p>20,000원</p><button class="buy" onclick="buy(20000,'좋은 가스레인지')">구매</button></div>
 <div><h3>🍤 큰 튀김기</h3><p>25,000원</p><button class="buy" onclick="buy(25000,'큰 튀김기')">구매</button></div>
 <div><h3>🏪 가게 꾸미기</h3><p>30,000원</p><button class="buy" onclick="buy(30000,'가게 꾸미기')">구매</button></div></div>`;
 $("modal").classList.remove("hidden")
};
window.buy=(p,n)=>{if(s.money<p)return toast("돈이 부족해요!");s.money-=p;save();toast(n+" 구매 완료!")};
window.closeM=()=>$("modal").classList.add("hidden");
$("modal").onclick=e=>{if(e.target===$("modal"))closeM()};
save();

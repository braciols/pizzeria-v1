// ---- Dati del menu: modifica qui piatti e prezzi ----
var MENU = [
  {n:"Margherita", d:"Pomodoro San Marzano, fior di latte, basilico, olio EVO", p:7, c:"classiche", v:true},
  {n:"Marinara", d:"Pomodoro, aglio, origano, olio EVO", p:6, c:"classiche", v:true},
  {n:"Diavola", d:"Pomodoro, fior di latte, salame piccante, basilico", p:8.5, c:"classiche"},
  {n:"Napoli", d:"Pomodoro, fior di latte, acciughe, capperi, origano", p:8, c:"classiche"},
  {n:"Bufalina", d:"Pomodoro, mozzarella di bufala campana DOP, basilico", p:10, c:"speciali"},
  {n:"Provola e pepe", d:"Provola affumicata, pepe nero, crema di zucca", p:9.5, c:"speciali", v:true},
  {n:"Salsiccia e friarielli", d:"Fior di latte, salsiccia, friarielli saltati", p:10, c:"speciali"},
  {n:"Montanara", d:"Pizza fritta e poi passata in forno, pomodoro e basilico", p:7.5, c:"fritti", v:true},
  {n:"Frittatina di pasta", d:"Bucatini, besciamella, piselli e prosciutto", p:3.5, c:"fritti"},
  {n:"Crocchè di patate", d:"Patate, prezzemolo e provola (3 pezzi)", p:4, c:"fritti", v:true},
  {n:"Babà al rum", d:"Fatto in casa, con crema chantilly", p:5, c:"dolci", v:true},
  {n:"Pastiera", d:"Grano, ricotta e fiori d’arancio", p:5, c:"dolci", v:true}
];

var list = document.getElementById("items");
function fmt(n){ return n.toFixed(2).replace(".", ",") + " €"; }
MENU.forEach(function(m){
  var li = document.createElement("li");
  li.className = "item"; li.dataset.cat = m.c;
  li.innerHTML = '<div class="item-head"><h3></h3><span class="fill"></span><span class="price"></span></div><p></p>';
  li.querySelector("h3").textContent = m.n;
  if (m.v) { var t = document.createElement("span"); t.className = "tag"; t.textContent = "vegetariana"; li.querySelector("h3").appendChild(t); }
  li.querySelector(".price").textContent = fmt(m.p);
  li.querySelector("p").textContent = m.d;
  list.appendChild(li);
});

// ---- Filtri del menu ----
var filterBtns = document.querySelectorAll(".filters button");
filterBtns.forEach(function(b){
  b.addEventListener("click", function(){
    filterBtns.forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    list.querySelectorAll(".item").forEach(function(li){
      li.hidden = !(b.dataset.cat === "tutto" || li.dataset.cat === b.dataset.cat);
    });
  });
});

// ---- Menu mobile ----
var mb = document.getElementById("menuBtn"), nl = document.getElementById("navList");
mb.addEventListener("click", function(){
  var open = nl.classList.toggle("open");
  mb.setAttribute("aria-expanded", open);
});
nl.addEventListener("click", function(e){ if (e.target.tagName === "A") { nl.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });

// ---- Aperto / chiuso adesso ----
// Fasce in minuti dall'inizio del giorno, per giorno (0 = domenica)
var SLOTS = {
  0:[[720,900],[1110,1410]], 1:[], 2:[[1110,1410]], 3:[[1110,1410]],
  4:[[1110,1410]], 5:[[1110,1440]], 6:[[720,900],[1110,1440]]
};
function updateStatus(){
  var now = new Date(), d = now.getDay(), m = now.getHours()*60 + now.getMinutes();
  var open = (SLOTS[d] || []).some(function(s){ return m >= s[0] && m < s[1]; });
  var box = document.getElementById("status");
  box.className = "status open";
  box.hidden = !open;
  document.querySelectorAll("#hours tr").forEach(function(tr){ tr.classList.toggle("today", Number(tr.dataset.d) === d); });
}
updateStatus(); setInterval(updateStatus, 60000);

// ---- Prenotazione via WhatsApp ----
// Sostituisci con il numero della pizzeria: prefisso internazionale + numero, senza + né spazi
var WA_NUMBER = "390110000000";
var form = document.getElementById("bookForm"), msg = document.getElementById("formMsg");
var dateInput = form.elements["data"];
var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().slice(0,10);
form.addEventListener("submit", function(e){
  e.preventDefault();
  var f = form.elements, nome = f.nome.value.trim();
  msg.className = "msg err";
  if (nome.length < 2) { msg.textContent = "Inserisci il tuo nome."; f.nome.focus(); return; }
  if (!f.data.value) { msg.textContent = "Scegli una data."; f.data.focus(); return; }
  if (new Date(f.data.value + "T12:00:00").getDay() === 1) { msg.textContent = "Il lunedì siamo chiusi. Scegli un altro giorno."; f.data.focus(); return; }
  if (!f.ora.value) { msg.textContent = "Scegli un orario."; f.ora.focus(); return; }
  var dt = new Date(f.data.value + "T12:00:00").toLocaleDateString("it-IT", {weekday:"long", day:"numeric", month:"long"});
  var testo = "Ciao! Vorrei prenotare un tavolo da Pizzeria Fornace.\n" +
    "Nome: " + nome + "\n" +
    "Data: " + dt + "\n" +
    "Orario: " + f.ora.value + "\n" +
    "Persone: " + f.persone.value + "\n" +
    "Potete confermarmi la disponibilità? Grazie!";
  msg.className = "msg ok";
  msg.textContent = "Si apre WhatsApp con il messaggio pronto: premi Invia per completare la richiesta.";
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(testo), "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();

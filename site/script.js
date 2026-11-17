const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
// Opening loader intentionally removed for fast mobile first paint.
$("#year").textContent=new Date().getFullYear();
window.addEventListener("scroll",()=>$("#nav").classList.toggle("compact",scrollY>30));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.1});
$$(".reveal").forEach(e=>obs.observe(e));

$$("[data-compare]").forEach(card=>{
 const range=card.querySelector("input"), after=card.querySelector(".compare-after"), divider=card.querySelector(".divider");
 range.addEventListener("input",()=>{after.style.width=range.value+"%";divider.style.left=range.value+"%"});
});

$("#recommendForm").addEventListener("submit",e=>{
 e.preventDefault();
 const need=$("#recNeed").value,dirt=$("#recDirt").value,vehicle=$("#recVehicle").value;
 let name="Argento",price=99,text="Manutenzione regolare, aspirazione e lavaggio esterno completo.";
 if(["deep","premium"].includes(need)||dirt==="medium"){name="Oro";price=149;text="Pulizia approfondita, plastiche, zone difficili e finitura premium."}
 if(["seats"].includes(need)||vehicle==="suv"||vehicle==="luxury"){name="Diamante";price=199;text="Sedili, tappeti con shampoo, interni profondi e detailing esterno completo."}
 if(["pets","steam"].includes(need)||dirt==="heavy"||vehicle==="van"){name="Platinum";price=249;text="Massima cura con shampoo completo, peli, odori, vapore e finitura premium."}
 $("#recommendResult").innerHTML=`<p class="eyebrow gold">Consigliato per te</p><h3>${name}</h3><strong>Da €${price}</strong><p>${text}</p><a href="#booking">Prenota questo pacchetto →</a>`;
});

function quote(){
 const p=+$("#qPackage").value,v=+$("#qVehicle").value,d=+$("#qDirt").value;
 let total=p+v+d, lines=[`Pacchetto: €${p}`];
 if(v)lines.push(`Supplemento veicolo: +€${v}`); if(d)lines.push(`Sporco eccessivo: +€${d}`);
 $$("#quoteForm input[type=checkbox]:checked").forEach(c=>{total+=+c.value;lines.push(`${c.dataset.label}: +€${c.value}`)});
 $("#quoteTotal").textContent="€"+total; $("#quoteBreakdown").textContent=lines.join("\n"); return {total,lines};
}
$$("#quoteForm select,#quoteForm input").forEach(e=>e.addEventListener("change",quote));
$("#sendQuote").addEventListener("click",()=>{
 const q=quote(),msg=`Ciao DetailX, vorrei confermare questa stima indicativa:\n\n${q.lines.join("\n")}\n\nTotale stimato: €${q.total}\n\nVorrei verificare la disponibilità.`;
 window.open("https://wa.me/393898563081?text="+encodeURIComponent(msg),"_blank");
});

$("#bookingForm").addEventListener("submit",e=>{
 e.preventDefault();
 const msg=`Ciao DetailX, vorrei richiedere una prenotazione.\n\nNome: ${$("#bName").value}\nVeicolo: ${$("#bVehicle").value}\nPacchetto/servizio: ${$("#bPackage").value}\nData: ${$("#bDate").value}\nOrario: ${$("#bTime").value}\nZona: ${$("#bLocation").value}\nEsigenza: ${$("#bNeed").value}\nNote: ${$("#bNotes").value||"Nessuna"}\n\nAttendo conferma e preventivo finale.`;
 window.open("https://wa.me/393898563081?text="+encodeURIComponent(msg),"_blank");
});
// Lightweight conversion hooks. If GTM/GA4 is connected later, these become usable events automatically.
$$("[data-track]").forEach(el=>el.addEventListener("click",()=>{
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:"detailx_cta_click",cta_type:el.dataset.track,cta_label:(el.textContent||"").trim()});
}));

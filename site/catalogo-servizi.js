/* DetailX services catalogue: progressive enhancement; cards work without JS. */
(function(){
 'use strict';
 document.querySelectorAll('[data-dx-catalog]').forEach(function(catalog){
   var buttons=[].slice.call(catalog.querySelectorAll('[data-dx-filter]'));
   var cards=[].slice.call(catalog.querySelectorAll('[data-dx-category]'));
   var counter=catalog.querySelector('[data-dx-count]');
   if(!buttons.length||!cards.length)return;
   buttons.forEach(function(button){
     button.addEventListener('click',function(){
       var filter=button.getAttribute('data-dx-filter');
       var visible=0;
       cards.forEach(function(card){
         var show=filter==='all'||card.getAttribute('data-dx-category')===filter;
         card.hidden=!show;
         if(show)visible++;
       });
       buttons.forEach(function(b){
         var active=b===button;
         b.classList.toggle('is-active',active);
         b.setAttribute('aria-pressed',String(active));
       });
       if(counter)counter.textContent=visible===1?'1 trattamento da esplorare':visible+' trattamenti da esplorare';
     });
   });
 });
})();

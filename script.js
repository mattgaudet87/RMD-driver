(function(){
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // sticky nav
  var nav=$('#nav');
  var onScroll=function(){nav.classList.toggle('solid',window.scrollY>40)};
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  // mobile menu
  var burger=$('#burger'),menu=$('#menu');
  function setMenu(o){menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)}
  burger.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
  $$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  // reveal on scroll
  var els=$$('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el,i){el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  // FR / EN
  var nodes=$$('[data-en]');
  nodes.forEach(function(n){n._fr=n.innerHTML});
  var phs=$$('[data-en-placeholder]');
  phs.forEach(function(n){n._frPh=n.getAttribute('placeholder')});
  var lang='fr',btn=$('#lang');
  function setLang(l){
    lang=l;document.documentElement.lang=l;btn.textContent=l==='fr'?'EN':'FR';
    nodes.forEach(function(n){
      n.innerHTML=l==='en'?n.getAttribute('data-en'):n._fr;
    });
    phs.forEach(function(n){n.setAttribute('placeholder',l==='en'?n.getAttribute('data-en-placeholder'):n._frPh)});
    try{localStorage.setItem('rmd-lang',l)}catch(e){}
  }
  btn.addEventListener('click',function(){setLang(lang==='fr'?'en':'fr')});
  var saved=null;try{saved=localStorage.getItem('rmd-lang')}catch(e){}
  if(saved==='en'||(!saved&&(navigator.language||'').slice(0,2)!=='fr')) setLang('en');

  // form -> mailto
  var form=$('#form');
  if(form) form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=new FormData(form);
    if(!f.get('name')||!f.get('email')){(f.get('name')?form.email:form.name).focus();return}
    var en=lang==='en';
    var body=(en?'Name: ':'Nom : ')+f.get('name')+'\n'+'Email: '+f.get('email')+'\n'+(en?'Phone: ':'Téléphone : ')+(f.get('phone')||'-')+'\n'+'Service: '+f.get('service')+'\n\n'+(f.get('msg')||'');
    var subj=(en?'Quote request – ':'Demande de devis – ')+f.get('service');
    window.location.href='mailto:contact@rmddriver.com?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
  });

  var yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();
})();

(function(){
  // Meta Pixel integration point: add the real production Pixel ID here later. Do not add placeholder or fake IDs.
  const menuButton=document.querySelector(".menu-toggle");
  const menu=document.getElementById("mobile-menu");
  if(menuButton&&menu){
    menuButton.addEventListener("click",()=>{
      const open=menu.hasAttribute("hidden");
      if(open){menu.removeAttribute("hidden")}else{menu.setAttribute("hidden","")}
      menuButton.setAttribute("aria-expanded",String(open));
    });
  }
  document.querySelectorAll('a[target="_blank"]').forEach((a)=>{
    const rel=new Set((a.getAttribute("rel")||"").split(/\s+/).filter(Boolean));
    rel.add("noopener");rel.add("noreferrer");a.setAttribute("rel",Array.from(rel).join(" "));
  });
  document.querySelectorAll("img").forEach((img,i)=>{if(i>1&&!img.loading)img.loading="lazy";if(!img.decoding)img.decoding="async";});
  const params=new URLSearchParams(location.search);
  const utmFields=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
  const storage=(()=>{try{return window.sessionStorage}catch{return null}})();
  function rememberUtm(name){
    const value=params.get(name);
    if(value&&storage)storage.setItem("arcambe_"+name,value);
    return value||(storage&&storage.getItem("arcambe_"+name))||"";
  }
  function setField(name,value){
    document.querySelectorAll('[name="'+name+'"]').forEach((field)=>{if(value!==null&&value!==undefined)field.value=value;});
  }
  utmFields.forEach((name)=>setField(name,rememberUtm(name)));
  const courseParam=params.get("curso")||params.get("course");
  const priceParam=params.get("preco")||params.get("price");
  const landingParam=params.get("landing_page");
  const courseSelect=document.getElementById("course_select");
  function applyCourse(name,price,landingPage){
    const label=document.getElementById("selected-course-label");
    const priceLabel=document.getElementById("selected-course-price");
    const meta=document.getElementById("selected-course-meta");
    const deadline=document.getElementById("selected-course-deadline");
    setField("curso",name);
    setField("course",name);
    setField("preco",price);
    setField("price",price);
    setField("landing_page",landingPage||location.pathname.split("/").pop()||"inscricao.html");
    if(!name){
      if(label)label.textContent="Selecione um curso";
      if(priceLabel)priceLabel.textContent="Selecione um curso";
      if(meta)meta.textContent="O investimento aparece após a seleção.";
      if(deadline)deadline.textContent="Cada curso tem preço e prazo próprios.";
      return;
    }
    if(label)label.textContent=name;
    if(priceLabel)priceLabel.textContent=price;
    if(meta)meta.textContent=price;
    if(deadline&&courseSelect){
      const selected=courseSelect.selectedOptions[0];
      const labelText=selected?selected.textContent.split("—")[0].trim():name;
      deadline.textContent=price?labelText+" · "+price:"Cada curso tem preço e prazo próprios.";
    }
  }
  if(courseSelect){
    if(courseParam){
      const match=[...courseSelect.options].find((option)=>option.value===courseParam);
      if(match)courseSelect.value=match.value;
    }
    const selected=courseSelect.selectedOptions[0];
    applyCourse(courseSelect.value,priceParam||selected.dataset.price||"",landingParam||selected.dataset.landingPage||"inscricao.html");
    courseSelect.addEventListener("change",()=>{
      const option=courseSelect.selectedOptions[0];
      applyCourse(option.value,option.dataset.price,option.dataset.landingPage);
    });
  }else if(courseParam||priceParam||landingParam){
    applyCourse(courseParam||document.getElementById("curso_input")?.value||"",priceParam||document.getElementById("preco_input")?.value||"",landingParam||document.getElementById("landing_page_input")?.value||"");
  }
  document.querySelectorAll('form[action="/api/contact"],form[action="/api/newsletter"]').forEach((form)=>{
    if(!form.querySelector('[name="website"]')){
      const hp=document.createElement("input");hp.type="text";hp.name="website";hp.tabIndex=-1;hp.autocomplete="off";hp.setAttribute("aria-hidden","true");hp.className="hp-field";hp.style.cssText="position:absolute;inset:0 auto auto 0;width:1px;height:1px;opacity:0;clip-path:inset(50%);pointer-events:none";form.prepend(hp);
    }
    let status=form.querySelector(".arc-form-status");
    if(!status){status=document.createElement("p");status.className="arc-form-status";status.setAttribute("aria-live","polite");form.appendChild(status);}
    form.addEventListener("submit",()=>{
      const button=form.querySelector('button[type="submit"]');
      if(button){button.disabled=true;button.setAttribute("aria-busy","true");status.textContent="A enviar com segurança...";setTimeout(()=>{button.disabled=false;button.removeAttribute("aria-busy");status.textContent="";},6500);}
    });
  });
  const sticky=document.querySelector(".mobile-sticky-cta");
  const formSection=document.getElementById("inscricao");
  if(sticky&&formSection){
    document.body.classList.add("has-mobile-course-cta");
    const toggle=(visible)=>sticky.classList.toggle("is-hidden",visible);
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver((entries)=>toggle(entries.some((entry)=>entry.isIntersecting)),{threshold:.18});
      observer.observe(formSection);
    }
  }
})();


// ══════════════════════════════════════════
// GALLERY SLIDER — Premium with drag, dots, autoplay
// ══════════════════════════════════════════
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.gslider-outer').forEach(function(wrap){
      var slider = wrap.querySelector('.gslider');
      if(!slider) return;
      var slides = slider.querySelectorAll('.gslide');
      var prevBtn = wrap.querySelector('.gprev');
      var nextBtn = wrap.querySelector('.gnext');
      var dotsWrap = wrap.parentElement.querySelector('[id^="gslider-dots"]');
      var perView = getPerView();
      var current = 0;
      var totalPages = Math.ceil(slides.length / perView);
      var autoTimer;

      function getPerView(){
        if(window.innerWidth <= 680) return 1;
        if(window.innerWidth <= 1050) return 2;
        return 3;
      }

      // Build dots
      function buildDots(){
        if(!dotsWrap) return;
        perView = getPerView();
        totalPages = Math.ceil(slides.length / perView);
        dotsWrap.innerHTML = '';
        for(var i=0;i<Math.min(totalPages,12);i++){
          var d = document.createElement('button');
          d.className = 'gdot' + (i===0?' active':'');
          d.setAttribute('aria-label','Página '+(i+1));
          d.dataset.page = i;
          d.onclick = function(){ goTo(parseInt(this.dataset.page)); };
          dotsWrap.appendChild(d);
        }
      }

      function updateDots(){
        if(!dotsWrap) return;
        dotsWrap.querySelectorAll('.gdot').forEach(function(d,i){
          d.classList.toggle('active', i===current);
        });
      }

      function goTo(page){
        perView = getPerView();
        totalPages = Math.ceil(slides.length / perView);
        current = Math.max(0, Math.min(page, totalPages-1));
        var slideW = slides[0].offsetWidth + 16;
        slider.scrollTo({ left: current * perView * slideW, behavior:'smooth' });
        updateDots();
        resetAuto();
      }

      if(prevBtn) prevBtn.onclick = function(){ goTo(current - 1); };
      if(nextBtn) nextBtn.onclick = function(){ goTo(current + 1); };

      // Drag to scroll
      var isDown=false, startX, scrollL;
      slider.addEventListener('mousedown',function(e){
        isDown=true; slider.classList.add('dragging');
        startX=e.pageX-slider.offsetLeft; scrollL=slider.scrollLeft;
      });
      slider.addEventListener('mouseleave',function(){ isDown=false; slider.classList.remove('dragging'); });
      slider.addEventListener('mouseup',function(){ isDown=false; slider.classList.remove('dragging'); });
      slider.addEventListener('mousemove',function(e){
        if(!isDown) return; e.preventDefault();
        var x=e.pageX-slider.offsetLeft, walk=(x-startX)*1.8;
        slider.scrollLeft=scrollL-walk;
      });

      // Autoplay every 5s
      function startAuto(){
        autoTimer = setInterval(function(){
          if(current >= totalPages-1) current=-1;
          goTo(current+1);
        }, 5000);
      }
      function resetAuto(){ clearInterval(autoTimer); startAuto(); }

      // Touch support
      slider.addEventListener('touchstart',function(){ clearInterval(autoTimer); },{passive:true});
      slider.addEventListener('touchend',function(){ resetAuto(); },{passive:true});

      // Sync dots on manual scroll
      slider.addEventListener('scroll',function(){
        if(isDown) return;
        perView = getPerView();
        var slideW = slides[0].offsetWidth + 16;
        var newPage = Math.round(slider.scrollLeft / (perView * slideW));
        if(newPage !== current){ current=newPage; updateDots(); }
      });

      window.addEventListener('resize',function(){ buildDots(); goTo(0); });
      buildDots();
      startAuto();
    });
  });
})();

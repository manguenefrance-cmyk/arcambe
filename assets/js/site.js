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

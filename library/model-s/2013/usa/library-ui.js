/* Tesla Network Scanner: Model S 2013 USA catalog navigation.
   No proprietary wiring diagrams or unverified pinouts are distributed. */
(async function(){
 const panel=document.getElementById('localSopPdf')?.parentElement;
 if(!panel)return;
 const section=document.createElement('section');
 section.style.cssText='margin-bottom:16px;padding:14px;border:1px solid #8b4356;border-radius:12px;background:#21141c';
 section.innerHTML=`<h3 style="margin:0 0 8px">Бібліотека Tesla Model S · 2013 · USA</h3>
 <p class="hint" id="usaLibraryStatus">Перевіряємо каталог…</p>
 <label for="usaLibrarySearch">Пошук за схемою, блоком, роз’ємом або контактом</label>
 <input type="search" id="usaLibrarySearch" placeholder="Наприклад: HVAC, fusebox, CAN, G543" autocomplete="off">
 <div class="controls" style="margin:12px 0">
 <button type="button" class="btn secondary" id="usaLibraryWiring">Електросхеми</button>
 <button type="button" class="btn secondary" id="usaLibraryConnectors">Роз’єми</button>
 </div><p class="hint" id="usaLibrarySearchStatus" aria-live="polite"></p>
 <div id="usaLibraryMatches" class="list"></div><div id="usaLibraryDocs" class="list"></div>`;
 const pickerPanel=document.getElementById('schemePicker');
 if(pickerPanel)pickerPanel.insertBefore(section,pickerPanel.firstChild);
 else panel.parentElement.parentElement.insertBefore(section,panel.parentElement);
 const status=section.querySelector('#usaLibraryStatus');
 const search=section.querySelector('#usaLibrarySearch');
 const matches=section.querySelector('#usaLibraryMatches');
 const feedback=section.querySelector('#usaLibrarySearchStatus');
 const docsContainer=section.querySelector('#usaLibraryDocs');
 let documents=[];
 const openWiring=()=>{document.getElementById('docsWiring')?.click();document.getElementById('schemePicker')?.classList.remove('hidden');};
 const openConnectors=()=>{document.getElementById('docsConnectors')?.click();};
 section.querySelector('#usaLibraryWiring').addEventListener('click',openWiring);
 section.querySelector('#usaLibraryConnectors').addEventListener('click',openConnectors);
 function addResult(label,action){
  const b=document.createElement('button');b.type='button';b.className='item';
  b.textContent=label;b.addEventListener('click',action);matches.appendChild(b);
 }
 function refresh(){
  const query=search.value.trim().toLocaleLowerCase('uk');
  matches.replaceChildren();
  if(!query){feedback.textContent='Введіть назву схеми або позначення роз’єму для пошуку в наявному каталозі.';return;}
  let count=0;
  const picker=document.getElementById('schemeButtons');
  if(picker){
   Array.from(picker.querySelectorAll('button')).filter(b=>b.textContent.toLocaleLowerCase('uk').includes(query)).slice(0,25).forEach(b=>{
    count++;addResult('Схема: '+b.textContent.trim(),()=>{openWiring();b.click();picker.scrollIntoView({behavior:'smooth',block:'start'});});
   });
  }
  documents.filter(d=>[d.title,d.description,d.id].some(v=>String(v||'').toLocaleLowerCase('uk').includes(query))).slice(0,20).forEach(d=>{
   count++;addResult('PDF: '+d.title,()=>window.open('./'+d.path,'_blank','noopener'));
  });
  feedback.textContent=count?('Знайдено: '+count+'. Дані контактів і CAN перевіряються окремо.'):'У наявному каталозі збігів немає. Розпіновки та CAN-ID не вигадуються.';
 }
 search.addEventListener('input',refresh);
 refresh();
 try{
  const res=await fetch('./library/model-s/2013/usa/catalog.json',{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const data=await res.json();
  if(data.market!=='USA'||data.year!==2013||data.model!=='Model S')throw Error('Невідповідний профіль');
  documents=(Array.isArray(data.documents)?data.documents:[]).filter(d=>d&&d.title&&typeof d.path==='string'&&/^library\\/model-s\\/2013\\/usa\\/files\\/[\\w.\\/-]+\\.pdf$/i.test(d.path));
  status.textContent=documents.length?'Перевірені документи Model S 2013 USA:':'Каталог USA створено. Перевірені PDF ще не додані; локальний PDF можна відкрити нижче. Файл SOP2+EU не позначається як USA.';
  documents.forEach(d=>{
   const a=document.createElement('a');a.className='btn secondary';a.style.cssText='display:block;margin:8px 0;text-decoration:none';
   a.textContent=d.title;a.href='./'+d.path;a.target='_blank';a.rel='noopener noreferrer';docsContainer.appendChild(a);
  });
  refresh();
 }catch(e){status.textContent='Каталог тимчасово недоступний. Локальний PDF можна відкрити нижче.';}
})();
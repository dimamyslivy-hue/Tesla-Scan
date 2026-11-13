/* Model S 2013 USA documentation library: metadata only until authorized files are added. */
(async function(){
 const panel=document.getElementById('localSopPdf')?.parentElement;
 if(!panel)return;
 const section=document.createElement('section');
 section.style.cssText='margin-bottom:16px;padding:14px;border:1px solid #8b4356;border-radius:12px;background:#21141c';
 section.innerHTML='<h3 style="margin:0 0 8px">Бібліотека Tesla Model S · 2013 · USA</h3><p class="hint" id="usaLibraryStatus">Перевіряємо каталог…</p><div id="usaLibraryDocs" class="list"></div>';
 panel.parentElement.insertBefore(section,panel);
 const status=section.querySelector('#usaLibraryStatus'),list=section.querySelector('#usaLibraryDocs');
 try{
  const res=await fetch('./library/model-s/2013/usa/catalog.json',{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const data=await res.json();
  if(data.market!=='USA'||data.year!==2013||data.model!=='Model S')throw Error('Невідповідний профіль');
  const docs=Array.isArray(data.documents)?data.documents:[];
  status.textContent=docs.length?'Документи для американської Model S 2013:':'Каталог створено. PDF ще не додані; поки можна вибрати локальний файл нижче.';
  docs.forEach(doc=>{
   if(!doc.title||!doc.path||!/^library\/model-s\/2013\/usa\/files\/[\w.\/-]+\.pdf$/i.test(doc.path))return;
   const a=document.createElement('a');a.className='btn secondary';a.style.cssText='display:block;margin:8px 0;text-decoration:none';
   a.textContent=doc.title;a.href='./'+doc.path;a.target='_blank';a.rel='noopener noreferrer';list.appendChild(a);
  });
 }catch(e){status.textContent='Не вдалося завантажити каталог. Локальний PDF доступний нижче.';}
})();
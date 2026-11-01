import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
const source=await fs.readFile(new URL('../sw.js',import.meta.url),'utf8');
function worker(fail=false){
 const handlers={},calls=[],shell={html:'offline'};
 const cache={addAll:async requests=>{calls.push(['assets',requests]);if(fail)throw Error('offline');},match:async key=>key==='./index.html'?shell:undefined};
 const self={location:{href:'https://example.test/photos-pe/sw.js',origin:'https://example.test'},clients:{claim:async()=>calls.push(['claim'])},skipWaiting:async()=>calls.push(['skip']),addEventListener:(key,fn)=>handlers[key]=fn};
 vm.runInNewContext(source,{self,URL,Request,caches:{open:async()=>cache,keys:async()=>['photos-pe-v1.0.0','unrelated-app'],delete:async key=>calls.push(['delete',key])},fetch:async()=>{throw Error('no network');}});
 return {handlers,calls,shell};
}
test('mise à jour : téléchargement sans cache HTTP, puis activation',async()=>{const w=worker();let done;w.handlers.install({waitUntil:p=>done=p});await done;assert.equal(w.calls[0][0],'assets');assert(w.calls[0][1].every(r=>r.cache==='reload'));assert.equal(w.calls.at(-1)[0],'skip');});
test('une installation échouée ne prend pas la relève',async()=>{const w=worker(true);let done;w.handlers.install({waitUntil:p=>done=p});await assert.rejects(done);assert(!w.calls.some(x=>x[0]==='skip'));});
test('activation conserve les caches étrangers et ne recharge pas les fenêtres',async()=>{const w=worker();let done;w.handlers.activate({waitUntil:p=>done=p});await done;assert.deepEqual(w.calls.filter(x=>x[0]==='delete'),[['delete','photos-pe-v1.0.0']]);assert(w.calls.some(x=>x[0]==='claim'));});
test('navigation hors ligne sert la version de son cache',async()=>{const w=worker();let response;w.handlers.fetch({request:{url:'https://example.test/photos-pe/',method:'GET',mode:'navigate'},respondWith:p=>response=p});assert.equal(await response,w.shell);});

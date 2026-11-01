let db;
export async function openDB(name='photos-pe'){db=await new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore('meta');d.createObjectStore('plots',{keyPath:'key'}).createIndex('canonical','canonical',{unique:true});d.createObjectStore('photos',{keyPath:['plot','slot']});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Fermez les autres fenêtres de Photos PE.'));});db.onversionchange=()=>db.close();}
export function transact(stores,mode,fn){return new Promise((resolve,reject)=>{const tx=db.transaction(stores,mode);let value;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error||Error('Échec de stockage'));tx.onabort=()=>reject(tx.error||Error('Transaction annulée'));try{value=fn(tx);}catch(e){tx.abort();reject(e);}});}
export function get(store,key){return new Promise((resolve,reject)=>{const tx=db.transaction(store);const r=tx.objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export function all(store){return new Promise((resolve,reject)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
// Cursor strips Blobs: lists and exports never fetch every photograph together.
export function photoMeta(){return new Promise((resolve,reject)=>{const rows=[];const tx=db.transaction('photos');const r=tx.objectStore('photos').openCursor();r.onsuccess=()=>{const c=r.result;if(c){const {blob,...meta}=c.value;rows.push(meta);c.continue();}};tx.oncomplete=()=>resolve(rows);tx.onerror=()=>reject(tx.error);});}
export const put=(store,value,key)=>transact([store],'readwrite',tx=>{tx.objectStore(store).put(value,key);});
export async function savePhoto(record,expectedHash){await transact(['plots','photos'],'readwrite',tx=>{const check=tx.objectStore('plots').get(record.plot);check.onsuccess=()=>{if(!check.result){tx.abort();return;}const store=tx.objectStore('photos'),req=store.get([record.plot,record.slot]);req.onsuccess=()=>{if(req.result?.hash!==expectedHash){tx.abort();return;}store.put(record);};};});const saved=await get('photos',[record.plot,record.slot]);if(!saved?.blob||saved.blob.size!==record.size||saved.hash!==record.hash)throw Error('La vérification de l’enregistrement a échoué.');return saved;}
export async function digest(blob){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))).map(n=>n.toString(16).padStart(2,'0')).join('');}

// Deletions resolve only once the transaction commits. The cache is untouched.
export function deletePhoto(plot,slot){
 return transact(['photos'],'readwrite',tx=>tx.objectStore('photos').delete([plot,slot]));
}
export function deletePlot(key){
 return transact(['plots','photos'],'readwrite',tx=>{
  tx.objectStore('plots').delete(key);
  tx.objectStore('photos').delete(IDBKeyRange.bound([key,1],[key,10]));
 });
}
export function deleteProject(){
 return transact(['plots','photos','meta'],'readwrite',tx=>{
  for(const store of ['plots','photos','meta'])tx.objectStore(store).clear();
 });
}
export function closeDB(){db?.close();}

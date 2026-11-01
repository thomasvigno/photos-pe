import {openDB,closeDB,put,get,all,savePhoto,deletePhoto,deletePlot,deleteProject} from '../db.js';
const assert=(ok,message)=>{if(!ok)throw Error(message);};
document.getElementById('run').onclick=async()=>{
 const name='photos-pe-test-'+Date.now(),out=document.getElementById('result'),lines=[];
 const pass=s=>{lines.push('OK — '+s);out.textContent=lines.join('\n');};
 try{
  await openDB(name);
  await put('plots',{key:'A',canonical:'A',id:'A'});await put('plots',{key:'B',canonical:'B',id:'B'});
  await put('meta',{id:'project',name:'Essai'},'project');await put('meta',{date:'today'},'restore:part');
  const photo=(plot,slot)=>({plot,slot,blob:new Blob(['sample']),size:6,hash:plot+slot,date:'today'});
  for(const [plot,slot] of [['A',1],['A',2],['B',1]])await savePhoto(photo(plot,slot));
  await deletePhoto('A',1);
  assert(!await get('photos',['A',1]),'Photo encore présente');assert(await get('photos',['A',2]),'Autre emplacement effacé');assert(await get('photos',['B',1]),'Autre PE effacée');assert(await get('plots','A'),'PE effacée');pass('Supprimer une photo conserve les autres photos et la PE');
  await savePhoto(photo('A',1));assert(await get('photos',['A',1]),'Emplacement non réutilisable');pass('Une photo peut être reprise dans l’emplacement libéré');
  await deletePlot('A');assert(!await get('plots','A'),'PE encore présente');assert(!await get('photos',['A',1])&&!await get('photos',['A',2]),'Photos orphelines');assert(await get('photos',['B',1]),'Autre PE altérée');assert(await get('meta','project'),'Projet effacé');pass('Supprimer une PE efface toutes ses photos et conserve les autres PE');
  let rejected=false;try{await savePhoto(photo('A',3));}catch{rejected=true;}assert(rejected&&!await get('photos',['A',3]),'Capture orpheline acceptée');pass('Une capture retardée ne recrée pas une photo dans une PE supprimée');
  await deleteProject();for(const store of ['photos','plots','meta'])assert((await all(store)).length===0,'Données restantes : '+store);pass('Supprimer le projet efface PE, photos, nom et marqueurs de restauration');
  closeDB();await openDB(name);assert((await all('plots')).length===0&&(await all('photos')).length===0,'Suppression non persistée');pass('Les suppressions persistent après fermeture et réouverture');
  await put('plots',{key:'A',id:'A',canonical:'A'});await savePhoto(photo('A',1));pass('Un nouveau projet peut réutiliser un ancien identifiant');
  out.textContent+='\n7 tests IndexedDB réussis.';
 }catch(e){out.textContent+='\nÉCHEC : '+e.message;}finally{closeDB();indexedDB.deleteDatabase(name);}
};

export const MAX_PART=32*1024*1024;
export function validId(s){if(typeof s!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,59}$/.test(s))throw Error('Identifiant invalide (1 à 60 lettres, chiffres, tirets ou _).');return s.toUpperCase();}
export const filename=(id,n)=>`${id}.${n}.jpg`;
export const safeName=s=>(s||'Projet').replace(/[^A-Za-z0-9_-]/g,'_').slice(0,80)||'Projet';
export function csv(project,plots,records){const keys=new Map(records.map(r=>[`${r.plot}:${r.slot}`,r]));const q=s=>'"'+String(s).replace(/"/g,'""')+'"';return '\ufeff'+[['projet','parcelle','emplacement','fichier_attendu','enregistre','octets','date_UTC'],...plots.flatMap(p=>Array.from({length:10},(_,i)=>{const r=keys.get(`${p.key}:${i+1}`);return [project,p.id,i+1,filename(p.id,i+1),r?'oui':'non',r?.size||0,r?.date||''];}))].map(row=>row.map(q).join(';')).join('\r\n');}
export function parts(records){const out=[[]];let size=0;for(const r of records){if(r.size>MAX_PART)throw Error('Photo trop volumineuse pour un lot.');if(size+r.size>MAX_PART){out.push([]);size=0;}out.at(-1).push(r);size+=r.size;}return out;}

export function uuid(){const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,n=>n.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}

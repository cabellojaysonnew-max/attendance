
window.saveOffline=function(log){
 let q=JSON.parse(localStorage.offlineLogs||"[]");
 q.push(log);
 localStorage.offlineLogs=JSON.stringify(q);
};

async function syncOffline(){

 if(!navigator.onLine) return;

 let q=JSON.parse(localStorage.offlineLogs||"[]");
 if(!q.length) return;

 await fetch(
 "https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance",
 {
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify(q[0])
 });

 q.shift();
 localStorage.offlineLogs=JSON.stringify(q);
}

setInterval(syncOffline,20000);
window.addEventListener("online",syncOffline);

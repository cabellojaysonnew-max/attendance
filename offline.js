
window.saveOffline = function(log){
 let q = JSON.parse(localStorage.offlineLogs||"[]");
 q.push(log);
 localStorage.offlineLogs = JSON.stringify(q);
}

async function syncOffline(){

 if(!navigator.onLine) return;

 let q = JSON.parse(localStorage.offlineLogs||"[]");
 if(!q.length) return;

 const module = await import("./supabase.js");
 const supabase = module.supabase;

 await supabase.from("attendance_logs").insert(q);

 localStorage.offlineLogs="[]";
}

setInterval(syncOffline,15000);

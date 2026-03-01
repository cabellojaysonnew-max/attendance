
window.saveOffline=function(log){
 let q=JSON.parse(localStorage.offlineLogs||"[]");
 q.push(log);
 localStorage.offlineLogs=JSON.stringify(q);
};

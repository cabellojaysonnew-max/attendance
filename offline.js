
export function saveOffline(log){
let logs=JSON.parse(localStorage.getItem("offline_logs"))||[]
logs.push(log)
localStorage.setItem("offline_logs",JSON.stringify(logs))
}

export function getOffline(){
return JSON.parse(localStorage.getItem("offline_logs"))||[]
}

export function clearOffline(){
localStorage.removeItem("offline_logs")
}

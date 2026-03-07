
export function saveOffline(log){

let logs=JSON.parse(localStorage.getItem("offline_logs"))||[]

if(logs.length>=4){
alert("Maximum 4 logs per day reached")
return false
}

logs.push(log)
localStorage.setItem("offline_logs",JSON.stringify(logs))

return true

}

export function getOffline(){
return JSON.parse(localStorage.getItem("offline_logs"))||[]
}

export function clearOffline(){
localStorage.removeItem("offline_logs")
}

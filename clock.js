
import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"
import { saveOffline,getOffline,clearOffline } from "./offline.js"

async function saveLog(log){

const {data,error}=await supabase
.from("attendance_logs")
.insert([log])
.select()

if(error){
console.error("SUPABASE ERROR:",error)
alert("Database error: "+error.message)
return false
}

console.log("Saved:",data)
return true

}

export async function clock(){

const emp_id=localStorage.getItem("emp_id")

const gps=await getGPS()

if(gps.accuracy>150){
alert("Weak GPS signal")
return
}

const address=await getLocation(gps.lat,gps.lng)

const log={
emp_id:emp_id,
log_time:new Date(),
device_id:"mobile",
latitude:gps.lat,
longitude:gps.lng,
accuracy:gps.accuracy,
address:address,
place_name:address,
device_type:"MOBILE_WEB"
}

if(navigator.onLine){

const saved=await saveLog(log)
if(!saved) return

}else{

saveOffline(log)
alert("Saved offline")

}

syncOffline()

location.reload()

}

async function syncOffline(){

if(!navigator.onLine) return

const logs=getOffline()

for(let l of logs){
await saveLog(l)
}

clearOffline()

}

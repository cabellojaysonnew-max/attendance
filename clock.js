
import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"
import { saveOffline,getOffline,clearOffline } from "./offline.js"

let processing=false

export async function clock(){

if(processing) return
processing=true

const emp_id=localStorage.getItem("emp_id")
const device=localStorage.getItem("device_guid")

const today=new Date().toISOString().split("T")[0]

if(navigator.onLine){

const {data}=await supabase
.from("attendance_logs")
.select("log_time")
.eq("emp_id",emp_id)
.gte("log_time",today)

if(data && data.length>=4){
alert("Maximum 4 logs per day reached")
processing=false
return
}

}

const gps=await getGPS()

if(gps.accuracy>150){
alert("Weak GPS signal")
processing=false
return
}

const address=await getLocation(gps.lat,gps.lng)

const log={
emp_id:emp_id,
log_time:new Date(),
latitude:gps.lat,
longitude:gps.lng,
accuracy:gps.accuracy,
address:address,
device_id:device,
device_type:"MOBILE_WEB"
}

if(navigator.onLine){

await supabase.from("attendance_logs").insert(log)

}else{

const saved=saveOffline(log)
if(!saved){ processing=false; return }

alert("Saved offline")

}

syncOffline()

processing=false
location.reload()

}

async function syncOffline(){

if(!navigator.onLine) return

const logs=getOffline()

for(let l of logs){
await supabase.from("attendance_logs").insert(l)
}

clearOffline()

}

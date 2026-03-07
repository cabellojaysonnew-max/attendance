import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"
import { getDevice } from "./device.js"
import { saveOffline } from "./offline.js"
import { syncLogs } from "./sync.js"

export async function clock(){

const emp_id = localStorage.getItem("emp_id")

await syncLogs()

const today = new Date().toISOString().split("T")[0]

let data=[]

try{

const res = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)

data = res.data || []

}catch(e){
data=[]
}

if(data && data.length >= 4){
 alert("Maximum logs today")
 return
}

const last = data[data.length-1]

let gps

try{
 gps = await getGPS()
}catch(e){
 alert(e)
 return
}

/* TELEPORT DETECTION */

if(last){

const distance =
Math.abs(last.latitude - gps.lat) +
Math.abs(last.longitude - gps.lng)

if(distance > 0.02){
 alert("Location jump detected")
 return
}

}

const address = await getLocation(gps.lat,gps.lng)

const log={
 emp_id:emp_id,
 log_time:new Date(),
 device_id:getDevice(),
 latitude:gps.lat,
 longitude:gps.lng,
 accuracy:gps.accuracy,
 address:address,
 place_name:address,
 device_type:"MOBILE_WEB",
 spoof_flag:gps.spoof
}

/* TRY ONLINE FIRST */

try{

const {error} = await supabase
.from("attendance_logs")
.insert([log])

if(error){
 throw error
}

}catch(e){

saveOffline(log)
alert("Offline mode: log saved locally")

}

location.reload()

}

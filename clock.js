
import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"
import { getDevice } from "./device.js"
import { saveOffline } from "./offline.js"
import { syncLogs } from "./sync.js"

export async function clock(){

const emp_id=localStorage.getItem("emp_id")

await syncLogs()

const today=new Date().toISOString().split("T")[0]

const {data}=await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)

if(data && data.length>=4){
 alert("Maximum logs today")
 return
}

let gps

try{
 gps = await getGPS()
}catch(e){
 alert(e)
 return
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

if(navigator.onLine){

const {error}=await supabase
.from("attendance_logs")
.insert([log])

if(error){
 alert(error.message)
 return
}

}else{

saveOffline(log)
alert("Saved offline")

}

location.reload()

}

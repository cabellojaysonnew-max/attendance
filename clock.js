import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"
import { getDevice } from "./device.js"
import { saveOffline } from "./offline.js"
import { syncLogs } from "./sync.js"

function getLocalLogs(){
 return JSON.parse(localStorage.getItem("today_logs")) || []
}

function saveLocalLog(log){
 let logs = getLocalLogs()
 logs.push(log)
 localStorage.setItem("today_logs", JSON.stringify(logs))
}

export async function clock(){

 const emp_id = localStorage.getItem("emp_id")
 const device = getDevice()

 await syncLogs()

 const today = new Date().toISOString().split("T")[0]

 let logs = []

 /* TRY GET SERVER LOGS */

 try{

  const {data,error} = await supabase
  .from("attendance_logs")
  .select("*")
  .eq("emp_id",emp_id)
  .gte("log_time",today)
  .order("log_time",{ascending:true})

  if(!error && data){

   logs = data
   localStorage.setItem("today_logs", JSON.stringify(data))

  }

 }catch(e){

  console.log("Offline mode: using local logs")

  logs = getLocalLogs()

 }

 /* STRICT 4 LOG LIMIT */

 if(logs.length >= 4){

  alert("You have already completed today's attendance.")
  return

 }

 const sequence = ["CLOCK IN","BREAK OUT","BREAK IN","CLOCK OUT"]

 const status = sequence[logs.length]

 /* GET GPS */

 let gps

 try{
  gps = await getGPS()
 }catch(e){
  alert(e)
  return
 }

 /* TELEPORT DETECTION */

 const last = logs[logs.length-1]

 if(last){

  const distance =
  Math.abs(last.latitude - gps.lat) +
  Math.abs(last.longitude - gps.lng)

  if(distance > 0.02){

   alert("Location jump detected")
   return

  }

 }

 /* GET ADDRESS */

 let address = "Offline Location"

 try{
  address = await getLocation(gps.lat,gps.lng)
 }catch(e){
  console.log("Offline geocoder")
 }

 const log={

  emp_id:emp_id,
  log_time:new Date().toISOString(),
  status:status,

  device_id:device,

  latitude:gps.lat,
  longitude:gps.lng,
  accuracy:gps.accuracy,

  address:address,
  place_name:address,

  device_type:"MOBILE_WEB",
  spoof_flag:gps.spoof

 }

 /* SAVE LOCAL COPY */

 saveLocalLog(log)

 /* TRY ONLINE SAVE */

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

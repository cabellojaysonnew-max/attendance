
import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"
import { saveOffline } from "./offline.js"

export async function clock(){

const emp_id = localStorage.getItem("emp_id")
const device = localStorage.getItem("device_guid")

const gps = await getGPS()

if(gps.accuracy > 150){
alert("Weak GPS signal. Move outside.")
return
}

const address = await getLocation(gps.lat,gps.lng)

const log = {
emp_id: emp_id,
log_time: new Date(),
latitude: gps.lat,
longitude: gps.lng,
accuracy: gps.accuracy,
address: address,
device_id: device,
device_type: "MOBILE_WEB"
}

if(navigator.onLine){

await supabase
.from("attendance_logs")
.insert(log)

}else{

saveOffline(log)
alert("Offline mode: log saved locally")

}

alert("Attendance recorded")

location.reload()

}

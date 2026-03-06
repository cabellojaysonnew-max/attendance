import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getAddress } from "./location.js"

function detectDevice(){

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

return isMobile ? "MOBILE_WEB" : "KIOSK"

}

export async function clock(){

try{

const emp_id = localStorage.getItem("emp_id")

if(!emp_id){
alert("Session expired. Please login again.")
return
}

const deviceType = detectDevice()

const gps = await getGPS()

const address = await getAddress(gps.lat,gps.lng)

const today = new Date().toISOString().split("T")[0]

const { data:logs, error:logError } = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)

if(logError){
console.error(logError)
alert("Error checking logs")
return
}

if(logs.length >= 4){
alert("Maximum logs reached today")
return
}

const { data, error } = await supabase
.from("attendance_logs")
.insert({

emp_id: emp_id,
log_time: new Date(),
latitude: gps.lat,
longitude: gps.lng,
accuracy: gps.accuracy,
address: address,
device_id: deviceType

})

if(error){
console.error(error)
alert("Database insert error: " + error.message)
return
}

alert("Attendance recorded")

location.reload()

}catch(err){

console.error(err)
alert("System error: " + err.message)

}

}

import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"

export async function clock(){

const emp_id = localStorage.getItem("emp_id")

const gps = await getGPS()

if(!gps){
alert("GPS not available")
return
}

if(gps.accuracy > 150){
alert("Weak GPS signal")
return
}

const address = await getLocation(gps.lat,gps.lng)

const log = {

emp_id: emp_id,

log_time: new Date(),

device_id: "mobile",

latitude: gps.lat,

longitude: gps.lng,

accuracy: gps.accuracy,

address: address,

place_name: address,

device_type: "MOBILE_WEB"

}

console.log("Saving log:", log)

const { data, error } = await supabase
.from("attendance_logs")
.insert([log])

if(error){

console.log("INSERT ERROR:", error)

alert("Database error: " + error.message)

return

}

console.log("Saved:", data)

alert("Clock saved")

location.reload()

}

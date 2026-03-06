
import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getLocation } from "./location.js"

export async function clock(){

const emp_id = localStorage.getItem("emp_id")
const device = localStorage.getItem("device_guid")

const gps = await getGPS()
const address = await getLocation(gps.lat,gps.lng)

const today = new Date().toISOString().split("T")[0]

const { data } = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)

if(data.length >= 4){
alert("Maximum logs reached today")
return
}

await supabase
.from("attendance_logs")
.insert({
emp_id:emp_id,
log_time:new Date(),
latitude:gps.lat,
longitude:gps.lng,
accuracy:gps.accuracy,
address:address,
device_id:device,
device_type:"MOBILE_WEB"
})

alert("Attendance recorded")

location.reload()

}

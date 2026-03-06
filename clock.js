import { supabase } from "./supabase.js"
import { getGPS } from "./gps.js"
import { getAddress } from "./location.js"

function detectDevice(){

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

if(isMobile){
return "MOBILE_WEB"
}else{
return "KIOSK"
}

}

export async function clock(){

const emp_id = localStorage.getItem("emp_id")

const deviceType = detectDevice()

const gps = await getGPS()

const address = await getAddress(gps.lat,gps.lng)

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
device_id:deviceType

})

alert("Attendance recorded")

location.reload()

}

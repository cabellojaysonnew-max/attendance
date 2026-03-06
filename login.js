import { supabase } from "./supabase.js"

function generateGUID(){
return crypto.randomUUID()
}

window.login = async function(){

const emp_id = document.getElementById("emp_id").value
const pass = document.getElementById("pass").value

const { data, error } = await supabase
.from("employees")
.select("*")
.eq("emp_id", emp_id)
.eq("pass", pass)
.single()

if(error || !data){
alert("Invalid login")
return
}

let device = localStorage.getItem("device_guid")

// CASE 1: browser has no GUID but database has one (same phone different browser)
if(!device && data.mobile_device){

device = data.mobile_device
localStorage.setItem("device_guid", device)

}

// CASE 2: first login ever
if(!device && !data.mobile_device){

device = generateGUID()

localStorage.setItem("device_guid", device)

await supabase
.from("employees")
.update({ mobile_device: device })
.eq("emp_id", emp_id)

}

// CASE 3: database empty but browser has GUID
if(device && !data.mobile_device){

await supabase
.from("employees")
.update({ mobile_device: device })
.eq("emp_id", emp_id)

}

// CASE 4: device mismatch
if(data.mobile_device && device !== data.mobile_device){

alert("Unauthorized device. Contact HR.")
return

}

localStorage.setItem("emp_id", emp_id)
localStorage.setItem("emp_name", data.full_name)

location.href="dashboard.html"

}

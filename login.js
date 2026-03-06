
import { supabase } from "./supabase.js"

function generateGUID(){ return crypto.randomUUID() }

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

if(!device && data.mobile_device){
device = data.mobile_device
localStorage.setItem("device_guid", device)
}

if(!device && !data.mobile_device){
device = generateGUID()
localStorage.setItem("device_guid", device)

await supabase
.from("employees")
.update({ mobile_device: device })
.eq("emp_id", emp_id)
}

if(data.mobile_device && device !== data.mobile_device){
alert("Unauthorized device")
return
}

localStorage.setItem("emp_id", emp_id)
localStorage.setItem("emp_name", data.full_name)

location.href = "dashboard.html"

}

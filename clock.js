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
alert("Invalid employee number or password")
return
}

let device = localStorage.getItem("device_guid")

if(!device){
device = generateGUID()
localStorage.setItem("device_guid", device)
}

// FIRST LOGIN OR RESET
if(!data.mobile_device){

const { error:updateError } = await supabase
.from("employees")
.update({ mobile_device: device })
.eq("emp_id", emp_id)

if(updateError){
alert("Failed to register device")
console.log(updateError)
return
}

// allow login immediately after registering device
localStorage.setItem("emp_id", emp_id)
localStorage.setItem("emp_name", data.full_name)

location.href="dashboard.html"
return
}

// DEVICE CHECK
if(data.mobile_device !== device){
alert("Unauthorized device. Contact HR.")
return
}

localStorage.setItem("emp_id", emp_id)
localStorage.setItem("emp_name", data.full_name)

location.href="dashboard.html"

}

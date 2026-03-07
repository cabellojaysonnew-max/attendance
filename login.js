
import { supabase } from "./supabase.js"
import { getFingerprint } from "./fingerprint.js"

function guid(){ return crypto.randomUUID() }

window.login=async function(){

const emp_id=document.getElementById("emp_id").value
const pass=document.getElementById("pass").value

if(!navigator.onLine){

const cached=JSON.parse(localStorage.getItem("cached_user"))

if(cached && cached.emp_id===emp_id && cached.pass===pass){

localStorage.setItem("emp_id",cached.emp_id)
localStorage.setItem("emp_name",cached.full_name)

location.href="dashboard.html"
return
}

alert("Offline login failed")
return
}

const fingerprint=await getFingerprint()

const {data,error}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.eq("pass",pass)
.single()

if(error||!data){
alert("Invalid login")
return
}

let device=localStorage.getItem("device_guid")

if(!device){
device=guid()
localStorage.setItem("device_guid",device)
}

if(!data.device_guid){

await supabase.from("employees")
.update({
device_guid:device,
device_fp:fingerprint
})
.eq("emp_id",emp_id)

}

if(data.device_guid && data.device_fp){

if(data.device_guid!==device || data.device_fp!==fingerprint){
alert("Unauthorized device")
return
}

}

localStorage.setItem("emp_id",emp_id)
localStorage.setItem("emp_name",data.full_name)

localStorage.setItem("cached_user",JSON.stringify({
emp_id:data.emp_id,
pass:data.pass,
full_name:data.full_name
}))

location.href="dashboard.html"

}

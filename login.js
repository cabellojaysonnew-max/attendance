
import { supabase } from "./supabase.js"
import { createSession } from "./session.js"
import { getDevice } from "./device.js"

window.login = async function(){

const emp_id=document.getElementById("emp_id").value
const pass=document.getElementById("pass").value

const {data}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.eq("pass",pass)

if(!data || data.length==0){
 alert("Invalid login")
 return
}

const user=data[0]
const device=getDevice()

if(!user.mobile_device){

 await supabase
 .from("employees")
 .update({mobile_device:device})
 .eq("emp_id",emp_id)

}else{

 if(user.mobile_device !== device){
  alert("Unauthorized device")
  return
 }

}

createSession(emp_id,user.full_name)

location.href="dashboard.html"

}

import { supabase } from "./supabase.js"
import { createSession } from "./session.js"
import { getDevice } from "./device.js"

window.login = async function(){

const emp_id = document.getElementById("emp_id").value
const pass = document.getElementById("pass").value

const {data} = await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.eq("pass",pass)

if(!data || data.length==0){
 alert("Invalid login")
 return
}

const user = data[0]
const device = getDevice()
const today = new Date().toISOString().split("T")[0]

/* DAILY DEVICE CHECK */

const {data:deviceCheck} = await supabase
.from("device_daily")
.select("*")
.eq("device_id",device)
.eq("log_date",today)

if(deviceCheck.length > 0){

 if(deviceCheck[0].emp_id !== emp_id){
  alert("This phone has already been used by another employee today.")
  return
 }

}else{

 await supabase
 .from("device_daily")
 .insert([{
   device_id:device,
   emp_id:emp_id,
   log_date:today
 }])

}

/* CREATE SESSION */

createSession(emp_id,user.full_name)

location.href="dashboard.html"

}

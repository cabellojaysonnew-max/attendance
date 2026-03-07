
import { supabase } from "./supabase.js"
import { clock } from "./clock.js"
import { getOffline } from "./offline.js"

const emp_id=localStorage.getItem("emp_id")
const emp_name=localStorage.getItem("emp_name")

document.getElementById("empName").innerText=emp_name
document.getElementById("clockBtn").onclick=clock

loadLogs()

async function loadLogs(){

let logs=[]

if(navigator.onLine){

const today=new Date().toISOString().split("T")[0]

const {data}=await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.eq("device_type","MOBILE_WEB")
.gte("log_time",today)
.order("log_time",{ascending:true})

logs=data||[]

}else{

logs=getOffline()

}

render(logs)
}

function render(logs){

let html=""

logs.forEach((log,index)=>{

let color=(index%2===0)?"green":"red"

html+=`<div class="log ${color}">
${new Date(log.log_time).toLocaleTimeString()}<br>
${log.address}
</div>`

})

document.getElementById("logs").innerHTML=html

}

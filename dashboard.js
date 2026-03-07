import { supabase } from "./supabase.js"
import { clock } from "./clock.js"

const emp_id=localStorage.getItem("emp_id")
const emp_name=localStorage.getItem("emp_name")

document.getElementById("empName").innerText=emp_name
document.getElementById("clockBtn").onclick=clock

loadLogs()

async function loadLogs(){

const today=new Date().toISOString().split("T")[0]

const {data}=await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)
.order("log_time",{ascending:true})

render(data||[])

}

function render(logs){

let html=""

logs.forEach((log,index)=>{

let color=(index%2===0)?"green":"red"

html+=`<div class="log ${color}">
${new Date(log.log_time).toLocaleTimeString()}<br>
${log.place_name||log.address}
</div>`

})

document.getElementById("logs").innerHTML=html

}

/* -------- DEVTOOLS DETECTION -------- */

setInterval(()=>{

const devtoolsOpen =
window.outerWidth - window.innerWidth > 160 ||
window.outerHeight - window.innerHeight > 160

if(devtoolsOpen){
 alert("Developer tools detected")
 location.href="index.html"
}

},1000)

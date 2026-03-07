import { supabase } from "./supabase.js"
import { clock } from "./clock.js"
import { getOffline } from "./offline.js"
import { syncLogs } from "./sync.js"

const emp_id = localStorage.getItem("emp_id")
const emp_name = localStorage.getItem("emp_name")

document.getElementById("empName").innerText = emp_name
document.getElementById("clockBtn").onclick = clock

loadLogs()

async function loadLogs(){

const today = new Date().toISOString().split("T")[0]

let logs = []

try{

const {data} = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)
.order("log_time",{ascending:true})

logs = data || []

}catch(e){

console.log("Offline mode")

}

/* ADD OFFLINE LOGS */

const offline = getOffline()

logs = logs.concat(offline)

logs.sort((a,b)=> new Date(a.log_time) - new Date(b.log_time))

render(logs)

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

/* -------- AUTO SYNC WHEN INTERNET RETURNS -------- */

window.addEventListener("online",async ()=>{

await syncLogs()

loadLogs()

})

/* -------- DEVTOOLS DETECTION (DESKTOP ONLY) -------- */

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

if(!isMobile){

setInterval(()=>{

const widthDiff = window.outerWidth - window.innerWidth
const heightDiff = window.outerHeight - window.innerHeight

if(widthDiff > 200 || heightDiff > 200){
 alert("Developer tools detected")
 location.href="index.html"
}

},2000)

}

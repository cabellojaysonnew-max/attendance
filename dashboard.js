import { supabase } from "./supabase.js"
import { clock } from "./clock.js"
import { getOffline } from "./offline.js"
import { syncLogs } from "./sync.js"

/* ---------------- HARD SESSION PROTECTION ---------------- */

const emp_id = localStorage.getItem("emp_id")
const emp_name = localStorage.getItem("emp_name")

if(!emp_id){
 location.replace("index.html")
}

/* ---------------- SINGLE TAB PROTECTION ---------------- */

if(localStorage.getItem("dar_attendance_active_tab")){
 alert("Attendance system already open in another tab.")
 location.replace("index.html")
}

localStorage.setItem("dar_attendance_active_tab","active")

window.addEventListener("beforeunload",()=>{
 localStorage.removeItem("dar_attendance_active_tab")
})

/* ---------------- DISPLAY USER ---------------- */

document.getElementById("empName").innerText = emp_name

/* ---------------- CLOCK BUTTON ---------------- */

document.getElementById("clockBtn").onclick = clock

/* ---------------- MIDNIGHT RESET ---------------- */

function resetIfNewDay(){

 const today = new Date().toISOString().split("T")[0]
 const savedDate = localStorage.getItem("attendance_date")

 if(savedDate !== today){

  localStorage.setItem("attendance_date", today)

  localStorage.removeItem("today_logs")
  localStorage.removeItem("offline_logs")

  console.log("New day detected — local logs reset")

 }

}

resetIfNewDay()

/* ---------------- INITIAL LOAD ---------------- */

loadLogs()

/* ---------------- LOAD TODAY LOGS ---------------- */

async function loadLogs(){

const today = new Date().toISOString().split("T")[0]

let logs=[]

try{

const {data,error} = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time",today)
.order("log_time",{ascending:true})

if(!error && data){
 logs=data
}

}catch(e){

 console.log("Offline mode")

}

/* ADD OFFLINE LOGS */

const offline=getOffline()

logs=logs.concat(offline)

/* SORT */

logs.sort((a,b)=> new Date(a.log_time)-new Date(b.log_time))

render(logs)

}

/* ---------------- RENDER LOGS ---------------- */

function render(logs){

let html=""

logs.forEach((log,index)=>{

let color=(index%2===0)?"green":"red"

html+=`
<div class="log ${color}">
${new Date(log.log_time).toLocaleTimeString()}<br>
${log.place_name || log.address || "Location unavailable"}
</div>
`

})

document.getElementById("logs").innerHTML=html

}

/* ---------------- SYNC WHEN INTERNET RETURNS ---------------- */

window.addEventListener("online",async ()=>{

console.log("Internet detected — syncing logs")

await syncLogs()

loadLogs()

})

/* ---------------- AUTO SYNC EVERY 10 MINUTES ---------------- */

setInterval(async ()=>{

if(navigator.onLine){

 console.log("Running 10-minute sync")

 await syncLogs()

 loadLogs()

}

},600000)

/* ---------------- DEVTOOLS DETECTION (DESKTOP ONLY) ---------------- */

const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

if(!isMobile){

setInterval(()=>{

const widthDiff=window.outerWidth-window.innerWidth
const heightDiff=window.outerHeight-window.innerHeight

if(widthDiff>200 || heightDiff>200){

 alert("Developer tools detected")

 location.replace("index.html")

}

},2000)

}

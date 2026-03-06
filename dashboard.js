
import { supabase } from "./supabase.js"
import { clock } from "./clock.js"

const emp_id = localStorage.getItem("emp_id")
const emp_name = localStorage.getItem("emp_name")

document.getElementById("empName").innerText = emp_name

const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)

const btn = document.getElementById("clockBtn")

if(!isMobile){
btn.disabled = true
document.getElementById("deviceWarning").innerHTML =
"Clocking allowed only on mobile device."
}

btn.onclick = clock

loadLogs()

async function loadLogs(){

const { data } = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id", emp_id)
.eq("device_id","MOBILE_WEB")
.order("log_time",{ascending:true})

let html=""

data.forEach((log,index)=>{

let colorClass = (index % 2 === 0) ? "green" : "red"

html += `
<div class="log ${colorClass}">
<b>${new Date(log.log_time).toLocaleString()}</b>
<br>
${log.address}
</div>
`

})

document.getElementById("logs").innerHTML = html

}

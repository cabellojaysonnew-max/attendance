import { supabase } from "./supabase.js"
import { clock } from "./clock.js"

const emp_id = localStorage.getItem("emp_id")
const emp_name = localStorage.getItem("emp_name")

document.getElementById("empName").innerText = emp_name
document.getElementById("clockBtn").onclick = clock

loadLogs()

async function loadLogs(){

const start = new Date()
start.setHours(0,0,0,0)

const end = new Date()
end.setHours(23,59,59,999)

const { data } = await supabase
.from("attendance_logs")
.select("*")
.eq("emp_id",emp_id)
.gte("log_time", start.toISOString())
.lte("log_time", end.toISOString())
.order("log_time",{ascending:true})

render(data || [])

}

function render(logs){

let html=""

logs.forEach((log,index)=>{

let color = (index % 2 === 0) ? "green" : "red"

html += `<div class="log ${color}">
${new Date(log.log_time).toLocaleTimeString()}<br>
${log.place_name || log.address}
</div>`

})

document.getElementById("logs").innerHTML = html

}

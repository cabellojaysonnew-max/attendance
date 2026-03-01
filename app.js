
import { supabase } from "./supabase.js";

const FUNCTION_URL="https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";
const isMobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

function deviceId(){
 if(!isMobile) return "KIOSK_PC";
 let id=localStorage.device_id;
 if(!id){id=crypto.randomUUID();localStorage.device_id=id;}
 return id;
}

/* AUTO SESSION */
const empStored=localStorage.employee;

if(empStored && location.pathname.includes("login")){
 location.href="dashboard.html";
}

if(empStored && location.pathname.includes("dashboard")){
 const emp=JSON.parse(empStored);
 document.getElementById("empName").innerText=emp.full_name;
 document.getElementById("empPosition").innerText=emp.position;
 loadLogs();
}

/* LOGIN */
window.login = async function(){

 const {data,error}=await supabase
 .from("employees")
 .select("*")
 .eq("emp_id",emp_id.value)
 .eq("pass",pass.value)
 .single();

 if(error){
  msg.innerText="Invalid login";
  return;
 }

 localStorage.employee=JSON.stringify(data);
 location.href="dashboard.html";
};

/* GPS */
function freshGPS(){
 return new Promise((res,rej)=>{
 navigator.geolocation.getCurrentPosition(
  p=>res(p.coords),
  rej,
  {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });
}

/* CLOCK IN OUT */
window.logAttendance = async function(){

 if(!isMobile){
  alert("Mobile device required.");
  return;
 }

 status.innerText="Getting GPS...";

 const gps=await freshGPS();
 const emp=JSON.parse(localStorage.employee);

 const body={
  emp_id:emp.emp_id,
  device_id:deviceId(),
  latitude:gps.latitude,
  longitude:gps.longitude,
  accuracy:gps.accuracy
 };

 const res=await fetch(FUNCTION_URL,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(body)
 });

 const data=await res.json();

 status.innerText=data.status + " recorded";
 statusBadge.innerText=data.status;

 loadLogs();
};

async function loadLogs(){

 const emp=JSON.parse(localStorage.employee);

 const {data}=await supabase
 .from("attendance_logs")
 .select("*")
 .eq("emp_id",emp.emp_id)
 .neq("device_id","KIOSK_PC")
 .order("log_time",{ascending:false})
 .limit(5);

 logs.innerHTML=(data||[]).map(l=>`
 <div class="log">
  <b>${l.status}</b> — ${new Date(l.log_time).toLocaleString()}<br>
  ${l.place_name||"Location pending"}
 </div>`).join("");
}

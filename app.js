
import { supabase } from "./supabase.js";

const FUNCTION_URL="https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";
const isMobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

function deviceId(){
 if(!isMobile) return "KIOSK_PC";
 let id=localStorage.device_id;
 if(!id){id=crypto.randomUUID();localStorage.device_id=id;}
 return id;
}

const empStored=localStorage.employee;

if(empStored && location.pathname.includes("login")){
 location.href="dashboard.html";
}

if(empStored && location.pathname.includes("dashboard")){
 const emp=JSON.parse(empStored);
 empName.innerText=emp.full_name;
 empPosition.innerText=emp.position;
 loadLogs();
}

window.login = async function(){

 msg.innerText="";

 try{
 const {data,error}=await supabase
 .from("employees")
 .select("*")
 .eq("emp_id",emp_id.value)
 .eq("pass",pass.value)
 .single();

 if(error || !data){
   msg.innerText="Invalid credentials";
   return;
 }

 localStorage.employee=JSON.stringify(data);
 location.href="dashboard.html";

 }catch(e){
   msg.innerText="Connection error";
 }
};

function freshGPS(){
 return new Promise((res,rej)=>{
 navigator.geolocation.getCurrentPosition(
  p=>res(p.coords),
  err=>rej(err),
  {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });
}

window.logAttendance = async function(){

 error.innerText="";
 status.innerText="Preparing...";

 if(!navigator.onLine){
   error.innerText="No internet connection";
   return;
 }

 if(!isMobile){
   error.innerText="Mobile device required";
   return;
 }

 try{

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

 status.innerText="Sending attendance...";

 const res=await fetch(FUNCTION_URL,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(body)
 });

 if(!res.ok){
   const txt=await res.text();
   throw new Error(txt);
 }

 const data=await res.json();

 status.innerText=data.status+" recorded ✔";
 loadLogs();

 }catch(e){
   console.error(e);
   error.innerText=e.message || "Failed to save attendance";
   status.innerText="";
 }
};

async function loadLogs(){

 const emp=JSON.parse(localStorage.employee);

 const {data,error:err}=await supabase
 .from("attendance_logs")
 .select("*")
 .eq("emp_id",emp.emp_id)
 .neq("device_id","KIOSK_PC")
 .order("log_time",{ascending:false})
 .limit(5);

 if(err){
   logs.innerHTML="Cannot load logs";
   return;
 }

 logs.innerHTML=(data||[]).map(l=>`
 <div class="log">
  <b>${l.status}</b> — ${new Date(l.log_time).toLocaleString()}<br>
  ${l.place_name||"Location pending"}
 </div>`).join("");
}

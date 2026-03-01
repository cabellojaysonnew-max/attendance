
import { supabase } from "./supabase.js";

const FUNCTION_URL="https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";

function logStep(msg){
 const box=document.getElementById("debug");
 box.textContent += "\n"+msg;
 box.scrollTop=box.scrollHeight;
}

function getDeviceId(){
 let id=localStorage.getItem("DAR_DEVICE_ID");
 if(!id){
   id=crypto.randomUUID();
   localStorage.setItem("DAR_DEVICE_ID",id);
 }
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

window.login=async function(){

 msg.innerText="Logging in...";

 const {data,error}=await supabase
 .from("employees")
 .select("*")
 .eq("emp_id",emp_id.value)
 .eq("pass",pass.value)
 .single();

 if(error||!data){
   msg.innerText="Invalid login";
   return;
 }

 localStorage.employee=JSON.stringify(data);
 location.href="dashboard.html";
};

window.clock=async function(){

 const debug=document.getElementById("debug");
 debug.textContent="START CLOCK PROCESS";

 status.innerText="";
 error.innerText="";

 try{

 logStep("1️⃣ Button clicked");

 if(!navigator.onLine){
   throw new Error("No internet connection");
 }

 logStep("2️⃣ Requesting GPS");

 const gps=await new Promise((resolve,reject)=>{
 navigator.geolocation.getCurrentPosition(
  p=>resolve(p.coords),
  ()=>reject(new Error("GPS denied")),
  {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });

 logStep("GPS OK lat="+gps.latitude);

 const emp=JSON.parse(localStorage.employee);

 const payload={
   emp_id:emp.emp_id,
   device_id:getDeviceId(),
   latitude:gps.latitude,
   longitude:gps.longitude,
   accuracy:gps.accuracy
 };

 logStep("3️⃣ Sending request");

 const res=await fetch(FUNCTION_URL,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(payload)
 });

 logStep("4️⃣ Response status="+res.status);

 const text=await res.text();

 if(!res.ok){
   logStep("EDGE ERROR: "+text);
   throw new Error(text);
 }

 const data=JSON.parse(text);

 logStep("5️⃣ Database insert success");

 status.innerText=data.status+" recorded ✔";

 loadLogs();

 }catch(e){

 logStep("❌ ERROR: "+e.message);

 error.innerText=e.message;
 status.innerText="";
 }
};

async function loadLogs(){

 const emp=JSON.parse(localStorage.employee);

 const {data}=await supabase
 .from("attendance_logs")
 .select("*")
 .eq("emp_id",emp.emp_id)
 .eq("device_type","MOBILE_WEB")
 .order("log_time",{ascending:false})
 .limit(5);

 logs.innerHTML=(data||[]).map(l=>`
 <div class="log">
 <b>${l.status}</b> — ${new Date(l.log_time).toLocaleString()}<br>
 ${l.place_name||""}
 </div>`).join("");
}


import { supabase } from "./supabase.js";

const FUNCTION_URL =
"https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";

const isMobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

function deviceId(){
 let id=localStorage.device_id;
 if(!id){
   id=crypto.randomUUID();
   localStorage.device_id=id;
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

window.login = async function(){

 msg.innerText="Logging in...";

 const {data,error}=await supabase
  .from("employees")
  .select("*")
  .eq("emp_id",emp_id.value)
  .eq("pass",pass.value)
  .single();

 if(error || !data){
   msg.innerText="Invalid login";
   return;
 }

 localStorage.employee=JSON.stringify(data);
 location.href="dashboard.html";
};

function getGPS(){
 return new Promise((resolve,reject)=>{
 navigator.geolocation.getCurrentPosition(
  p=>resolve(p.coords),
  ()=>reject(new Error("GPS permission denied")),
  {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });
}

window.clock = async function(){

 status.innerText="";
 error.innerText="";

 if(!isMobile){
   error.innerText="Use mobile phone only.";
   return;
 }

 if(!navigator.onLine){
   error.innerText="No internet connection.";
   return;
 }

 try{

 status.innerText="Getting GPS...";

 const gps=await getGPS();
 const emp=JSON.parse(localStorage.employee);

 status.innerText="Sending attendance...";

 const res=await fetch(FUNCTION_URL,{
   method:"POST",
   headers:{ "Content-Type":"application/json" },
   body:JSON.stringify({
     emp_id:emp.emp_id,
     device_id:deviceId(),
     latitude:gps.latitude,
     longitude:gps.longitude,
     accuracy:gps.accuracy
   })
 });

 const text=await res.text();

 if(!res.ok) throw new Error(text);

 const data=JSON.parse(text);

 status.innerText=data.status+" recorded ✔";

 loadLogs();

 }catch(e){
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
  .order("log_time",{ascending:false})
  .limit(5);

 logs.innerHTML=(data||[]).map(l=>`
  <div class="log">
   <b>${l.status}</b> — ${new Date(l.log_time).toLocaleString()}<br>
   ${l.place_name || ""}
  </div>`).join("");
}

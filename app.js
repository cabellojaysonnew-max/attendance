
import { supabase } from "./supabase.js";

const FUNCTION_URL="https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";
const isMobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

function getDeviceId(){
 let id=localStorage.getItem("DAR_DEVICE_ID");
 if(!id){
   id=crypto.randomUUID();
   localStorage.setItem("DAR_DEVICE_ID",id);
 }
 return id;
}

function queueOffline(data){
 let q=JSON.parse(localStorage.getItem("offline_logs")||"[]");
 q.push(data);
 localStorage.setItem("offline_logs",JSON.stringify(q));
}

async function syncOffline(){
 let q=JSON.parse(localStorage.getItem("offline_logs")||"[]");
 if(!q.length) return;
 for(const item of q){
   try{
     await fetch(FUNCTION_URL,{
       method:"POST",
       headers:{"Content-Type":"application/json"},
       body:JSON.stringify(item)
     });
   }catch{return;}
 }
 localStorage.removeItem("offline_logs");
}

function detectSpoof(coords){
 if(coords.accuracy>100){
   throw new Error("Low GPS accuracy detected (possible spoof)");
 }
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
 syncOffline();
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

function getGPS(){
 return new Promise((resolve,reject)=>{
 navigator.geolocation.getCurrentPosition(
  p=>resolve(p.coords),
  ()=>reject(new Error("GPS permission denied")),
  {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });
}

window.clock=async function(){

 status.innerText="";
 error.innerText="";

 if(!isMobile){
   error.innerText="Mobile device required.";
   return;
 }

 try{

 status.innerText="Getting GPS...";
 const gps=await getGPS();
 detectSpoof(gps);

 const emp=JSON.parse(localStorage.employee);

 const payload={
  emp_id:emp.emp_id,
  device_id:getDeviceId(),
  latitude:gps.latitude,
  longitude:gps.longitude,
  accuracy:gps.accuracy
 };

 if(!navigator.onLine){
   queueOffline(payload);
   status.innerText="Saved offline ✔";
   return;
 }

 status.innerText="Sending attendance...";

 const res=await fetch(FUNCTION_URL,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(payload)
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
 .eq("device_type","MOBILE_WEB")
 .order("log_time",{ascending:false})
 .limit(5);

 logs.innerHTML=(data||[]).map(l=>`
 <div class="log">
 <b>${l.status}</b> — ${new Date(l.log_time).toLocaleString()}<br>
 ${l.place_name||""}
 </div>`).join("");
}

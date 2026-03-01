
import { supabase } from "./supabase.js";

const FUNCTION_URL =
"https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";

const isMobile =
/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

function deviceId(){

 if(!isMobile) return "KIOSK_PC";

 let id = localStorage.device_id;
 if(!id){
   id = crypto.randomUUID();
   localStorage.device_id=id;
 }
 return id;
}

function freshGPS(){
 return new Promise((resolve,reject)=>{
   navigator.geolocation.getCurrentPosition(
     p=>resolve(p.coords),
     reject,
     { enableHighAccuracy:true, maximumAge:0, timeout:15000 }
   );
 });
}

window.logAttendance = async ()=>{

 if(!isMobile){
   alert("Logging allowed only on registered mobile device.");
   return;
 }

 status.innerText="Refreshing GPS...";

 const gps = await freshGPS();
 const emp = JSON.parse(localStorage.employee);

 const log={
   emp_id:emp.emp_id,
   device_id:deviceId(),
   latitude:gps.latitude,
   longitude:gps.longitude,
   accuracy:gps.accuracy
 };

 if(!navigator.onLine){
   saveOffline(log);
   status.innerText="Saved offline ✔";
   return;
 }

 const res = await fetch(FUNCTION_URL,{
   method:"POST",
   headers:{ "Content-Type":"application/json" },
   body:JSON.stringify(log)
 });

 const data = await res.json();

 status.innerText =
 `${data.log_type} recorded at ${data.place_name}`;

 loadLogs();
};

window.loadLogs = async function(){

 const emp = JSON.parse(localStorage.employee);

 const { data } = await supabase
  .from("attendance_logs")
  .select("*")
  .eq("emp_id",emp.emp_id)
  .neq("device_id","KIOSK_PC")
  .order("log_time",{ascending:false})
  .limit(5);

 if(!data?.length){
   logs.innerHTML="<small>No mobile logs</small>";
   return;
 }

 logs.innerHTML=data.map(l=>`
  <div class="log">
   ${l.log_type} — ${new Date(l.log_time).toLocaleString()}<br>
   ${l.place_name}
  </div>`).join("");
};

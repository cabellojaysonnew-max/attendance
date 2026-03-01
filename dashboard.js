
import { supabase } from "./supabase.js";

function getFreshGPS(){
 return new Promise((resolve,reject)=>{
   navigator.geolocation.getCurrentPosition(
     p=>resolve(p.coords),
     reject,
     {
       enableHighAccuracy:true,
       maximumAge:0,
       timeout:15000
     }
   );
 });
}

async function getPlace(lat,lon){
 try{
 const res = await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
 );
 const data = await res.json();
 return data.display_name || "Unknown location";
 }catch{
  return "Location lookup failed";
 }
}

window.logAttendance = async ()=>{

 const status = document.getElementById("status");
 status.innerText="Capturing GPS...";

 const gps = await getFreshGPS();

 const place = navigator.onLine
   ? await getPlace(gps.latitude,gps.longitude)
   : "Offline (location pending)";

 const emp = JSON.parse(localStorage.employee);

 const log = {
   emp_id:emp.emp_id,
   latitude:gps.latitude,
   longitude:gps.longitude,
   place_name:place,
   device_type:"MOBILE_WEB"
 };

 if(!navigator.onLine){
   window.saveOffline(log);
   status.innerText="Saved offline";
   return;
 }

 await supabase.from("attendance_logs").insert(log);

 status.innerText="Attendance recorded";
 loadLogs();
};

window.loadLogs = async function(){

 const emp = JSON.parse(localStorage.employee);

 const { data } = await supabase
  .from("attendance_logs")
  .select("*")
  .eq("emp_id",emp.emp_id)
  .eq("device_type","MOBILE_WEB")
  .order("log_time",{ascending:false})
  .limit(5);

 const logsDiv = document.getElementById("logs");

 if(!data || !data.length){
   logsDiv.innerHTML="<small>No records</small>";
   return;
 }

 logsDiv.innerHTML = data.map(l=>`
   <div class="log">
     ${new Date(l.log_time).toLocaleString()}<br>
     ${l.place_name}
   </div>
 `).join("");
};

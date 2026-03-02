
console.log("APP JS LOADED");

function logStep(msg){
 const box=document.getElementById("debug");
 if(!box) return;
 box.textContent += "\n"+msg;
 box.scrollTop=box.scrollHeight;
}

async function login(){

 msg.innerText="Logging in...";

 try{
 const {data,error}=await supabase
   .from("employees")
   .select("*")
   .eq("emp_id",emp_id.value.trim())
   .eq("pass",pass.value.trim())
   .single();

 if(error || !data){
   msg.innerText="Invalid login";
   return;
 }

 localStorage.setItem("employee",JSON.stringify(data));
 location.href="dashboard.html";

 }catch(e){
   msg.innerText="LOGIN ERROR: "+e.message;
 }
}

if(localStorage.employee && location.pathname.includes("dashboard")){
 const emp=JSON.parse(localStorage.employee);
 empName.innerText=emp.full_name || emp.emp_id;
 empPosition.innerText=emp.position || "";
 loadLogs();
}

async function clock(){

 document.getElementById("status").innerText="";
 document.getElementById("error").innerText="";
 document.getElementById("debug").textContent="START CLOCK";

 try{

 logStep("Requesting GPS");

 const coords=await new Promise((resolve,reject)=>{
 navigator.geolocation.getCurrentPosition(
   p=>resolve(p.coords),
   ()=>reject(new Error("GPS denied")),
   {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });

 logStep("GPS OK");

 const emp=JSON.parse(localStorage.employee);

 const {error}=await supabase
   .from("attendance_logs")
   .insert({
     emp_id:emp.emp_id,
     latitude:coords.latitude,
     longitude:coords.longitude,
     accuracy:coords.accuracy,
     status:"IN",
     device_type:"MOBILE_WEB"
   });

 if(error) throw error;

 logStep("Database insert success");

 status.innerText="Attendance saved ✔";
 loadLogs();

 }catch(e){
   error.innerText=e.message;
   logStep("ERROR: "+e.message);
 }
}

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
 ${l.status||"LOG"} — ${new Date(l.log_time).toLocaleString()}
 </div>`).join("");
}

window.login=login;
window.clock=clock;

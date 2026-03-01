
const FUNCTION_URL="https://ytfpiyfapvybihlngxks.functions.supabase.co/log-attendance";

function logStep(msg){
 const box=document.getElementById("debug");
 if(!box) return;
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

async function login(){
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
}

async function clock(){

 const debug=document.getElementById("debug");
 if(debug) debug.textContent="START CLOCK PROCESS";

 status.innerText="";
 error.innerText="";

 try{

 logStep("Button clicked");

 const gps=await new Promise((resolve,reject)=>{
 navigator.geolocation.getCurrentPosition(
  p=>resolve(p.coords),
  ()=>reject(new Error("GPS denied")),
  {enableHighAccuracy:true,maximumAge:0,timeout:15000}
 );
 });

 logStep("GPS OK");

 const emp=JSON.parse(localStorage.employee);

 const payload={
   emp_id:emp.emp_id,
   device_id:getDeviceId(),
   latitude:gps.latitude,
   longitude:gps.longitude,
   accuracy:gps.accuracy
 };

 logStep("Sending request");

 const res=await fetch(FUNCTION_URL,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(payload)
 });

 logStep("Response "+res.status);

 const text=await res.text();
 if(!res.ok) throw new Error(text);

 const data=JSON.parse(text);

 status.innerText=data.status+" recorded ✔";

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
 <b>${l.status||"LOG"}</b> — ${new Date(l.log_time).toLocaleString()}
 </div>`).join("");
}

window.login=login;
window.clock=clock;

async function clock(){

 const user=JSON.parse(localStorage.getItem("user"));
 const today=new Date().toISOString().split("T")[0];

 const {data}=await supabase
  .from("attendance_logs")
  .select("*")
  .eq("emp_id",user.emp_id)
  .gte("log_time",today);

 const count=data.length;

 if(count>=4){
  alert("Maximum logs reached");
  return;
 }

 const types=["CLOCK IN","BREAK OUT","BREAK IN","CLOCK OUT"];
 const statusType=types[count];

 const gps=await getLocation();

 const payload={
  emp_id:user.emp_id,
  device_id:getDeviceId(),
  latitude:gps.latitude,
  longitude:gps.longitude,
  address:gps.address,
  place_name:gps.place_name,
  status:statusType,
  device_type:"MOBILE_WEB"
 };

 if(!navigator.onLine){
   saveOffline(payload);
   status.innerText=statusType+" saved offline";
   return;
 }

 await supabase.from("attendance_logs").insert(payload);
 status.innerText=statusType+" recorded at "+gps.place_name;
}

function getDeviceId(){
 let id=localStorage.getItem("device_id");
 if(!id){
   id=crypto.randomUUID();
   localStorage.setItem("device_id",id);
 }
 return id;
}
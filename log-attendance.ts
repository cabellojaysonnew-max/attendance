import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async(req)=>{

const supabase=createClient(
 Deno.env.get("SUPABASE_URL")!,
 Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const body=await req.json();

const {emp_id,device_id,latitude,longitude,accuracy}=body;

/* ======================
   EMPLOYEE CHECK
======================*/

const {data:emp}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.single();

if(!emp)
 return new Response("Invalid employee",{status:401});

/* ======================
   DEVICE LOCK
======================*/

if(device_id==="KIOSK_PC")
 return new Response("Laptop logging not allowed",{status:403});

if(!emp.mobile_device){

 await supabase.from("employees")
 .update({mobile_device:device_id})
 .eq("emp_id",emp_id);

}
else if(emp.mobile_device!==device_id){
 return new Response("Unauthorized device",{status:403});
}

/* ======================
   DAILY COUNT
======================*/

const today=new Date().toISOString().slice(0,10);

const {data:logsToday}=await supabase
.from("attendance_logs")
.select("id")
.eq("emp_id",emp_id)
.gte("log_time",today);

const count=logsToday?.length ?? 0;

if(count>=4)
 return new Response("Maximum logs reached",{status:403});

/* ======================
   IN OUT LOGIC
======================*/

const status = ["IN","OUT","IN","OUT"][count];

/* ======================
   LOCATION NAME
======================*/

let place_name="Unknown";

try{
 const geo=await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
 );

 const g=await geo.json();

 place_name =
   (g.address.road || "") + ", " +
   (g.address.suburb || "") + ", " +
   (g.address.city || g.address.town || "");

}catch{}

/* ======================
   INSERT LOG
======================*/

await supabase.from("attendance_logs").insert({
 emp_id,
 device_id,
 latitude,
 longitude,
 accuracy,
 place_name,
 status,                // ✅ matches your table
 device_type:"MOBILE_WEB"
});

return new Response(JSON.stringify({
 success:true,
 status,
 place_name
}),{
 headers:{ "Content-Type":"application/json" }
});

});


// rename to index.ts inside supabase/functions/log-attendance/

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async(req)=>{

const supabase=createClient(
 Deno.env.get("SUPABASE_URL")!,
 Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const body=await req.json();
const {emp_id,device_id,latitude,longitude,accuracy}=body;

const {data:emp}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.single();

if(!emp) return new Response("Invalid",{status:401});

if(device_id==="KIOSK_PC")
 return new Response("Laptop blocked",{status:403});

if(!emp.mobile_device){
 await supabase.from("employees")
 .update({mobile_device:device_id})
 .eq("emp_id",emp_id);
}else if(emp.mobile_device!==device_id){
 return new Response("Unauthorized device",{status:403});
}

const today=new Date().toISOString().slice(0,10);

const {data:logsToday}=await supabase
.from("attendance_logs")
.select("id")
.eq("emp_id",emp_id)
.gte("log_time",today);

const count=logsToday?.length??0;
if(count>=4)
 return new Response("Max logs reached",{status:403});

let log_type=["IN","OUT","IN","OUT"][count];

let place_name="Unknown";

try{
 const geo=await fetch(
 `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
 );
 const g=await geo.json();
 place_name=(g.address.road||"")+" , "+
            (g.address.suburb||"")+" , "+
            (g.address.city||g.address.town||"");
}catch{}

await supabase.from("attendance_logs").insert({
 emp_id,
 device_id,
 latitude,
 longitude,
 accuracy,
 place_name,
 log_type,
 device_type:"MOBILE_WEB"
});

return new Response(JSON.stringify({
 log_type,
 place_name
}),{headers:{"Content-Type":"application/json"}});

});

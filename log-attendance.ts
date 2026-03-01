
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async(req)=>{

try{

const supabase=createClient(
 Deno.env.get("SUPABASE_URL")!,
 Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const {emp_id,device_id,latitude,longitude,accuracy}=await req.json();

if(!emp_id || !device_id)
 return new Response("Missing data",{status:400});

const {data:emp,error:e1}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.single();

if(e1 || !emp)
 return new Response("Employee not found",{status:401});

if(device_id==="KIOSK_PC")
 return new Response("Laptop logging blocked",{status:403});

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
 return new Response("Maximum logs reached",{status:403});

const status=["IN","OUT","IN","OUT"][count];

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

const {error:e2}=await supabase.from("attendance_logs").insert({
 emp_id,
 device_id,
 latitude,
 longitude,
 accuracy,
 place_name,
 status,
 device_type:"MOBILE_WEB"
});

if(e2) throw e2;

return new Response(JSON.stringify({status,place_name}),{
 headers:{"Content-Type":"application/json"}
});

}catch(err){
 console.error(err);
 return new Response("Server error: "+err.message,{status:500});
}

});


import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const cors={
 "Access-Control-Allow-Origin":"*",
 "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"
};

serve(async(req)=>{

 if(req.method==="OPTIONS")
  return new Response("ok",{headers:cors});

 try{

 const supabase=createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
 );

 const {emp_id,device_id,latitude,longitude,accuracy}=await req.json();

 const {data:emp}=await supabase
 .from("employees")
 .select("*")
 .eq("emp_id",emp_id)
 .single();

 if(!emp) throw new Error("Employee not found");

 if(!emp.mobile_device_id){
   await supabase.from("employees")
   .update({mobile_device_id:device_id})
   .eq("emp_id",emp_id);
 }
 else if(emp.mobile_device_id!==device_id){
   throw new Error("Unauthorized device");
 }

 const today=new Date().toISOString().slice(0,10);

 const {data:logs}=await supabase
 .from("attendance_logs")
 .select("id")
 .eq("emp_id",emp_id)
 .gte("log_time",today);

 const count=logs?.length||0;
 if(count>=4) throw new Error("Maximum logs reached");

 const status=["IN","OUT","IN","OUT"][count];

 await supabase.from("attendance_logs").insert({
  emp_id,
  device_id,
  latitude,
  longitude,
  accuracy,
  status,
  device_type:"MOBILE_WEB"
 });

 return new Response(JSON.stringify({status}),{
  headers:{...cors,"Content-Type":"application/json"}
 });

 }catch(err){
  return new Response(err.message,{status:400,headers:cors});
 }
});

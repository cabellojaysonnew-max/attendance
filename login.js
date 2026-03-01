
import { supabase } from "./supabase.js";

window.login = async () => {

 const emp_id_val = document.getElementById("emp_id").value;
 const pass_val = document.getElementById("pass").value;

 const { data, error } = await supabase
   .from("employees")
   .select("*")
   .eq("emp_id", emp_id_val)
   .eq("pass", pass_val)
   .single();

 if(error){
   document.getElementById("loginMsg").innerText="Invalid login";
   return;
 }

 localStorage.employee = JSON.stringify(data);

 document.getElementById("login").hidden=true;
 document.getElementById("dashboard").hidden=false;

 document.getElementById("empName").innerText=data.full_name;
 document.getElementById("empPosition").innerText=data.position;

 window.loadLogs();
};


import { supabase } from "./supabase.js";

window.addEventListener("load",()=>{
 const saved = localStorage.employee;
 if(saved){
   showDashboard(JSON.parse(saved));
 }
});

window.login = async ()=>{

 const emp_id_val = emp_id.value;
 const pass_val = pass.value;

 const { data, error } = await supabase
   .from("employees")
   .select("*")
   .eq("emp_id", emp_id_val)
   .eq("pass", pass_val)
   .single();

 if(error){
   loginMsg.innerText="Invalid login";
   return;
 }

 localStorage.employee = JSON.stringify(data);
 showDashboard(data);
};

function showDashboard(emp){
 login.hidden=true;
 dashboard.hidden=false;
 empName.innerText=emp.full_name;
 empPosition.innerText=emp.position;
 loadLogs();
}

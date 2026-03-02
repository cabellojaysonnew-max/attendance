async function loadLogs(){

 const {data}=await supabase
  .from("attendance_logs")
  .select("emp_id,place_name,status,log_time")
  .order("log_time",{ascending:false})
  .limit(20);

 const container=document.getElementById("logs");

 container.innerHTML=data.map(l=>
  `<p><b>${l.emp_id}</b> - ${l.status}<br>${l.place_name}<br>${l.log_time}</p>`
 ).join("");
}

loadLogs();
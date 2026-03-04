if(!localStorage.getItem("user")){
 location = "index.html";
}

function logout(){
 localStorage.clear();
 location = "index.html";
}

function getLocalDate(){
 const d = new Date();
 return d.getFullYear()+"-"+
  String(d.getMonth()+1).padStart(2,'0')+"-"+
  String(d.getDate()).padStart(2,'0');
}

async function clock(){

 const status = document.getElementById("status");
 const user = JSON.parse(localStorage.getItem("user"));
 const today = getLocalDate();

 try{

   const {data:logs, error} = await db
    .from("attendance_logs")
    .select("*")
    .eq("emp_id", user.emp_id)
    .gte("log_time", today)
    .order("log_time",{ascending:true});

   if(error){
     status.innerText = error.message;
     return;
   }

   if(logs.length >= 4){
     status.innerText = "Maximum logs reached today.";
     return;
   }

   const types = ["CLOCK IN","BREAK OUT","BREAK IN","CLOCK OUT"];
   const currentType = types[logs.length];

   const payload = {
     emp_id: user.emp_id,
     status: currentType
   };

   const {error:insertError} = await db
     .from("attendance_logs")
     .insert(payload);

   if(insertError){
     status.innerText = insertError.message;
     return;
   }

   status.innerText = currentType + " recorded";

 }catch(err){

   status.innerText = err.message;

 }
}

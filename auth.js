
async function login(){

 const emp_id = document.getElementById("emp_id").value.trim();
 const password = document.getElementById("password").value.trim();

 const msg = document.getElementById("msg");
 const debug = document.getElementById("debug");

 msg.innerText = "";
 debug.innerText = "";

 if(!emp_id || !password){
   msg.innerText = "Enter employee ID and password.";
   return;
 }

 try{

   console.log("Attempting login:", emp_id);

   const {data, error} = await supabase
     .from("employees")
     .select("*")
     .eq("emp_id", emp_id)
     .eq("pass", password)
     .maybeSingle();

   console.log("Supabase response:", data, error);

   if(error){
     msg.innerText = "Database error.";
     debug.innerText = error.message;
     return;
   }

   if(!data){
     msg.innerText = "Invalid credentials.";
     debug.innerText = "No matching employee found.";
     return;
   }

   localStorage.setItem("user", JSON.stringify(data));

   msg.innerText = "Login successful.";

   setTimeout(()=>{
      location = "dashboard.html";
   },1000);

 }catch(err){

   msg.innerText = "System error.";
   debug.innerText = err.message;
   console.error(err);

 }
}

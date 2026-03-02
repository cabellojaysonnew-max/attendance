async function login(){

 const emp_id=document.getElementById("emp_id").value;
 const password=document.getElementById("password").value;

 const {data,error}=await supabase
  .from("employees")
  .select("*")
  .eq("emp_id",emp_id)
  .eq("pass",password)
  .single();

 if(error||!data){
   msg.innerText="Invalid login";
   return;
 }

 localStorage.setItem("user",JSON.stringify(data));

 if(/Android|iPhone/i.test(navigator.userAgent)){
   location="dashboard.html";
 }else{
   location="admin.html";
 }
}
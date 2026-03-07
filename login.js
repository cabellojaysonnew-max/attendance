
import { supabase } from "./supabase.js"

window.login=async function(){

const emp_id=document.getElementById("emp_id").value
const pass=document.getElementById("pass").value

const {data,error}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.eq("pass",pass)
.single()

if(error||!data){
alert("Invalid login")
return
}

localStorage.setItem("emp_id",data.emp_id)
localStorage.setItem("emp_name",data.full_name)

location.href="dashboard.html"

}

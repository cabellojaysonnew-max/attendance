
import { supabase } from "./supabase.js"

window.login=async function(){

const emp_id=document.getElementById("emp_id").value
const pass=document.getElementById("pass").value

const {data,error}=await supabase
.from("employees")
.select("*")
.eq("emp_id",emp_id)
.eq("pass",pass)

if(error){
alert("Login error")
console.log(error)
return
}

if(!data || data.length===0){
alert("Invalid login")
return
}

const user=data[0]

localStorage.setItem("emp_id",user.emp_id)
localStorage.setItem("emp_name",user.full_name)

location.href="dashboard.html"

}

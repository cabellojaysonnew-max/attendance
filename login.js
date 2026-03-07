import { supabase } from "./supabase.js"

window.login = async function(){

const emp_id = document.getElementById("emp_id").value
const pass = document.getElementById("pass").value

const { data, error } = await supabase
.from("employees")
.select("*")
.eq("emp_id", emp_id)
.eq("pass", pass)

console.log("LOGIN RESULT:", data)
console.log("LOGIN ERROR:", error)

if(error){
alert("Database error: " + error.message)
return
}

if(!data || data.length === 0){
alert("Invalid Employee Number or Password")
return
}

const user = data[0]

localStorage.setItem("emp_id", user.emp_id)
localStorage.setItem("emp_name", user.full_name)

location.href = "dashboard.html"

}

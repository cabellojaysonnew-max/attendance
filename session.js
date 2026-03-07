
export function createSession(emp_id,name){

localStorage.setItem("emp_id",emp_id)
localStorage.setItem("emp_name",name)

const expire = Date.now() + (30*24*60*60*1000)
localStorage.setItem("session_expire",expire)

}

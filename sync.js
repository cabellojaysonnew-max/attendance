import { supabase } from "./supabase.js"
import { getOffline, clearOffline } from "./offline.js"

export async function syncLogs(){

if(!navigator.onLine) return

const logs = getOffline()

if(!logs || logs.length === 0) return

let uploaded = []

for(let log of logs){

 try{

  const { error } = await supabase
  .from("attendance_logs")
  .insert([log])

  if(error){
   console.log("Upload failed:", error.message)
   continue
  }

  uploaded.push(log)

 }catch(e){

  console.log("Sync error:", e.message)

 }

}

/* remove only successfully uploaded logs */

if(uploaded.length > 0){

 const remaining = logs.filter(l => !uploaded.includes(l))

 if(remaining.length > 0){
  localStorage.setItem("offline_logs", JSON.stringify(remaining))
 }else{
  clearOffline()
 }

}

}

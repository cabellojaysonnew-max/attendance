
import { supabase } from "./supabase.js"
import { getOffline,clearOffline } from "./offline.js"

export async function syncLogs(){

if(!navigator.onLine) return

const logs=getOffline()

for(let l of logs){

await supabase
.from("attendance_logs")
.insert([l])

}

clearOffline()

}

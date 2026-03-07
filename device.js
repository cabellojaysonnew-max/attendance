
export function getDevice(){

let device = localStorage.getItem("device_guid")

if(!device){
 device = crypto.randomUUID()
 localStorage.setItem("device_guid",device)
}

return device
}

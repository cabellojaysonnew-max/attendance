export function getDevice(){

let device = localStorage.getItem("device_guid")

if(!device){

const fingerprint =
navigator.userAgent +
navigator.platform +
screen.width + "x" + screen.height +
Intl.DateTimeFormat().resolvedOptions().timeZone

device = crypto.randomUUID() + "-" + btoa(fingerprint)

localStorage.setItem("device_guid",device)

}

return device
}

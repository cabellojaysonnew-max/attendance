export function getDevice(){

let device = localStorage.getItem("device_guid")

if(!device){

const fingerprint =
navigator.userAgent +
navigator.platform +
screen.width + "x" + screen.height +
Intl.DateTimeFormat().resolvedOptions().timeZone

const encoded = btoa(fingerprint)

device = crypto.randomUUID() + "-" + encoded

localStorage.setItem("device_guid",device)

}

return device

}

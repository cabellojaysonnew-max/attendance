export function getDevice(){

const w = Math.max(screen.width,screen.height)
const h = Math.min(screen.width,screen.height)

const fingerprint = [
navigator.platform,
w,
h,
navigator.hardwareConcurrency || "0",
navigator.deviceMemory || "0",
Intl.DateTimeFormat().resolvedOptions().timeZone
].join("|")

return hashString(fingerprint)

}

function hashString(str){

let hash = 0

for(let i = 0; i < str.length; i++){
const char = str.charCodeAt(i)
hash = ((hash << 5) - hash) + char
hash |= 0
}

return "dev_" + Math.abs(hash)

}

export function getDevice(){

const fingerprint = [
navigator.userAgent,
navigator.platform,
screen.width,
screen.height,
screen.colorDepth,
navigator.language,
Intl.DateTimeFormat().resolvedOptions().timeZone,
navigator.hardwareConcurrency,
navigator.deviceMemory || "na"
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

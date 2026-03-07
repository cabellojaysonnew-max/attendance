
export async function getFingerprint(){

const data=[
navigator.userAgent,
navigator.platform,
screen.width,
screen.height,
navigator.hardwareConcurrency,
Intl.DateTimeFormat().resolvedOptions().timeZone
].join("|")

const encoder=new TextEncoder()
const buffer=await crypto.subtle.digest("SHA-256",encoder.encode(data))

const hashArray=Array.from(new Uint8Array(buffer))

return hashArray.map(b=>b.toString(16).padStart(2,"0")).join("")

}

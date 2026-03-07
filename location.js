
export async function getLocation(lat,lng){
const url=`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
const res=await fetch(url)
const data=await res.json()
return data.display_name
}

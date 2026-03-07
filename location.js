
export async function getLocation(lat,lng){

const url=`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

const r = await fetch(url)
const d = await r.json()

return d.display_name

}

let lastLocation = null
let lastTime = null

function distance(lat1, lon1, lat2, lon2){

const R = 6371e3
const φ1 = lat1 * Math.PI/180
const φ2 = lat2 * Math.PI/180
const Δφ = (lat2-lat1) * Math.PI/180
const Δλ = (lon2-lon1) * Math.PI/180

const a =
Math.sin(Δφ/2) * Math.sin(Δφ/2) +
Math.cos(φ1) * Math.cos(φ2) *
Math.sin(Δλ/2) * Math.sin(Δλ/2)

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

return R * c

}

function getSingleGPS(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(

pos=>{

// detect mocked gps
if(pos.coords.mocked === true){
reject("Fake GPS detected")
return
}

// reject poor accuracy
if(pos.coords.accuracy > 200){
reject("GPS accuracy too low")
return
}

resolve(pos.coords)

},

err=>reject(err),

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

)

})

}

export async function getGPS(){

// take 3 samples
const s1 = await getSingleGPS()
const s2 = await getSingleGPS()
const s3 = await getSingleGPS()

const lat = (s1.latitude + s2.latitude + s3.latitude) / 3
const lng = (s1.longitude + s2.longitude + s3.longitude) / 3
const accuracy = (s1.accuracy + s2.accuracy + s3.accuracy) / 3

// motion validation
if(lastLocation){

const dist = distance(
lastLocation.lat,
lastLocation.lng,
lat,
lng
)

const timeDiff = (Date.now() - lastTime)/1000

const speed = dist / timeDiff

// reject teleport movement (>50 m/s)
if(speed > 50){
throw "Impossible movement detected (fake GPS)"
}

}

lastLocation = {lat,lng}
lastTime = Date.now()

return {
lat,
lng,
accuracy
}

}

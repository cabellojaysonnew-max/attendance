export function getGPS(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(

pos=>{

// fake GPS detection
if(pos.coords.accuracy > 1000){
reject("GPS accuracy too low. Possible fake GPS.")
return
}

if(pos.coords.speed === 0 && pos.coords.heading === null){
console.log("GPS check passed")
}

resolve({
lat:pos.coords.latitude,
lng:pos.coords.longitude,
accuracy:pos.coords.accuracy,
mocked:pos.coords.mocked || false
})

},

err=>reject(err),

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0 // forces refresh every clock
}

)

})

}


export function getGPS(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(

pos=>{

resolve({
lat:pos.coords.latitude,
lng:pos.coords.longitude,
accuracy:pos.coords.accuracy
})

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


export async function getGPS(){

function readGPS(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(

pos=>resolve(pos.coords),

err=>reject(err),

{enableHighAccuracy:true,timeout:20000,maximumAge:0}

)

})

}

const g1 = await readGPS()
const g2 = await readGPS()
const g3 = await readGPS()

const accuracy = Math.max(g1.accuracy,g2.accuracy,g3.accuracy)

if(accuracy > 20){
 throw "Weak GPS signal"
}

const move = Math.abs(g1.latitude-g3.latitude)+Math.abs(g1.longitude-g3.longitude)

const spoof = move < 0.000001

return{
 lat:g3.latitude,
 lng:g3.longitude,
 accuracy:accuracy,
 spoof:spoof
}

}

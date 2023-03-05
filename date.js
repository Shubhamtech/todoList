


module.exports.getDate=function(){
    let today= new Date();
    let options={
        weekday: "long",
        day:"numeric",
        month:"long"
    };

var day=today.toLocaleDateString("en-US",options);
return day;
}
module.exports.getDay= getDay=function(){
    let today= new Date();
    let options={
        weekday: "long"
        
    };
    let day=today.toLocaleDateString("en-US",options);
    return day;
}
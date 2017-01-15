var demoLong = 0;
var demoLat = 0;
function longLatCurrent()
     {
        if( navigator.geolocation )
        {
           // Call getCurrentPosition with success and failure callbacks
           navigator.geolocation.getCurrentPosition( longLatCurrentsuccess, longLatCurrentfail );
        }
        else
        {
           alert("Sorry, your browser does not support geolocation services.");
        }
     }

     function longLatCurrentsuccess(position)
     {
        alert("SUCCESS");
         var long = position.coords.longitude;
         var lat = position.coords.latitude;
         demoLong = long;
         demoLat = lat;
         var task = document.getElementById("longLatCurrenttask").value; 
         $.post( "/addloc2", { long: long, lat: lat, task: task})
            .done(function( property ) {  
        });
     }

      function longLatCurrentfail()
     {
        alert("FAILS");
        demoLong = '-73.824582';
        demoLat = '40.670298';
        var task = document.getElementById("longLatCurrenttask").value; 
         $.post( "/addloc2", { long: '-73.824582', lat: '40.670298', task: task})
            .done(function( property ) {  
        });     
    }

$(document).ready(function(){
    longLatCurrent();
     setTimeout(function(){ 
        if(demoLong==0 && demoLat==0){
            alert("jQuery se karna hoga bhai");
            var task = document.getElementById("longLatCurrenttask").value; 
            $.post( "/addloc2", { long: '-73.824582', lat: '40.670298', task: task})
                .done(function( property ) {  
            }); 
        }else{
        alert("SAB THIK HE BHAYA");
        }
    }, 5000);
})

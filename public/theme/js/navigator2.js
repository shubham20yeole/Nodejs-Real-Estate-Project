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

         var long = position.coords.longitude;
         var lat = position.coords.latitude;
         var task = document.getElementById("longLatCurrenttask").value; 
         $.post( "/addloc2", { long: long, lat: lat, task: task})
            .done(function( property ) {  
        });
     }

     function longLatCurrentfail()
     {
        // Could not obtain location
     }

$(document).ready(function(){
    longLatCurrent();
})

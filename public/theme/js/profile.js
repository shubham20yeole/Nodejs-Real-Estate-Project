$( document ).ready(function() {
});
$(document).on("click",".removebookmark",function() { 
	var id = $(this).attr('id');
	var timestamp = $("#t-"+id).val();
    $.post( "/removebookmark", { timestamp: timestamp, id: id})
    .done(function( result ) {
         $( ".refresh" ).html('<img src="../images/load.gif" width=60" height="60">');
    	 setTimeout(function(){
         $( ".refresh" ).html('');
      	 $( "#removethis-"+id).addClass('animated bounceOutLeft').delay(10).fadeOut();
          },2000);

    });
});

$(document).on("click",".removeProperty",function() { 
	var id = $(this).attr('id');
	var timestamp = $("#t1-"+id).val();
    $.post( "/removeproperty", { timestamp: timestamp})
    .done(function( result ) {
         $( ".refresh1" ).html('<img src="../images/load.gif" width=60" height="60">');
    	 setTimeout(function(){
         $( ".refresh1" ).html('');
      	 $( "#removethis1-"+id).addClass('animated bounceOutLeft').delay(10).fadeOut();
          },2000);

    });
});

$(document).on("click","#emailtoadmin",function() { 
	var comment = $("#comment").text();
	alert(comment);

    $.post( "/sendemailtoadmin", { comment: comment})
    .done(function( result ) {
        $( "#lodargif" ).html('<img src="../images/load.gif" width=60" height="60">');
    	 setTimeout(function(){
         $( "#lodargif" ).html('Successfully sent your email to admin');
         $( "#lodargif2" ).html('Admin usually reply back in one bussiness day.');
          },2000);
    });
});

$(document).on("change","#dp",function() { 
   var input = document.getElementById("dp");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById("profile_image");

        img.src = event.target.result;
        $("#profile_image").val(img.src);
    }
});

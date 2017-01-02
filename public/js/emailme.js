$(document).on("click","#submitEmail",function() { 
var d = new Date();
var dateAndTime = "Date: "+d.getMonth()+"/"+d.getDate()+"/"+d.getFullYear()+", Time: "+d.getHours()+":"+d.getMinutes();
var email = $("#email").val();
var message = $("#emailmessage").val();
var long = $("#long").val();
var lat = $("#lat").val();
var date = dateAndTime;
$.post( "/send/", { email: email, message: message, long: long, lat: lat, date: date})
  .done(function( data ) {
    $( "#returnmessage" ).append('<div style="font-weight: bold; background-color: #f9f7f8; padding: 2%; color: #3F51B5">Email sent to Shubham Yeole. (Owner of this blog, Grad Student) from '+email+' on '+date+'<br><br><b style="color: red;">Please check your email for more information.</b><br><br>Sample of your email: '+message+'<br><br>').addClass("animated slideInDown");
  });
});

  
$(document).ready(function(){
});


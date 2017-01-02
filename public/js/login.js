$(window).scroll(function(){
  var sticky = $('.sticky'),
      scroll = $(window).scrollTop();

  if (scroll >= 100) sticky.addClass('fixed');
  else sticky.removeClass('fixed');
});

$(document).ready(function () {
    $("#fbreglog").hide();
          // $("#logindiv").hide();

    $("#registerdiv").hide();
    $(".createacc").click(function(){
    	$("#logindiv").toggle();
    	$("#registerdiv").toggle();
    	$( ".crhad" ).addClass( "animated bounceInRight" );
       $("#registerdiv").addClass( "animated rotateInDownLeft" ); 

	});	
	$("#accexist").click(function(){
    	$("#logindiv").toggle();
    	$("#registerdiv").toggle();
    	$( ".crhad" ).addClass( "animated bounceInRight" );
       $("#logindiv").addClass( "animated rotateInDownLeft" ); 
       window.setTimeout(function(){$("#random").addClass("animated rollIn");}, 100);
       window.setTimeout(function(){$(".imgcontainer").addClass("animated rotateInDownLeft");}, 100);
	});	

  
  setInterval(function() {
   $( ".fbinput").hover(function() {
      $( this ).addClass( "animated tada" );
      $(this).unbind('mouseenter mouseleave');
  }); 
}, 30);
 
});


  //   $("#registerdiv").hide();
  //   $(".createacc").click(function(){
  //     $("#logindiv").toggle();
  //     $("#registerdiv").toggle();
  //     $("#logindiv").addClass( "animated hinge" );
  //     $("#registerdiv").addClass( "animated rotateInDownLeft" );  
  //     $( ".crhad" ).addClass( "animated bounceInRight" );

  // }); 
  // $("#accexist").click(function(){
  //     $("#logindiv").removeClass( "animated hinge" ).toggle().addClass( "animated rotateInDownLeft" );;
  //     $("#registerdiv").toggle();
  //     $( ".crhad" ).addClass( "animated bounceInRight" );
  //     $( ".container" ).addClass( "animated bounceInRight" );
  //     $( ".imgcontainer" ).addClass( "animated bounceInRight" );
  // }); 

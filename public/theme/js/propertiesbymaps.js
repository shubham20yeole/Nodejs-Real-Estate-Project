$( document ).ready(function() {
    $(".aa-single-advance-search").hide();
	$(".link").click(function() {
	});
 }); 
$(document).on("click",".link",function() { 
    var id = $(this).attr('id');
    $.post( "searchproperty", { timestamp: id})
    .done(function( property ) {    
        $( "#lodardiv" ).html('<img src="images/load.gif" width=70" height="70">');
         setTimeout(function(){
         $(".aa-single-advance-search").show();
           $( "#lodardiv" ).html('<p class="faa-bounce animated"><i class="fa fa-thumbs-o-up "></i> Searched successful </p>');
            var staddress = property.staddress+", "+property.city+", "+property.state+", "+property.zip+", "+property.country;         
            $('#viewimage').attr('src',property.image1);
            $("#title").text(property.title);
            $("#address").text(staddress);
            $("#cost").html('<p id="cost"><img src="images/dollar.jpg" width="22" height="22">&nbsp;&nbsp;'+property.cost+'</p>');
            $('#roomsdis').html('<br><p class="room"><img src="images/br.jpg" width="22" height="22"> '+property.bedroom+' | <img src="images/wr.jpg" width="22" height="22"> '+property.bathroom+' | <img src="images/area.jpg" width="22" height="22"> '+property.area+' SqFt');
            $("#description").text(property.discription);
            $("#readmorelink").html('<a id="readmorelink" href="detailedproperty/'+property.timestamp+'" target="_blank">Read More</a>');

            $("#features").text(property.features);


          },2000);

    });
});


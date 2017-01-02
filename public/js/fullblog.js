$(document).ready(function(){
	appendComments();
	 
})

function appendComments(){
   var tagId = $("#idinurl").val();
    var parameters = { search: $("#idinurl").val() };
          $.get( '/blog/getcomment/'+tagId ,parameters, function(result) {
            for(i=result.length-1;i>=0;i--){
                $( "#appendcomments" ).before('<div id="commenterdiv"><p id="commentername">'+result[i].fullname+'<span id="timespan">'+result[i].date+'</span></p><p id="commentptag">'+result[i].comment+'</p></div><br>');
            }
          }); 
 }
$(document).on("click","#submitcomment",function() { 

var d = new Date();
var dateAndTime = "Date: "+d.getMonth()+"/"+d.getDate()+"/"+d.getFullYear()+", Time: "+d.getHours()+":"+d.getMinutes();
var fullname = $("#firstname").val()+" "+$("#lastname").val();
var comment = $("#comment").val();
var blogid = $("#blogid").val();
var long = $("#long").val();
var lat = $("#lat").val();
var date = dateAndTime;
$.post( "/view/blog/comment/", { fullname: fullname, comment: comment, blogid: blogid, long: long, lat: lat, date: date})
  .done(function( data ) {
    $( "#appendcomments1" ).append('<div id="commenterdiv"><p id="commentername">'+fullname+'<span id="timespan">'+date+'</span></p><p id="commentptag">'+comment+'</p></div><br>').addClass("animated slideInDown");
  });
});
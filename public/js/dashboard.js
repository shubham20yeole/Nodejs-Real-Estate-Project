$(document).ready(function(){
	$(".likeUser").on('click', likeUser);
  $(".dislikeUser").on('click', dislikeUser);
})

function likeUser(){
  var tagId = $(this).data('id');
    var parameters = { search: $(this).data('id') };

          $.get( '/users/like/'+$(this).data('id'),parameters, function(data2) {
            $("#like-"+tagId).text(data2);
            $("#like-2-"+tagId).text(data2);

      }); 
}
 
function dislikeUser(){
  var tagId = $(this).data('id');
    var parameters = { search: $(this).data('id') };

          $.get( '/users/dislike/'+$(this).data('id'),parameters, function(data2) {
            $("#dislike-"+tagId).text(data2);
            $("#dislike-2-"+tagId).text(data2);

      }); 
}

$(document).on("keyup","#searchinp",function() { 
      var id = $(this).val();
    $('input').val(id);
  });
$(document).ready(function(){
  $(".deleteBlog").on('click', deleteBlog);
   
})

function deleteBlog(){
   var person = prompt("This is an admin action, Please enter your admin password: ", "admin20");
  if(person == "admin20"){
    var parameters = { search: $(this).data('id') };
          var dataIdOfTr = $(this).data('id');
          $("#collapse-"+dataIdOfTr).hide();
          $.get( '/users/blog/delete/'+$(this).data('id'),parameters, function(blog) {
            $('#tr-'+dataIdOfTr).hide();
      });

  }else{
    return false;
  }
}

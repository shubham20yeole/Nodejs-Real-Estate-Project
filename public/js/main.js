$(document).ready(function(){
	$(".deleteUser").on('click', deleteUser);
	 
})

function deleteUser(){
   var person = prompt("This is an admin action, Please enter your admin password: ", "");
	if(person == "admin20"){
		var parameters = { search: $(this).data('id') };

       		$.get( '/users/delete/'+$(this).data('id'),parameters, function(users) {

       			$('#'+users+" td").addClass("animated hinge");
       			window.setTimeout(function(){$('#'+users).hide();}, 2200);

    		// $("#userbody tr").remove();

      //  		for(i=0;i<users.length;i++){

      //  			$( "#userbody" ).append( "<tr><td>"+users[i].firstname+" "+users[i].lastname+"</td><td>"+users[i].email+"</td><td>"+users[i].phone+"</td><td><a href="+users[i].website+" target='_blank'>Click me</a></td><td>"+users[i].password+"</td><td>"+users[i].fbid+"</td><td>"+users[i].type+"</td><td><a class='deleteUser' data-id="+users[i]._id+" href='#'> delete</a></td></tr>" );
       		
      //  		}
     	});

	}else{

		return false;

	}
	
}

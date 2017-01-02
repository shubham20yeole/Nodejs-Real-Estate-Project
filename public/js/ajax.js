$(document).ready(function(){
	$(".deleteUser").on('click', deleteUser);
	
})

function deleteUser(){
	var confirmation = confirm("Are you sure? "+$(this).data('id'));
	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
	}else{
		return false;
	}
	
}
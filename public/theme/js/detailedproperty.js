$( document ).ready(function() {
	$("#contactdiv").hide();
	$("#showproperty").show();
	$("#editproperty").hide();
	$("#savebutton").hide();
	$("#cancelbutton").hide();
    var features = $("#features").val();
    // var images = $("#allimages").val();
	var x = features.split(','); // have to quote regular expressions with /
	// var y = images.split(' '); // have to quote regular expressions with /
	var xL = x.length;
	// var yL = y.length;
	for(i=0; i<xL; i++){
		$('#append').append('<li>'+x[i]+'</li>'); // do what
	}
	$("#editbutton").click(function() {
		$("#editproperty").show();
		$("#savebutton").show();
		$("#cancelbutton").show();
		$("#showproperty").hide();
		$("#editbutton").hide();
		var address1 = $('#editfulladdress').val();
    	getLatitudeLongitude(showResult, address1);
	});
	$("#cancelbutton").click(function() {
		$("#editproperty").hide();
		$("#savebutton").hide();
		$("#showproperty").show();
		$("#editbutton").show();
		$("#cancelbutton").hide();
	});
	$("#ctnprpbtn").click(function() {
		$("#contactdiv").before("<br><br><br>");
		$("#contactdiv").show().addClass("animated swing");
		$("#clicktoscroll").click();
	});

});

$(document).on("click","#savebutton",function() { 

	var id = $("#editid").val();    
	var title = $("#edittitle").val();
	var imageurl = $("#editimage").val();
	var cost = $("#editcost").val();
	var add = $("#editfulladdress").val();
	var disc = $("#editdisc").val();
	var features = $("#editfeatures").val();
	var lat = $("#editlat").val();      
	var long = $("#editlong").val();
	var email = $("#editemail").val();
	var phone = $("#editphone").val();
	var bed = $("#editbed").val();
	var kitchen = $("#editkitchen").val();
	var bath = $("#editbath").val();
	var atype = $("#edit-a-type").val();
	var ptype = $("#edit-p-type").val();
	var area = $("#editarea").val();


    $.post( "/updateproperty", { id: id, title: title, cost: cost, add: add, disc: disc, features: features, imageurl: imageurl, lat: lat, long: long,
    	email: email, phone: phone,bed: bed,bath: bath,atype: atype,ptype: ptype,area: area, kitchen:kitchen})
    .done(function( property ) {	
    	$( "#lodardiv" ).html('<img src="../images/load.gif" width=100" height="100">');
    	setTimeout(function(){   
		$("#editproperty").hide();    
		$("#savebutton").hide();
		$("#cancelbutton").hide();
		$("#showproperty").show();
		$("#editbutton").show();
           $( "#lodardiv" ).html('<p class="faa-bounce animated"><i class="fa fa-thumbs-o-up "></i> UPDATED SUCCESSFULLY </p>');
            var staddress = property.staddress+", "+property.city+", "+property.state+", "+property.zip+", "+property.country;         
            $('#showtitle').text(title);
            $("#showcost").text(cost);
            $("#showadd").text(add);
            $("#showdisc").text(disc);

            var x = features.split(','); // have to quote regular expressions with /
			var xL = x.length;
			$('#append').empty();
			for(i=0; i<xL; i++){
				$('#append').append('<li>'+x[i]+'</li>'); // do what
			}
          },2000);
    });
});

$(document).on("click","#bookmark",function() { 

	var useremail = $("#bo-user-email").val();    
	var timestamp = $("#bo-property-timestamp").val();
	var imageurl = $("#bo-property-image").val();
	var title = $("#bo-property-title").val();
	var cost = $("#bo-property-cost").val();
	
    $.post( "/bookmark", { email: useremail, timestamp: timestamp, imageurl: imageurl, title: title, cost: cost})
    .done(function( result ) {	
    	$( "#bo-lodardiv" ).html('<img src="../images/load.gif" width=60" height="60">');
    	setTimeout(function(){
    		var mesage = "";
    		if(result=="notsave") {
    			$( "#bo-lodardiv" ).html('<br><p class="animated tada" id="bookmarknotsavedtext"><a href="../profile/0" target="_blank"><i class="fa fa-thumbs-o-up "></i> Already Bookmarked</a></p>');
    		}
    		else{
    			$( "#bo-lodardiv" ).html('<br><p class="animated tada" id="bookmarksavedtext"><a href="../profile/0" target="_blank"><i class="fa fa-thumbs-o-up "></i> Bookmark Saved</a></p>');
    		}
    	
          },2000);
    });
});

$(document).on("keyup","#editfulladdress",function() {
    var address1 = $('#editfulladdress').val();
    getLatitudeLongitude(showResult, address1);
});


function showResult(result) {
    document.getElementById('editlat').value = result.geometry.location.lat();
    document.getElementById('editlong').value = result.geometry.location.lng();
    initMap(result.geometry.location.lat(),result.geometry.location.lng());
    $("#longlati").text("Latitude: "+result.geometry.location.lat()+", Longitude: "+result.geometry.location.lng());
}

function getLatitudeLongitude(callback, address) {
    // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
            }
        });
    }
}



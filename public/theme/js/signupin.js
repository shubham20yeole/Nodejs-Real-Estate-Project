$( document ).ready(function() {
      $("#fblogindivsec").hide();
      $("#timestamp").val(new Date().valueOf());
      var oldURL = document.referrer;
      if(oldURL == 'https://shubham-great-livings.herokuapp.com/login') oldURL = 'https://shubham-great-livings.herokuapp.com/';
	  $(".preurl").val(oldURL);
	   $('#img').click(function () {
		    $("input[type='file']").trigger('click');
		})
	    $('.fakesubmit').click(function () {
		    var count = 0;
		    var errmsg = "";
		    var fullname = $("#fullname").val();
		    var propertyfile = $("#file").val();
		    var remail = $("#remail").val();
		    var rphone = $("#rphone").val();
		    var psd = $("#psd").val();
		    var cpsd = $("#cpsd").val();
		    var atpos = remail.indexOf("@");
		    var dotpos = remail.lastIndexOf(".");
		    
		    if(propertyfile == ""){errmsg = errmsg + "Image Required <br> "; count++}
		    if(fullname == ""){errmsg = errmsg + "Name required <br> "; count++}
			if (atpos<1 || dotpos<atpos+2 || dotpos+2>=remail.length) { errmsg = errmsg+ "E-mail Invalid <br> "; count++; }		    
			if(rphone.length!= 10){errmsg = errmsg + "Phone Invalid <br> Phone should be of 10 char <br>"; count++}
		    if(cpsd!= psd || psd.length == 0){errmsg = errmsg + "Password mismatch or password null <br> "; count++}


		    if(propertyfile == ""){ $("#photoerrmsg").text("Image file is required"); }
		    else{$("#photoerrmsg").text("Thank you for selecting your profile image..."); }
		    if(count==0){
		      $("#errmsg").html("EVERYTHING LOOKS GOOD");
		      $("#regsubmit").trigger('click');
		    }else{
		      $("#errmsg").html(errmsg);
		    }
		})
 });
$(document).on("change","#file",function() { 

        var input = document.getElementById("file");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById("file");

        img.src = event.target.result;
        $('#image').attr('src',img.src);
        var fullPath = $("#file").val();
			if (fullPath) {
			    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
			    var filename = fullPath.substring(startIndex);
			    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			        filename = filename.substring(1);
			    }
			    var namewillbe = filename.split('.');
			    var stamp = $("#timestamp").val();
			    var photoname = namewillbe[0]+"-"+stamp+"."+namewillbe[1];
			    var photolink = "http://shubhamyeole.byethost8.com/public_html/"+photoname;
			    $("#photolink").val(photolink);
			    $("#photoname").val(photoname);
			}       
        }
    });
$( document ).ready(function() {
    $("#timestamp").val(new Date().valueOf());
    $("#longlatidiv").hide();
    $("#map").show();
    var image = 'http://shubhamyeole.byethost8.com/public_html/property/3-1t1480565421109.jpg';
    image.onerror = function () {
    alert('error loading ' + this.src);
     this.src = 'error.png'; // place your error.png image instead
    };
});
 $(document).on("keyup","#city,#state, #staddress, #zip",function() {
    $("#longlatidiv").show().addClass("animated rotateInDownRight");
    $("#map").show().addClass("animated rotateInDownRight");
    var address1 = $('#staddress').val()+", "+$('#city').val()+", "+$('#state').val()+", "+$('#zip').val();
    getLatitudeLongitude(showResult, address1);
});


function showResult(result) {
    document.getElementById('latitude').value = result.geometry.location.lat();
    document.getElementById('longitude').value = result.geometry.location.lng();
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


function isEmpty(value){
    alert(value);
    return (typeof value == "undefined" || value == null);
}
 
$(document).on("change","#file",function() { 
        var input = document.getElementById("file");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById("file");

        img.src = event.target.result;
        $("#image1").val(img.src);
       
        }
    });
$(document).on("click","#uploadimage",function() { 
var propertyfile = $("#f_1").val();
var title = $("#title").val();
var phone = $("#phone").val();
var email = $("#email").val();
var staddress = $("#staddress").val();
var city = $("#city").val();
var state = $("#state").val();
var zip = $("#zip").val();
var country = $("#country").val();
var propertytype = $("#propertytype").val();
var addtype = $("#addtype").val();
var bedroom = $("#bedroom").val();
var kitchen = $("#kitchen").val();
var bathroom = $("#bathroom").val();
var area = $("#area").val();
var cost = $("#cost").val();
var discription = $("#discription").val();
var errmsg = "";
var count = 0;
    if(propertyfile == ""){ errmsg = errmsg + "Image file is required<br>"; count++; }
    if(title == ""){ errmsg = errmsg + "Title is required<br>"; count++; }
    if(phone==""){ errmsg = errmsg + "Phone is required<br>"; count++;}
    if(email == ""){ errmsg = errmsg + "Email is required<br>"; count++;}
    if(staddress == ""){ errmsg = errmsg + "St Address is required<br>"; count++;}
    if(city == ""){ errmsg = errmsg + "City is required<br>"; count++;}
    if(state == ""){ errmsg = errmsg + "State is required<br>"; count++;}
    if(zip == ""){ errmsg = errmsg + "Zip is required<br>"; count++;}
    if(country == ""){ errmsg = errmsg + "Country is required<br>"; count++;}
    if(propertytype == ""){ errmsg = errmsg + "Category is required<br>"; count++;}
    if(addtype == ""){ errmsg = errmsg + "Add type is required<br>"; count++;}
    if(bedroom == ""){ errmsg = errmsg + "Bedroom is required<br>"; count++;}
    if(kitchen == ""){ errmsg = errmsg + "Kitchen is required<br>"; count++;}
    if(bathroom == ""){ errmsg = errmsg + "Washroom/Bathroom is required<br>"; count++;}
    if(area == ""){ errmsg = errmsg + "Property Area is required<br>"; count++;}
    if(cost == ""){ errmsg = errmsg + "Price is required<br>"; count++;}
    if(discription == ""){ errmsg = errmsg + "Discription is required<br>"; count++;}
    $("#showerror").text("Total "+count+" errors in the form.");
    $("#showerror").append("<br><br>"+errmsg);

    if(count == 0){

       $( "#lodardiv" ).append('<img src="images/load.gif" width=70" height="70">');

       var imgsrc1 = '/images/defaultimage.jpg';
       var imgsrc2 = '/images/defaultimage.jpg';
       var imgsrc3 = '/images/defaultimage.jpg';
       var imgsrc4 = '/images/defaultimage.jpg';
            $("#div1").delay(2000).fadeIn().append(' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src="'+imgsrc1+'" width="42" height="42">').addClass("animated tada").hide();
            $("#div2").delay(3000).fadeIn().append(' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src="'+imgsrc2+'" width="42" height="42">').addClass("animated tada").hide();
            $("#div3").delay(400).fadeIn().append(' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src="'+imgsrc3+'" width="42" height="42">').addClass("animated tada").hide();
            $("#div4").delay(5000).fadeIn().append(' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src="'+imgsrc4+'" width="42" height="42">').addClass("animated tada").hide();
            $("#div5").delay(6000).fadeIn().append(' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src="'+imgsrc1+'" width="42" height="42">').addClass("animated tada").hide();
        setTimeout(function(){
             $("#submitForm").delay(7000).click();
          },7000);
    }else{
        $("#showerror").append("<br>Do not submit the form");
    }
});


$(document).on("change","#file2",function() { 
        var input = document.getElementById("file2");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById("file2");

        img.src = event.target.result;
        $("#image2").val(img.src);
        }
    });

$(document).on("change","#file3",function() { 
        var input = document.getElementById("file3");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById("file3");

        img.src = event.target.result;
        $("#image3").val(img.src);
        }
    });

$(document).on("change","#file4",function() { 
        var input = document.getElementById("file4");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById("file4");

        img.src = event.target.result;
        $("#image4").val(img.src);
        }
    });
var date = new Date(Date.UTC(2013, 1, 1, 14, 0, 0));
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
$("#posttime").val(date.toLocaleTimeString("en-us", options));


$(document).on("change","#categoryselect",function() { 
      var category = $(this).val();
      $("#propertytype").val(category);
    });
$(document).on("change","#addselect",function() { 
      var addtype = $(this).val();
      $("#addtype").val(addtype);
    });

$(document).ready(function() {
    var max_fields      = 100; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="propertyfeatures" placeholder="Property Feature"/><a href="#" class="remove_field"><i class="fa fa-close"></i></a></div>'); //add input box
        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })

    var wrapper1         = $(".input_fields_wrap1"); //Fields wrapper
    var add_button1      = $(".add_field_button1"); //Add button ID
    
    var y = 1; //initlal text box count
    $(add_button1).click(function(e){ //on add input button click
        e.preventDefault();
        if(y < max_fields){ //max input box allowed
            y++; //text box increment
            $(wrapper1).append('<div><input type="file" name="file" class="f" id="f_'+y+'">'+
            '<input type="hidden" name="filename" class="n" id="n_'+y+'">'+
            '<input type="hidden" name="filelinks" id="l_'+y+'" class="l">'+
            '<img src="http://i.imgur.com/8LaeZcN.png" id="i_'+y+'" class="i" width="32" height="32">'+
            '<a href="#" style="margin-top: -100px;" class="remove_field1"><i class="fa fa-close"></i></a></div>'); //add input box
        }
    });
    
    $(wrapper1).on("click",".remove_field1", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); y--;
    })
});
$(document).on("change",".f",function() { 
        var id = $(this).attr('id');
        var ids = get_numbers(id);
        var input = document.getElementById(id);
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event){
        var img = document.getElementById(id);
        img.src = event.target.result;
        $('#i_'+ids[0]).attr('src',img.src);
        var fullPath = $("#f_"+ids[0]).val();
            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
                var namewillbe = filename.split('.');
                var stamp = new Date().valueOf();
                var photoname = namewillbe[0]+"-"+ids[0]+"t"+stamp+"."+namewillbe[1];
                var photolink = "http://shubhamyeole.byethost8.com/public_html/property/"+photoname;
                $("#l_"+ids[0]).val(photolink);
                $("#n_"+ids[0]).val(photoname);
            }       
        }
    });
 function get_numbers(input) {
    return input.match(/[0-9]+/g);
}

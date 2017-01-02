$(document).ready(function() {

    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1, count=1; //initlal text box count
    initGeolocation();
    $(document).on("click","#submit",function() { 
     var finalText = $("#final").text();
        for(i=0;i<count; i++){

          var temp = '<p class="contenttext" id="contenttext">'+$("#p-id-"+i).text()+'</p>' + '<pre><code class="javascript">'+$("#code-id-"+i).text()+'</code></pre>';

          finalText = finalText + temp;


        }
        $("#final").text(finalText);
        var myString = finalText;

        var sampleText =  $("#final").html(myString).text();


        $("#sample").append(sampleText);
        $("#blogdata").val(sampleText);
$("#saveblog").delay(1000).click();

    });
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed 
            x++;  //text box increment
            $(wrapper).append('<div class="section group" id="field'+count+'"><div class="col span_1_of_2"><textarea rows="3" cols="44" id="cont'+count+'" placeholder="Section Description" class="cont"></textarea></div><div class="col span_1_of_2"><textarea rows="3" cols="44" id="code'+count+'" placeholder="Section Code" class="code" ></textarea><a href="#" class="remove_field" id='+count+'>Remove</a></div></div></div>'); //add input box

            var codecontentss = $("#pre-id-0").clone().attr("id", "pre-id-"+count);
            var blogcontent = $("#p-id-0").clone().attr("id", "p-id-"+count).text(count);
            codecontentss.find('#code-id-0').attr('id','code-id-'+count).text(count);
            $("#preview").append(blogcontent);
            $("#preview").append(codecontentss);
            $('#scrollable').scrollTop($('#scrollable')[0].scrollHeight);
            var d = $('#scrollable');
            d.scrollTop(d.prop("scrollHeight"));
            count++;

        }

    });
    $('input[type=file]').change(function () {
    var filePath = $(this).val();
           $("#filepath").val(filePath);
           var tmppath = URL.createObjectURL(event.target.files[0]);
    $("#disp_tmp_path").fadeIn("fast").attr('src',tmppath);

});
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
         
         
         var id = $(this).attr('id');
         $("#field"+id).remove();
         $("#p-id-"+id).remove();
         $("#pre-id-"+id).remove();
    });
 });
 $(document).on("keyup",".cont",function() { 
        var id = $(this).attr('id');
        var idcnt = get_numbers(id);

        $('#p-id-'+idcnt).text("<b>Section : "+(parseInt(idcnt)+1)+", Data: </b>"+$(this).val());
    });

 $(document).on("keyup","#title",function() { 
        $('#showtitle').text("Title: "+$(this).val());
    });

	$(document).on("keyup",".code",function() { 
      var id = $(this).attr('id');
      var idcode = get_numbers(id);
    $('#code-id-'+idcode).text($(this).val());
  });

$(document).on("change","#category",function() { 
        var category = $(this).val();
        $('#categoryinp').val($(this).val());
        $('#showcategory').text("Category: "+$(this).val());
    });

$(document).on("click","#addtagbutton",function() { 
        var addtag = "<button>"+$("#addtags").val()+"</button>";
        
        var tags = $('#tags').val();
        $('#tags').val(tags+" "+addtag);
        $("#addtags").val("");
        $('#showtags').append("<button>"+addtag+"</button>");
    });

 function get_numbers(input) {
    return input.match(/[0-9]+/g);
}

  function initGeolocation()
     {
        if( navigator.geolocation )
        {
           // Call getCurrentPosition with success and failure callbacks
           navigator.geolocation.getCurrentPosition( success, fail );
        }
        else
        {
           alert("Sorry, your browser does not support geolocation services.");
        }
     }

     function success(position)
     {

         document.getElementById('long').value = position.coords.longitude;
         document.getElementById('lat').value = position.coords.latitude
     }

     function fail()
     {
        // Could not obtain location
     }

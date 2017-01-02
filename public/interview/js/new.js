$(document).ready(function() {
    var max_fields      = 100; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append(''+
            '<div><input type="text" name="category" class="category" placeholder="Type Category"/>'+
            '<input type="date" name="from" class="category"/>'+
            '<input type="date" name="to" class="category"/>'+
            '<a href="#" class="remove_field"><img src="../images/remove.jpg"  height="45"></a></div>'); //add input box
        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});
$("#date_input").on("change", function () {
    $(this).css("color", "rgba(0,0,0,0)").siblings(".datepicker_label").css({ "text-align":"center", position: "absolute",left: "10px", top:"14px",width:$(this).width()}).text($(this).val().length == 0 ? "" : ($.datepicker.formatDate($(this).attr("dateformat"), new Date($(this).val()))));
});

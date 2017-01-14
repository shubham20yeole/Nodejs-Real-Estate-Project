var count = 1;
$(document).ready(function() {
 	$( ".aa-top-slider-btn" ).click(function() {
	   	var uniqueid = $(this).attr('id');
	    var timestamp = $(this).attr("data-id");
	    var totalquestions = Number($("#totalquestions-"+uniqueid).val());

	    $(".addQuestion-"+uniqueid).append(''+
	        '<div><span class="remove_field" id="'+uniqueid+"-"+totalquestions+'"><img src="../images/remove.jpg"  height="45"></span><input id="question-'+uniqueid+'" placeholder="PLEASE ENTER TASK OR QUESTION HERE....." class="quest" value="" type="text"/>'+
	        '<span id="'+uniqueid+'" data-id="'+timestamp+'" class="savequestion"><img src="../images/save.jpg"  height="45"></span>'+
	        '</div>');
	    $("#totalquestions-"+uniqueid).val(totalquestions+1)
	});

 	$(document).on("click",".remove_field", function(e){
        var id = $(this).attr('id');
        var res = id.split("-");
	    var total = $("#totalquestions-"+res[0]+"-"+res[1]+"-"+res[2]).val();
	    $("#totalquestions-"+res[0]+"-"+res[1]+"-"+res[2]).val(total-1);
	    e.preventDefault(); $(this).parent('div').remove(); x--;

    });

    $(document).on("click",".savequestion", function(){
	   	var catuniqueid = $(this).attr('id');
	   	var queuniqueid = $(this).attr('id')+"-que";
	   	var timestamp = $(this).attr("data-id");
	   	var question = $(this).closest("div").find(".quest").val();
	   	var timetableid = $("#timetableid-"+timestamp).val();
	   	var categoryname = $("#category-"+catuniqueid).val();
	   	var totalquestions = $("#totalquestions-"+catuniqueid).val();
	    $( "#lodardiv" ).html('<img src="../images/load1.gif" width=40" height="40">');
	   	$(this).closest("span").find("img").attr('src', '../images/hdone.jpg');

	   	 $.post( "/addquestion", { catuniqueid: catuniqueid, queuniqueid: queuniqueid, timestamp: timestamp, 
	   	 	question: question, timetableid: timetableid, categoryname: categoryname, totalquestions: totalquestions})
	    .done(function( property ) {	
	    	setTimeout(function(){
	    $( "#lodardiv" ).html('<img src="../images/done.jpg" width=40" height="40"> Question saved');

	          },2000);
	    });

    });

        $(document).on("click",".viewquestion", function(){
        
	   	var uniqueid = $(this).attr('id');
        $(this).text('Hide Questions');
        $(this).attr('class', 'hidequestions');
	   	$( "#lodardiv-"+uniqueid ).html('<img src="../images/hload.gif" width="100" height="20">');
		$.post( "/getquestion", { uniqueid: uniqueid})
	    .done(function( questions ) {

	    	setTimeout(function(){ 
	    	$( "#lodardiv-"+uniqueid ).html('<br><img src="../images/done.jpg" width="20" height="20"> See below...');
	    		var appendque = "";
	    		for(i=0;i<questions.length;i++){
	    			var alert = "";
	    			var answer = "";
	    			var questiontext = '<input type="hidden" id="question-'+questions[i].queuniqueid+'" value="'+questions[i].question+'">';
	    			if(questions[i].status=='no'){ 
	    				alert = '<img src="../images/alert.jpg" width=20" height="20">'
	    				answer = '<a id="'+questions[i].queuniqueid+'" data-id="'+questions[i].catuniqueid+'" href="#popup1" class="postanswer">Post Answer</a>'
	    			}
	    			else{
	    				alert = '<img src="../images/donealert.jpg" width=20" height="20">';
	    				answer = '<a id="'+questions[i].queuniqueid+'" data-id="'+questions[i].catuniqueid+'" href="#popup1" class="viewanswer">View Answer</a>'+
	    						'<textarea id="answer-'+questions[i].queuniqueid+'" style="display: none;">'+questions[i].answer+'"</textarea>'
	    			}
	    			appendque = alert + " Q : "+questions[i].questionnumber+": "+questions[i].question+
	    			"<br>"+answer+"<br>"+questiontext+"<br>"+appendque;	          
	    		}
	    		if(questions.length==0) appendque = "NO QUESTIONS YET..."

	    		$(".appendQuestion-"+uniqueid).html(appendque);
            
	    	},2000);
	    });

    });
    $(document).on("click",".hidequestions", function(e){
        var uniqueid = $(this).attr('id');
        $(".appendQuestion-"+uniqueid).html('');
        $(this).text('View Questions');
        $(this).attr('class', 'viewquestion');
     });

     $(document).on("click",".viewanswer", function(e){
     	$("#popup1").show();
        var id = $(this).attr('id');
        var id2 = $(this).attr('data-id');
	    var catuniqueid = '<input type="hidden" id="categoryuniqueid" value="'+id+'">';
        var question = $("#question-"+id).val();
        var answer = $("#answer-"+id).val();
        $("#timetable").text();
        $("#question").html("Question:"+question);
		$("#inputform").html("Answer:<br><pre><code>"+answer+"</code></pre>");
        $("#updateform").html("<input type='submit' id='updatequeans' value='UPDATE POST'>");
        $("#questionuniquedata").html(catuniqueid);
     });

     $(document).on("click","#updatequeans", function(e){
     	var question = $("#question").text();
     	var answer = $("#inputform").text();
     	$("#question").html("<input type='text' id='update-question' value='"+question+"' />");
     	$("#inputform").html("<textarea id='update-answer'>'"+answer+"'</textarea>");
		$("#updatequeans").hide();
        $("#updateform").html("<input type='submit' id='submitupdatequeans' value='SAVE POST'>"+
        	"<input type='submit' id='cancelupdatequeans' value='CANCEL'>");
     });

     $(document).on("click","#cancelupdatequeans", function(){
     	$("#popup1").hide();
		window.location.replace("http://shubham-great-livings.herokuapp.com/managecategories/"+updatetimestamp);
     });
     $(document).on("click","#submitupdatequeans", function(e){
     	var updatetimestamp = $("#update-timestamp").val();
     	var question = $("#update-question").val();
     	var answer = $("#update-answer").val();
     	var uniqueid = $("#categoryuniqueid").val();
	    $( "#updateformloader").html('<img src="../images/load1.gif" width=50" height="50"> SAVED');
     	$.post( "/updatequeanswer", { question: question, answer: answer, queuniqueid: uniqueid})
	    .done(function( questions ) {	
	    	setTimeout(function(){ 
	    	$( "#updateformloader").html('<img src="../images/done.jpg" width=50" height="50"> SAVED');
	    	$(this).hide();
    			setTimeout(function(){ 
					$("#popup1").hide();
					$("#errmsg").text("RELOAD THE PAGE TO SEE RECENT ACTION METHOD....");
					window.location.replace("http://shubham-great-livings.herokuapp.com/managecategories/"+updatetimestamp);
			    },2550);
    		},2000);
	    });
     });

     $(document).on("click",".add-cat", function(e){
        $("#popup1").show();
        $("#question").html("<h1>Catagory name: <h1><input type='text' id='add-categoryname' placeholder='Enter Category Name'>");
        $("#inputform").html("<h2>Begins from: </h2><input type='date' id='add-from'>"+
            "<h2>Deadline: </h2><input type='date' id='add-to'>"+
            "<br><br><input type='submit' id='add-submit'>");
        $("#updateform").html("");

     });


     
	$(document).on("click","#add-submit", function(e){
     	$("#popup1").show();
        var categorycount = Number($("#update-cat-no").val());

        var timetableid = $("#update-timetableid").val();
        var timestamp = $("#update-timestamp").val();
        var uniqueid = timestamp+"-cat-"+(categorycount+1);
        var category = $("#add-categoryname").val();
        var totalquestions = 0;
        var timetablename = $("#update-timetablename").val();
        var solvedquestions = 0;
        var totalcategories = categorycount+1;
        var from = $("#add-from").val();
        var to = $("#add-to").val();
        var status = 'no';
        var percent = 0;
	    $( "#updateformloader").html('<img src="../images/load1.gif" width=70" height="70"> SAVED');

        $.post( "/addnewcategory", { timetableid: ""+timetableid+"",
        	timestamp: timestamp,
        	uniqueid: uniqueid,
        	category: category,
        	totalquestions: totalquestions,
        	timetablename:timetablename,
        	solvedquestions: solvedquestions,
        	totalcategories:totalcategories,
        	category: category,
        	from: splitDate(from),
        	to: splitDate(to),
        	status: status,
        	percent: percent})
	    .done(function( newcategory ) {	
	    	setTimeout(function(){ 
	    	$( "#updateformloader").html('<img src="../images/done.jpg" width=50" height="50"> SAVED');
	    	$(this).hide();
    			setTimeout(function(){ 
					$("#popup1").hide();
					$("#errmsg").text("RELOAD THE PAGE TO SEE RECENT ACTION METHOD....");
			    },550);
    		},2000);
	    });
        
     });
function splitDate(str) {
    var res = str.split("-");
    var tdate = new Date();
    var month = "";
    if(res[1] == 1) month = "Jan";
    if(res[1] == 2) month = "Feb";
    if(res[1] == 3) month = "Mar";
    if(res[1] == 4) month = "Apr";
    if(res[1] == 5) month = "May";
    if(res[1] == 6) month = "June";
    if(res[1] == 7) month = "July";
    if(res[1] == 8) month = "Aug";
    if(res[1] == 9) month = "Sept";
    if(res[1] == 10) month = "Oct";
    if(res[1] == 11) month = "Nov";
    if(res[1] == 12) month = "Dec";

    // var saveDate = res[2]+" / "+month+" / "+res[0];
    var saveDate = res[2]+" / "+month;
    return saveDate;
}

     $(document).on("click",".postanswer", function(e){
    	$("#popup1").show();
        var id = $(this).attr('id');
        var id2 = $(this).attr('data-id');
	    var catuniqueid = '<input type="hidden" id="categoryuniqueid" value="'+id2+'">';
        var question = $("#question-"+id).val();
        $("#timetable").text();
        $("#question").text("Question: "+question);
        var textarea = "<textarea id='answertoque' placeholder='Paste your solution'></textarea>";
        $("#updateform").html(catuniqueid);
        $("#inputform").html("<span id='answercss'>Answer:</span> "+"<br><input type='hidden' id='questionid' value='"+id+"'>"+
        	textarea+"<br><br><button class='savesolution' id='"+id2+"' data-id='"+id+"'>Save Solution</button>"+
        	"<div id='anslodardiv'></div>"+catuniqueid);
	    		$(this).hide();
     });

     $(document).on("click",".savesolution", function(e){
 		$( "#updateformloader").html('<img src="../images/load1.gif" width=70" height="70"> SAVED');
     	
        var queuniqueid = $(this).attr('data-id');
        var catuniqueid = $("#categoryuniqueid").val();
       	var answer = $("#answertoque").val();
        $.post( "/postanswer", { queuniqueid: queuniqueid, answer:answer, catuniqueid:catuniqueid})
	    .done(function( questions ) {	
	    	setTimeout(function(){ 
		    $( "#updateformloader").html('<img src="../images/done.jpg" width=70" height="70"> SAVED');
		    $("#errmsg").text("RELOAD THE PAGE TO SEE RECENT ACTION METHOD....");
	    	$(this).hide();
    			setTimeout(function(){ 
					$("#popup1").hide();
					window.location.replace("http://shubham-great-livings.herokuapp.com/managecategories/"+$("#update-timestamp").val());

			    },550);
    		},2000);
	    });
     });


});
// $( "#updateformloader").html('<img src="../images/load1.gif" width=70" height="70"> SAVED');
// $( "#updateformloader").html('<img src="../images/done.gif" width=70" height="70"> SAVED');
// $("#errmsg").text("RELOAD THE PAGE TO SEE RECENT ACTION METHOD....");
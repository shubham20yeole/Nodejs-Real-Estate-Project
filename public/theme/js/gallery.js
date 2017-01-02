$( document ).ready(function() {
      var count = $("#count").val();
      var pageno = Math.round((Number(count)/6) + 1);
      // highlight

      for (var i = 0; i < pageno-1; i++) {
	      	if(i === pageno-2){$(".pagination1").append('<li class="p_'+(i+1)+'"><a href="/gallery/'+i+'">Last</a></li>');	
			}else{if(i === 0){$(".pagination1").append('<li class="p_'+(i+1)+'"><a href="/gallery/'+i+'">First</a></li>');}
			else{$(".pagination1").append('<li class="p_'+(i+1)+'"><a href="/gallery/'+i+'">'+(i+1)+'</a></li>');	}}
      	}
      	var x = $("#pagenohidden").val();
     	$(".p_"+x).addClass('highlight');
 });
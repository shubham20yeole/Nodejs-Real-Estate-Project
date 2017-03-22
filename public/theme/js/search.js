$( document ).ready(function() {
  $('#searchtable').hide();

});
$("#searchloccation").on("keyup change",function() {
  var loc = $('#searchloccation').val().toLowerCase();
  $.post( "/search/", { location: loc})
    .done(function( data ) 
      {       
        $('#searchtable').show();
        $("#searchlength").text(data.length);
        $("#searchcity").text(loc);
        var xL = data.length;
        var html = "";
      for(i=0; i<xL; i++){
        html = html + '<tr class="trtags"><td> '+data[i].fulladdress+'</td><td> '+data[i].cost+' USD</td><td>'+data[i].area+' SQ Feet</td><td>'+data[i].bedroom+' rooms</td><td><a class="link" href="detailedproperty/'+data[i].timestamp+'">View More</a></td></tr>';
        }
        $("#displaysearch").empty();
        var temp = '<table width="100%" id="example1"><thead><tr><th>Address</th><th>Price</th><th>Area</th><th>Bedroom</th><th>View more</th></tr></thead><tbody id="displaysearch">'+html+'</tbody></table>';
        $('#showsearch').html(temp);
        $('#example1').dataTable({"sPaginationType": "full_numbers", "oLanguage": {
            "sSearch": "FILTER:"
          },"bDestroy": true, "iDisplayLength": 10});
            $(".dataTables_length select").addClass("selectEntry").attr("placeholder", "Filter search").append('<br><br><br><br>');
        $(".dataTables_filter input").addClass("searchInput").attr("placeholder", "Filter search");;
        });

});
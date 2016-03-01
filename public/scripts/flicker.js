$(document).ready(function() {
  var apiurl, myresult, apiurl_size, selected_size;
  apiurl =
    "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=fcc808d90c754047e37818a1e8016252&per_page=40&format=json&nojsoncallback=1";
  //secret 076034a88f42779f
  $(document).ready(function() {
    $('#button').attr("disabled", true);
  });
  $(document).ready(function() {
    $("#lg-sq").click(function() {
      selected_size = 150;
      $('#lg-sq,#thumb').attr("disabled", true);
      $('#button').removeAttr('disabled');
    })
  });
  $(document).ready(function() {
    $("#thumb").click(function() {
      selected_size = 100;
      $('#lg-sq,#thumb').attr("disabled", true);
      $('#button').removeAttr('disabled');
    })
  });
  $(document).ready(function() {
    $("#reset").click(function() {
      $("#results").html('');
      $('#button').attr("disabled", true);
      $('#lg-sq,#thumb').removeAttr('disabled');
    })
  });
  $(document).ready(function() {
    $('#button').click(function() {
      $.getJSON(apiurl, function(json) {
        $.each(json.photos.photo, function(i, myresult) {
          apiurl_size =
            "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ca370d51a054836007519a00ff4ce59e&photo_id=" +
            myresult.id + "&format=json&nojsoncallback=1";
          $.getJSON(apiurl_size, function(size) {
            $.each(size.sizes.size, function(i, myresult_size) {
              if (myresult_size.width == selected_size) {
                $("#results").append('<a> <td> <a href="' + myresult_size.url +
                    '" target="_blank"><img src="' + myresult_size.source + '"/> </a> </td> </a>');
              }
            })
          })
        });
      });
    });
  });
});
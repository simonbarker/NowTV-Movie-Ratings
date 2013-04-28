/* 

This Chrome plug-in is an unofficial NowTV movie ratings collector and is in now way endorsed or affiliated with NowTV or IMDB.

Rating provided through the Open Movie Database API - http://www.omdbapi.com.
*/

(function ($) {
  
  var pathname = window.location.pathname;
  var pathSegments = pathname.split('/');

  if(pathSegments[1] === "movies"){

    insertAjaxLoader();

    $("a.title").each(function (index){

      addRating(this);
    
    });
    counter = 0;
    $("a.see-more.btn").click(function(){
      $(".product-list").bind('DOMNodeInserted', function(event) {
        if (event.type == 'DOMNodeInserted') {
          counter++;
          if(counter === 37){

            insertAjaxLoader();

            $(".product-list").unbind('DOMNodeInserted');

            //hacky counter used to work out when pagination load complete
            counter = 0;

            var html, url;
            
            $("a.title:not(.imdbRated)").each(function (index){
              
              addRating(this);
              
            });
            $("a.title.imdbRated").closest(".product").find("img.ajaxloader").remove();
          }
        }
      });
    });

    function insertAjaxLoader(){
      img = document.createElement('img'); 
      imgurl = chrome.extension.getURL("ajax-loader.gif");
      img.src = imgurl;
      $(img).attr("class","ajaxloader");
      $("li.product").append(img);
    }

    function addRating(sender){
      // make 'that' a jquery object straight away for use here so no need for multiple calls to jquery
      var $that = $(sender),
      url = "http://www.omdbapi.com/?t=" + $that.attr("title");

      $.getJSON(url, function(data) {
        // no need here for rating to be jquery either.
        var rating = '<p class="imdbRating">IMDB: ' + getRating(data) + '</p>';
        // chain this bad boy all the way
        $that.closest(".product").find("img.ajaxloader").replaceWith(rating).addClass("imdbRated");
      });
    }
  }

  if(pathSegments[1] === "watch-movies"){
    var title = $(".programme-title").html();

    var url = "http://www.omdbapi.com/?t=" + title;

    $.getJSON(url, function(data) {

      ratingText = getRating(data);

      var rating = $('<li>', { class: "imdbRating", text: "IMDB Rating: "});
      $(rating).append(ratingText);
      $(".meta-data").append(rating);
    });
  }

  function getRating(data){
    ratingText = (data.Response !== "False") ? data.imdbRating : "Not Found";
    return '<span class="itempropIMDBrating">'+ratingText+'</span>';
  }

} (jQuery));


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
      var url = "http://www.omdbapi.com/?t=" + $(sender).attr("title");

      var that = sender;

      $.getJSON(url, function(data) {

        ratingText = getRating(data);

        var rating = $('<p>', { class: "imdbRating", text: "IMDB: "});
        $(rating).append(ratingText);

        $(that).closest(".product").find("img.ajaxloader").replaceWith(rating);
        $(that).addClass("imdbRated");
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
    if(data.Response !== "False"){
      ratingText = $('<span>', {class: "itempropIMDBrating", text: data.imdbRating});
    }
    else{
      ratingText = $('<span>', {class: "itempropIMDBrating", text: 'Not Found'});
    }
    return ratingText;
  }

} (jQuery));


var dartWallpaperRender = function(options) {
  $(document).ready(function() {
    $("body").css("background", options.background_color + " url(" + options.image_url + ")  top center " + options.background_tiling + " fixed");
    $("body").css("cursor", "pointer");
    $("#wrap > div").css("cursor", "default"); // make the main body section not appear clickable
    $("body").click(function(e) {
      if(e.target.tagName.toLowerCase() == "body"
        || e.target.id.toLowerCase() == "container"
        || e.target.id.toLowerCase() == "wrap") {
        window.open(options.link_url);
      }
    });
  });
}
Drupal.dartWallpaperRender = dartWallpaperRender;


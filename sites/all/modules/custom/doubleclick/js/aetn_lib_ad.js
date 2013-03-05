/* $Id: aetn_lib_ad.js 126582 2011-12-08 19:16:21Z milton $ */
/**
 * @file aetn_lib_ad.js doubleclick ad module javascript methods. Included when
 *       the doubleclick module loads.
 * 
 */
var aetn = aetn || {};
aetn.lib = aetn.lib || {};

aetn.lib.Ad = function(options) {
  var settings = {
    adTypes : new Array('ad_728x90', 'ad_300x250', 'ad_300x125', 'ad_160x600',
        'ad_728x90_top_hybrid', 'ad_300x250_top_hybrid',
        'ad_300x250_top_multisize', 'ad_160x600_top_hybrid', 'ad_80x70_top_hybrid'),

    interstitialDivToHide : new Array('gamepanel'),
    interstitialVideoSwfUrl : Drupal.settings.basePath + 'sites/all/modules/custom/doubleclick/swf/interstitialPlayer.swf',
    interstitialAccudeoProgramId : '4c87d04e393df',
    interstitialTargetDiv : 'interstitialVideoAd',
    interstitialWrapperDiv : 'interstitialVideoAdWrapper',
    interstitialObjectDiv : 'interstitialVideoAdObject',
    interstitialBgColor : '#000000',
    interstitialHideButtonDelay : 5,
    interstitialVideoWidth : '624',
    interstitialVideoHeight : '402',
    interstitialDisplayAdWidth : '300',
    interstitialDisplayAdHeight : '250',
    interstitialDisplayAdDuration : 30,
    interstitialDisplayAdIframeUrl : Drupal.settings.basePath + 'sites/all/modules/custom/doubleclick/templates/hybrid-iframe.html',
    interstitialDisplayAdPath : 'aetn.ist.display;pos=istdisplay',
    timedIntervalAdIframeUrl : Drupal.settings.basePath + 'sites/all/modules/custom/doubleclick/templates/timedintervalhybrid-iframe.html',
    timedIntervalAdInitalFrequency : 0
  };

  jQuery.extend(settings, options);

  /**
   * @function refreshAds() Function called to refresh an ad or ads.
   * 
   * 
   */
  function refreshAds(ads, ord_no) {
      var adsToRefresh = (typeof ads != "undefined" && ads) ? (ads || settings.adTypes)
          : settings.adTypes;
      var newRand = ord_no ? ord_no : Math.floor(Math.random() * 100000000);      
      jQuery.each(adsToRefresh, function(i, n) {
        var d = document.getElementById(n);
        if (d != null) {
          var newSrc = d.src.replace(/ord%3D([0-9]+)/i, 'ord%3D' + newRand);
          d.src = newSrc;
          $('#' + n).attr('style', ''); // obliterate any element styles
          // applied; this is to revive an iframe
          // which has been stomped by pointroll
          // TFC 2009-02-10
          if (typeof (Dart) != 'undefined') {
            Dart.ord = newRand; // Change global Dart pointer to ord_no
            // 07/16/2008
          }
        }
      }); 
      
      if(settings.timedIntervalAdInitalFrequency >= 0 && typeof timeintervalad_path != "undefined" && Drupal.settings.galleryFrameAD){    	
		 var views = parseInt(settings.timedIntervalAdInitalFrequency) +  1;
    	 //Increment the Frequency by 1 and set into the cookie    	 
    	 if((views % Drupal.settings.timedIntervalAdFrequency) == 0){
    	   displaytimedintervalad();    	   
    	   settings.timedIntervalAdInitalFrequency = 0;
    	 } else {    		 
    	   settings.timedIntervalAdInitalFrequency = views;
    	 }
      }
      
  }
  /**
   * @function displaytimedintervalad() Build the AD DOM and display in the Context 
   * 
   * 
   * 
   */
  function displaytimedintervalad() {
	if( typeof timeintervalad_path != "undefined"){	  
		var adSrc = settings.interstitialDisplayAdIframeUrl
      + "?path="
      + encodeURIComponent(timeintervalad_path + Dart.quantSegs +"ord=" + Math.floor(Math.random() * 100000000));
      
	  var objectDiv = Drupal.settings.timedIntervalAdWrapperId;
	  var WrapperDiv = Drupal.settings.timedIntervalAdWrapperDiv;	  
	  $('.'+WrapperDiv).show();
	  var adIframe = jQuery("<iframe>").attr( {
		  "height" : 250,
		  "width" : 300,
		  "scrolling" : "no",
		  "frameBorder" : "0",
	      "background-color" : "transparent",
	  	  "allowtransparency" : "true",
	  	  "id" :"ad_timedinterval_hybrid"
	  });
	  
	  adIframe.attr( {
		  src : adSrc
	  });
	  
	 $('#'+objectDiv).append(adIframe);

	 var adTimeout = Drupal.settings.timedIntervalAdDuration;
	 setTimeout(function() {
	  	timedintervalAdComplete();
	 }, adTimeout * 1000);
   }
  }
  
  /**
   * @function timedintervalAdComplete() Close the timedInterval Ad after the specific time Duration  
   * 
   * 
   * 
   */
  function timedintervalAdComplete() {
	  var WrapperDiv = Drupal.settings.timedIntervalAdWrapperDiv;
	  var objectDiv = Drupal.settings.timedIntervalAdWrapperId;
	  $('#'+objectDiv).html('');
	  $('.'+WrapperDiv).hide();	  
	  $('.frame-ad-skip').click();
  }
	  
  
  
  /**
   * @function refreshPageView() trigger a pageview count for omniture, google
   *           analytics and quantcast
   * 
   * 
   */
  function refreshPageView(pagenum) {

    // Replaced with authorative call to common code
    aetn.lib.analytics.refreshPageView(pagenum);
    
    /*
    s.eVar10 = (typeof pagenum != "undefined" && pagenum) ? (pagenum)  : "1" ;
    // omniture call
    void (s.t());

    // Google Analytics
    // firstTracker._trackPageview();   // old
    _gaq.push(['_trackPageview']);

    // Quantcast
    delete _qpixelsent;
    quantserve();
    */
  }

  /**
   * @function runInterstitialAd Run the interstitial video ad
   * @param ad_id
   *          {string} ad_id to pass to accudeo, retrieved from the ad server
   */
  function runInterstitialAd(divId, ad_id, duration) {
    // Callback for ad ending.
    window.interstitialAdComplete = function() {
      wrapperDiv.hide(500);
      overlayDiv.hide(500);
      for ( var i = 0; i < settings.interstitialDivToHide.length; i++) {
        var hideMe = jQuery("#" + settings.interstitialDivToHide[i]);
        if (hideMe.length > 0) {
          hideMe.slideDown();
        }
      }
    };

    window.interstitialAdError = function() {
      interstitialAdComplete();
    };
    // end adComplete callback

    // Hide games etc. for ad start
    for ( var i = 0; i < settings.interstitialDivToHide.length; i++) {
      var hideMe = jQuery("#" + settings.interstitialDivToHide[i]);
      if (hideMe.length > 0) {
        hideMe.slideUp();
      }
    }
    var adText = jQuery("<div>").text("advertisement").addClass(
    "interstitialAdText").attr("id", "interstitialAdLabel");
    
    var closeButton = jQuery("<div>").text("close").addClass(
        "interstitialAdText").attr("id", "interstitialAdCloseButton")
        .click(interstitialAdComplete);
    
    var wrapperDiv = jQuery("<div>").addClass("interstitialVideoAdWrapper")
        .attr("id", settings.interstitialWrapperDiv);
    var adDiv = jQuery("<div>").addClass(divId).attr("id",
        settings.interstitialTargetDiv);
    var objectDiv = jQuery("<div>").attr("id", settings.interstitialObjectDiv);
    var overlayDiv = jQuery("<div>").attr("id", "interstitialOverlay")
        .addClass("black_overlay").height(jQuery('body').height());

    jQuery("body").append(
        wrapperDiv.append(adDiv.append(adText).append(closeButton).append(objectDiv))).append(
        overlayDiv);

    setTimeout(function() {
      jQuery("#interstitialAdCloseButton").css( {
        opacity : 0,
        visibility : "visible"
      }).animate( {
        opacity : 100
      }, 500);
    }, settings.interstitialHideButtonDelay * 1000 );

    if (divId == 'interstitial_display') {      
      var displayAdTile = Dart && Dart.tile ? ++Dart.tile : 1;
      var adSrc = settings.interstitialDisplayAdIframeUrl
          + "?path="
          + encodeURIComponent(settings.interstitialDisplayAdPath + ";tile="
              + displayAdTile + ";sz=" + settings.interstitialDisplayAdWidth
              + "x" + settings.interstitialDisplayAdHeight + ";adid=" + ad_id
              + ";ord=" + Math.floor(Math.random() * 100000000));

      var adIframe = jQuery("<iframe>").attr( {
        "height" : 250,
        "width" : 300,
        "scrolling" : "no",
        "frameBorder" : "0",
        "marginHeight" : "0",
        "marginWidth" : "0"
      });
      adIframe.attr( {
        src : adSrc
      });
      objectDiv.append(adIframe);

      var adTimeout = duration || settings.interstitialDisplayAdDuration;
      setTimeout(function() {
        interstitialAdComplete();
      }, adTimeout * 1000);

    } else {
      var flashvars = {};
      flashvars.programID = settings.interstitialAccudeoProgramId;
      flashvars.adID = ad_id;
      flashvars.onCompleteCallback = "interstitialAdComplete";
      flashvars.onErrorCallback = "interstitialAdError";
      // flashvars.onStartCallback = ''; //unused

      var params = {};
      params.play = "true";
      params.loop = "false";
      params.quality = "high";
      params.bgcolor = settings.interstitialBgColor;
      params.allowscriptaccess = "always";
      params.wmode = "opaque";

      var attributes = {};
      attributes.id = "InterstitialPlayer";
      attributes.name = "InterstitialPlayer";
      attributes.align = "middle";
      // === display the flash movie with swfObject ===//
      swfobject.embedSWF(settings.interstitialVideoSwfUrl,
          settings.interstitialObjectDiv, settings.interstitialVideoWidth,
          settings.interstitialVideoHeight, "9.0.124", "expressInstall.swf",
          flashvars, params, attributes, function(e) {
            if (!e.success) {
              interstitialAdComplete();
            }
          });
    }
  }
  ;
  /* Returns the public functions */
  return {
    /**
     * @function aetn.lib.ad.ifrmResize Function called to resize an iFrame'd
     *           ad.
     * 
     * @param width
     *          {number} new width
     * @param height
     *          {number} new iframe height
     * @param ad_size_id
     *          {string} target ad position
     */

    ifrmResize : function(w, h, ad_size_id, ad_id, duration) {
      var divId = ad_size_id || 'ad_300x250_top_multisize';
      if (divId.match('^interstitial(_display)?')) {
        runInterstitialAd(divId, ad_id, duration);
      } else {
        var targetFrame = jQuery("#" + divId);
        if (targetFrame.size() <= 0) {
          return;
        }
        var width = parseInt(w);
        if (isNaN(width) || width < 0) {
          width = targetFrame.width();
        }
        var height = parseInt(h);
        if (isNaN(height) || height < 0) {
          height = targetFrame.height();
        }
        targetFrame.width(width).height(height);
      }
    },
    /**
     * @function aetn.lib.ad.refresh Function called to refresh an ad or ads
     *           and register a page-view.
     * 
     * @param ads
     *          {string|array} element Id of ad or ads to refresh, if null
     *          will use defaults
     * @param ord_no
     *          {string} ord_no to use when refreshing the ads
     * 
     */
    refresh : function(ads, ord_no) {
      refreshAds(ads, ord_no);
      refreshPageView();
    },
    

    /**
     * @function aetn.lib.ad.refreshAds Function called to to refresh
     *           ads but not page-views
     * 
     */
    refreshAds : function(ads, ord_no) {
      refreshAds(ads, ord_no);
    },    


    /**
     * @function aetn.lib.ad.refreshPageView Function called to to refresh
     *           page views in omniture
     * 
     */
    refreshPageView : function(pagenum) {
      // Do something with pagenum
      refreshPageView(pagenum);
    },   
    
    /**
     * @function aetn.lib.ad.brandedCanvasRender Function to render Branded Canvas Ad
     *           Designed for video pages, background is scrolling (not fixed)
     * 
     */
    brandedCanvasRender : function(options) {
      $(document).ready(function() {
        $("body").css("background", options.background_color + " url(" + options.image_url + ")  top center " + options.background_tiling);
        $("body").css("cursor", "pointer");
        $(".container").css('background', 'none'); //hide container image
        $("#wrap > div").css("cursor", "default"); // make the main body section not appear clickable
        $("body").click(function(e) {
          if(e.target.tagName.toLowerCase() == "body"
            || e.target.id.toLowerCase() == "container"
            || e.target.id.toLowerCase() == "wrap") {
            window.open(options.link_url);
          }
        });
      });
    },

    /**
     * @function aetn.lib.ad.testLocation Function called to test presence of
     *           'test' in url's query for Games site
     * 
     */
    testLocation : function() {
      if (document.location.search != undefined) {
        var query_parts = document.location.search.substr(1).split('&');
        var params = {};
        var param = [];
        for ( var i = 0; i < query_parts.length; i++) {
          param = query_parts[i].split('=', 2);
          params[param[0]] = param[1];
        }
        if (params['test'] != undefined && params['test'] != '') {
          return 'on';
        }
      }
      return '';
    }
  };
};

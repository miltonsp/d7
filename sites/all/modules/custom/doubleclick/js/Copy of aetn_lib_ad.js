/* $Id: aetn_lib_ad.js 95996 2010-11-24 01:47:22Z jeremyb $ */
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
        'ad_300x250_top_multisize', 'ad_160x600_top_hybrid'),

    interstitialDivToHide : new Array('gamepanel'),
    interstitialVideoSwfUrl : '/astrology/sites/all/modules/custom/doubleclick/swf/interstitialPlayer.swf',
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
    interstitialDisplayAdIframeUrl : '/astrology/sites/all/modules/custom/doubleclick/templates/hybrid-iframe.html',
    interstitialDisplayAdPath : 'aetn.ist.display;pos=istdisplay'
  };

<<<<<<< .mine

=======
  jQuery.extend(settings, options);

>>>>>>> .r98604
  /**
   * @function rrefreshAds() Function called to refresh an ad or ads.
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
  }

  /**
   * @function refreshPageView() trigger a pageview count for omniture, google
   *           analytics and quantcast
   * 
   * 
   */
  function refreshPageView() {
    // omniture call
    void (s.t());

    // Google Analytics
    firstTracker._trackPageview();
    secondTracker._trackPageview();

    // Quantcast
    delete _qpixelsent;
    quantserve();
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
     * @function aetn.lib.ad.refresh Function called to refresh an ad or ads.
     * 
     * @param ads
     *          {string|array} element Id of ad or ads to refresh, if null
     *          will use defaults
     * @param ord_no
     *          {string} ord_no to use when refreshing the ads
     * 
     */
    refresh : function(ads, ord_no) {
      refreshAds(ads, ord_n);
      refreshPageView();
    },
    

    /**
     * @function aetn.lib.ad.refreshPageView Function called to to refresh
     *           page views in omniture
     * 
     */
    refreshPageView : function(pagenum) {
      // Do something with pagenum
      refreshPageView();
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
<<<<<<< .mine
        if (params['test'] != undefined && params['test'] != '') {
          return 'on';
        }
      }
      return '';
    }    
=======
      });
      refreshPageView();
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
>>>>>>> .r98604
  };
<<<<<<< .mine
};=======
};
>>>>>>> .r98604

/* $Id: aetn_lib_ad.js 98706 2011-01-11 20:49:14Z milton $ */
/**
 * @file aetn_lib_analytics.js Omniture javascript methods. Included when
 *       the ltv_analytics module loads.
 * 
 */
var aetn = aetn || {};
aetn.lib = aetn.lib || {};

// Define constructor function for creating aetn.lib.analytics object
aetn.lib.Analytics = function(options) {

  // Not used currently. For late expansion
  var settings = {
    param1 : '624',
    param2 : '402',
    param3 : '300'
  };
  jQuery.extend(settings, options);

  ;
  /* Returns the public functions */
  return {
    /**
     * @function aetn.lib.analytics.refreshPageView() trigger a pageview count for omniture, google
     *           analytics and quantcast
     *           If omniture_inhibit is 1, then skip Omniture refresh (for swf calls)
     * 
     */
    refreshPageView : function (pagenum, omniture_inhibit) {

      s.eVar10 = (typeof pagenum != "undefined" && pagenum) ? (pagenum)  : "1" ;
      // Omniture. Only call omniture if omniture_inhibit is false
      if (!omniture_inhibit) {
        void (s.t());
      }  
  
      // Google Analytics
      // firstTracker._trackPageview();   // old
      _gaq.push(['_trackPageview']);
      
      // comScore Analytics
      // Updated by Milton to handle dynamic page refresh
      // Following retrieves predefined var _comscore_account 
      // _comscore_account variable should have been defined in inc-interior-footer.php at page load time
      // Usually as -> _comscore_account = { c1: "2", c2: "3005002" };
      // The following will regenerate a script tag
      _comscore = _comscore || [];
      _comscore_account = _comscore_account || [];
      _comscore.push(_comscore_account); 
      // Remove previous load of beacon.js
      jQuery("script").each(function () {
            if (this.src.indexOf("scorecardresearch.com/beacon.js") != -1) {
              $(this).remove();
            }
       });
      (function() {
         var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
         s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js?ts=100";
         el.parentNode.insertBefore(s, el);
         })();
         
      // Nielsen Analytics
      virtual = 1;
      nielsen_trackPageview(virtual);
  
      // Quantcast
      delete __qc.qpixelsent;
      _qevents.push({
         qacct : _quantcast.account1
      });
      _qevents.push({
         qacct : _quantcast.account2,
         labels: _quantcast.labels
      });
    },

    /**
     * @function aetn.lib.analytics.oTrackLink() trigger Omniture events with no pagehits
     *             use Custom Link Tracking -- Will not generate a Page hit
     *
     *  @param customTag
     *    Custom name of event
     *  eventTag
     *   Fire this event otherwise set to NULL
     *  cancelBubble
     *   In some cases we need to set it to true or 1 to eliminate double triggers
     *   sample:   oTrackLink('myl-reg-std-signin', '', this);
     */
  
    oTrackLink : function (customTag, eventTag, domNode, cancelBubble) {
      if(s != undefined) {
        if(eventTag) {
          s.linkTrackVars = 'events';
          s.linkTrackEvents = eventTag;
          s.events = eventTag;
          if (cancelBubble) {
            // The next 3 lines removes Omniture onclick event on Body -- otherwise it doubles up
            if (!event) {var event = window.event;}
            event.cancelBubble = true; // For IE
            if (event.stopPropagation) event.stopPropagation(); //For Netscape
          }
        }
        s.tl(domNode ? domNode : true, 'o', customTag);
      }
    }
  };  
};
// Create aetn.lib.analytics object for future use
aetn.lib.analytics = aetn.lib.analytics || new aetn.lib.Analytics();


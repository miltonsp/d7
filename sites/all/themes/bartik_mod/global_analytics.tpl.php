
<!--  #########################  -->
<!--     OMNITURE INTEGRATION    -->
<!--  #########################  -->
<script language="JavaScript" type="text/javascript"><!--
<?php /* You may give each page an identifying name, server, and channel on the next lines. */ ?>
// Following lines will output all the s.xxxx  properties
<?php
if (module_exists('ltv_analytics')) {
  ltv_analytics_populate();
  print(ltv_analytics_view());
} else {
  error_log("From global_analytics.tpl.php line: " . __LINE__ . ":  'ltv_analytics.module' missing!");
}
?>
/* Trigger an event 6 for disqus comment */
function disqus_config() {
  this.callbacks.onNewComment = [function() { s.eVar6="1"; }];
}
<?php /* You may give each page an identifying name, server, and channel on the next lines. */ ?>
/* Set logged in state */
if (document.cookie.indexOf('loginstatus=') == -1 ) {
  s.eVar16="0"; 
} else {
  s.eVar16="1"; 
}
/* Set eVar10 if the page apears as #id=xx  see ltv_photo_gallery module */
if (document.location.hash && (frameId = location.toString().split('#id=')[1]) && frameId != isNaN) {
  s.eVar10 = frameId;
}
/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code=s.t();if(s_code)document.write(s_code)//--></script>
<script language="JavaScript" type="text/javascript"><!--
    if(navigator.appVersion.indexOf('MSIE')>=0)document.write(unescape('%3C')+'\!-'+'-')
//--></script>

<!-- End SiteCatalyst code version: H.22.1. -->

<!--  ##############################  -->
<!--      END OMNITURE INTEGRATION    -->
<!--  ##############################  -->

<!-- Start Google Analytics tag -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-777181-1']);
  _gaq.push(['_setDomainName', 'mylifetime.com']);
  _gaq.push(['_addIgnoredRef', 'mylifetime.com']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>

<!-- Compute label for Quantcast tags -->
<?php
if (module_exists('ltv_analytics')) {
  $siteSection = ltv_analytics_getSiteSection(1);
  if ($siteSection == 'Shows')  {
    $siteSection = ltv_analytics_getSiteSection(2);
    $siteSection = ($siteSection)  ? $siteSection : 'ShowsLanding'; 
  }
}
?>
<!-- Start Quantcast V2, part 1 tag -->
<script type="text/javascript">
  // store accounts here for later retrieval and photo-galleries
  var _quantcast = {
	account1 : "p-fdoi6RH1gCcMo",
	account2 : "p-84eTroxoNX3JE",
	labels   : "MYL:<?php print $siteSection?>"
  };
  var _qevents = _qevents || [];
  (function() {
   var elem = document.createElement('script');
   elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
   elem.async = true;
   elem.type = "text/javascript";
   var scpt = document.getElementsByTagName('script')[0];
   scpt.parentNode.insertBefore(elem, scpt);  
  })();
</script>
<!-- Start Quantcast V2, part 2a tag -->
<script type="text/javascript">
_qevents.push({ qacct: _quantcast.account1});
</script>
<noscript>
<div style="display: none;"><img src="http://pixel.quantserve.com/pixel/p-fdoi6RH1gCcMo.gif" height="1" width="1" alt="Quantcast"/></div>
</noscript>
<!-- Start Quantcast V2, part 2b tag -->
<script type="text/javascript">
_qevents.push({
    qacct : _quantcast.account2,
    labels: _quantcast.labels
    });
</script>
<noscript>
<div style="display: none;"><img src="http://pixel.quantserve.com/pixel/p-84eTroxoNX3JE.gif?labels=MYL:<?php print $siteSection?>" height="1" width="1" alt="Quantcast"/></div>
</noscript>
<!-- End Quantcast V2 tags -->

<script type='text/javascript'>
// Conversion Name: Global Header
var ebRand = Math.random()+'';
ebRand = ebRand * 1000000;
//<![CDATA[ 
document.write('<scr'+'ipt src="HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&amp;ActivityID=69361&amp;rnd=' + ebRand + '"></scr' + 'ipt>');
//]]>
var ebRand = Math.random()+'';
ebRand = ebRand * 1000000;
//<![CDATA[ 
document.write('<scr'+'ipt src="HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&amp;ActivityID=69365&amp;rnd=' + ebRand + '"></scr' + 'ipt>');
//]]>
</script>
<noscript>
<img width="1" height="1" style="border:0" src="HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&amp;ActivityID=69361&amp;ns=1"/>
<img width="1" height="1" style="border:0" src="HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&amp;ActivityID=69365&amp;ns=1"/>
</noscript>

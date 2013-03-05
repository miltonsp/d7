// quancast code. Sets up DartPreprocess.quantSegs object
  var quantSegs="";
  var DartPreprocess = DartPreprocess || {};

  function createCookie(name,value,hours) {
  	if (hours) {
  		var date = new Date();
  		date.setTime(date.getTime()+(hours*60*60*1000));
  		var expires = "; expires="+date.toGMTString();
  	}
  	else var expires = "";
  	document.cookie = name+"="+value+expires+"; path=/";
  }
  function readCookie(name) {
  	var nameEQ = name + "=";
  	var ca = document.cookie.split(';');
  	for(var i=0;i < ca.length;i++) {
  		var c = ca[i];
  		while (c.charAt(0)==' ') c = c.substring(1,c.length);
  		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  	}
  	return null;
  }
  
  function qc_results(result) {
    for (var i = 0; i < result.segments.length; i++) {
      // For testing allow the 'D' and 'T' codes
      // if (aetn.lib.ad.testLocation() || result.segments[i].id.length > 1) {
      if (result.segments[i].id.length > 1) {
        quantSegs += "Q=" + result.segments[i].id + ","; //customizable per your ad server
      }  
    }
    DartPreprocess.quantSegs = quantSegs.replace(/,/g, ';');
    
    if (typeof(DartPreprocess.quantSegs) == 'undefined')  DartPreprocess.quantSegs = '';
    createCookie("quantSegs",quantSegs,24);    // Expire in 24 hrs
  }
 

  // Read cookie in Javascript to make sure its there
  quantSegs = readCookie("quantSegs");
  if (quantSegs !== null && quantSegs.length > 0) {
    DartPreprocess.quantSegs = quantSegs.replace(/,/g, ';');
  } else {
    quantSegs = DartPreprocess.quantSegs = '';
    // Use non-blocking Javascript call
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = 'http://pixel.quantserve.com/api/segments.json?a=p-84eTroxoNX3JE&callback=qc_results';
    document.getElementsByTagName('head')[0].appendChild(js);
  }


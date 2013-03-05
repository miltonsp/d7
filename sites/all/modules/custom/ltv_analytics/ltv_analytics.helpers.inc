<?php
// $Id: ltv_analytics.helpers.inc 130852 2012-02-17 16:03:23Z milton $

/**
 * @file
 * Helper functions for the ltv_analytics module (no Drupal hooks here). 
 */

global $analytics;	// It's a global object containing all the omniture analytics info

// Check if $analytics is defined and if not create it
if (isset($analytics) || $analytics = new stdClass()) {};
 
//  Sections which are prefixed for a given site
if (variable_get('site_short_name', '') == 'tbmcomm') {
     $analytics->prefix_sections =  array('BeautyStyle');
}

if (variable_get('site_short_name', '') == 'allthelooks') {
     $analytics->prefix_sections =  array('BeautyStyle');
}

function ltv_analytics_getCurrentPage() {
  // For quizzes
  $value =  "";
  // Following lines are used to determine page 1. Succeding page counters needs to be determined from the Javascript side
  if ($_SESSION['analytics_quiz_counter']) {
    $value  = $_SESSION['analytics_quiz_counter'];
  }
  return $value;
}

function ltv_analytics_getPathInfo($str_type){
  $bln_isPage = false;
  $tmp_path=$_SERVER[REQUEST_URI];  //actual path
  $tmp_file= drupal_lookup_path('source', $_REQUEST['q']); //drupal path

  // Is this an article, show, etc page or just a directory landing page?
  if ((preg_match("/node\/\d/i", $tmp_file)) || (preg_match("/user\/\d/i", $tmp_path)) || (preg_match("/node\/\d/i", $tmp_path))) {
   $bln_isPage = true;
  }
  if (strpos($tmp_path, "/") != 0) {
   $tmp_path = "/".$tmp_path;
  }
  // 03/30/2008  Exception mappings -- custom request

  // debug
  // error_log("From inc-interior-analytics.php:  \$tmp_path: " . $tmp_path);
  $tmp_path = preg_replace('/^\/hollywood-tails/','/lifestyle/entertainment/hollywood-tails', $tmp_path,1);
  // debug
  // error_log("From inc-interior-analytics.php (1):  \$tmp_path: " . $tmp_path);

  $atmp_path = explode("/", $tmp_path);
  $int_array_size = count($atmp_path)-1;
	/*
	If it is not a page, it is an index, unless it is the homepage for the site
	If it is a page, the last
	*/
  if (!$bln_isPage && (strlen($tmp_path)==1)){
    $tmp_file="home";
  }
  elseif (!$bln_isPage){
    $tmp_file="index";
  }
  else {
    $tmp_file=end($atmp_path);
    $atmp_path = array_slice($atmp_path, 0, $int_array_size);
  }

  if ($str_type=='path'){
    $tmp_path = implode("/", $atmp_path);
    return $tmp_path;
  }
  elseif ($str_type=='file'){
    return $tmp_file;
  }
}

function ltv_analytics_get_uri($type) {

  $uri = $_SERVER['REQUEST_URI'];		//  Will return  as (eg) '/index.html'
  if ($type == 'url') {
    if ($uri == '/' || preg_match("#^/\?+#", $uri)) {   // Match '/' or  '/? and anything afterwards
      // community = homepage (but specified to be community so not to overlap with mylifetime.com homepage)
    	$val = 'community';
    }
    else {
    	$val = $uri;
    	if (preg_match("#\?.*#", $uri)) {
    		$a_url= split("\?",$uri);
    		$val = $a_url[0];
    	}
		$val = rtrim($val, '/');
    }
  }
  if (preg_match("/q=*/i", $type)) {
  	$kv = split("=",$type);
  	$key = $kv[1];
  	$val = $_GET[$key];
  }
  return $val;
}

function ltv_analytics_getPageInfo($infoType) {
  static $nid;   // obtained from first call to get_page_info("nodeID")

  $val = '';
	$drupal_file = drupal_lookup_path('source', $_REQUEST['q']);
	$uri = ltv_analytics_get_uri('url');

	if ($infoType == 'nodeID') {
	  if (arg(0) == 'node' && is_numeric(arg(1))) {
	    $nid = arg(1);
	    return $nid;
	  }
	}
	if ($infoType == 'nodeType') {
	  if (ltv_analytics_getSiteSection(1) == 'home') {
			$val = 'index';
			return $val;
	  }
	  if (!is_numeric($nid)) {
			$val="index";
			return $val;
	  }
	  $node = node_load($nid);   // This is preloaded from static variables
	  return $node->type;
	}
	if ($infoType == 'searchTerm') {
	  // example: search/apachesolr_search/hair products?filters=type:discussion
	  // why we use drupal_encode() because spaces are possible
		if (arg(0) == 'search' && arg(1) == 'apachesolr_search' && arg(2) != '') {
		  $val = 'community-topics-'. drupal_urlencode(arg(2));
		  if ($_REQUEST['filters'] != '') {
  		  $val .= '-'. drupal_urlencode($_REQUEST['filters']);
  		}
		}
		return $val;
	}
	if ($infoType == 'subTitle') {
		// Remove '| slogan' at end of title
		$val = preg_replace("/\s*\| *$/i", '', check_plain(drupal_get_title()));
 		// Because CMS title is not comming thru on all pages -- use document.title (Javascript pickup)
		if (!$val) {
		  // if $val is prefixed with 'javascript:' it will be handled as javascript code
		  $val = "javascript:document.title;";
		}  
	}
  	if ($infoType=="TVvsNonTV") {
		$val = "Non-TV";
	}
  return $val;
}


function ltv_analytics_getSiteSection($level){
  // Global variable
  global $analytics;    // It's a global object containing all the omniture analytics info

  // Adjust request to handle prefix sections 
  $prefix_sections = $analytics->prefix_sections;
  $prefix_sections_count = count($prefix_sections);

  if ($level <= $prefix_sections_count) {
    $tmp_site = $prefix_sections[$level - 1];   //  array index starts from zero
	  // Change to Pascal case
    return ucfirst($tmp_site);
  }
  $level = $level - $prefix_sections_count;
  // End of Adjust request to handle prefix sections 
		
  global $conf;
  $level -= 1; // the first part of URL is level 0, not level 1
  $section = '';
  $uri = ltv_analytics_get_uri('url');

  // Custom Mappings
  $uri = ltv_analytics_uri_mapping($uri);

  // community = homepage (but specified to be community so not to overlap with mylifetime.com homepage)
  if ($uri == '/' || $uri == 'community') {
  	$section = 'community';
  }
  else if (arg(0) == 'node' && arg(1) == 'add') {
    if ($level == 0) {
      $section = 'create';
    }
    if ($level == 1) {
      // node/add/discussion
      // $section = discussion in this case
      $section = arg(2);
    }
  }
    else {
		$path = explode('/', $uri);
	  array_shift($path); // shift off first blank '' from explode()

    // shift off prefix if being used, append / for checking since that is requred for the variable
    if ($conf['community_config_url_prefix'] != '' && $path[0] .'/' == $conf['community_config_url_prefix']) {
      array_shift($path); // shift off community
    }

    // omniture tracking is setup to use 'member' instead of 'user'
    if (arg(0) == 'user') {
      array_shift($path); // shift off user
      if (arg(1) == 'register') {
        $path[0] = 'registration';
      }
      else if (arg(1) == 'login') {
        $path[0] = 'login';
      }
      else if (arg(1) == 'password') {
        $path[0] = 'password-request';
      }
      else {
        $path[0] = 'members'; // rename username to generic members grouping
      }
    }
    else if (arg(0) == 'search' && arg(1) == 'apachesolr_search') {
      // remove search term since this is in s.prop1
      unset($path[2]);
      
      // replace the apachesolr_search with just the type being searched
      if ($_REQUEST['filters'] != '') {
        $path[1] = str_replace('type:', '', $_REQUEST['filters']);
      }
      // if no filter, this is searching everything
      else {
        $path[1] = 'everything';
      }
    }
    // anything but a user page
    else {
    	// Removed because following function is not available
    	// $community = community_get_site();
        if ($community['group']->nid) {
            // prepend 'groups' to all group pages
          array_unshift($path, 'groups');
        }
    }
    
    // if the level is within bounds of the total, otherwise you are looking for a level that doens't exist
    if (count($path) >= $level) {
    $section = $path[$level];
    }
  }

  // Change to Pascal case
  $section = ucfirst($section);
  // Turn the '-x' to Pascal case and remove dash
  $section = preg_replace("/-(.)/e", "strtoupper('$1')", $section);
  return $section;
}


function ltv_analytics_getOmnitureEvent(){

  global $analytics;	// It's a global object containing all the omniture analytics info 
  $event = '';

  // The following event is removed from here and will be trigered with s.tl() event
  //   as aetn.lib.analytics.oTrackLink('Manual Search','event7','')
  // if (ltv_analytics_getPageInfo('searchTerm') != '') {
  //		$event = 'event7';
  // }

  if (!$analytics->events) {
    $events = $event;
  } else if ($event) {
    $events = $analytics->events . "," . $event;
  } else {
    $events = $analytics->events;
  } 
    
  return $events;
}

function ltv_analytics_getOmniturePageName(){
  
  $uri= rtrim(ltv_analytics_get_uri("url"), '/');

  // Custom Mappings
  $uri = ltv_analytics_uri_mapping($uri);
  $uri = rtrim($uri, '/');

  //for home page only or "<level 1>:<level 2>:<level 3>:<level 4>:<level 5>" (URL path separated with colons, NOT including page name)
  // $return = (preg_match("/^\//",$uri) ? str_replace("/", ":", substr($uri,1)) : $uri); 
  $return = str_replace("/", ":", substr($uri,1));
  // Turn to Pascal case  
  $return = preg_replace("/:(.)/e", "':' . strtoupper('$1')", $return);
  // Turn the '-x' to Pascal case and remove dash
  $return = preg_replace("/-(.)/e", "strtoupper('$1')", $return);
  return ucfirst($return);
}

/*   ltv_analytics_uri_mapping()
 *   For purposes of generating a custom converted site hierarchy from a given url,
 *   convert one url to another .
 *   Add patterns and replacements
 * 
 */
function ltv_analytics_uri_mapping($uri_clean) {
  static $uri_mapped;
  
  // if $uri_mapped has already been computed once, there is no need to do it again
  if (!isset($uri_mapped)) {

    $uri_mapped = $uri_clean;
    
    $regexp      = array(
      // '|lifestyle/beauty-style|'     => 'beauty-style',
      // '|lifestyle/entertainment|'    => 'entertainment',
      // '|lifetime-tv-schedule|'       => 'schedule',
      
      // Detect home page for these sub-sites
      '|^.*/total-beauty-makeover\/*\?*$|'     => '/total-beauty-makeover/home',
      '|^.*all-the-looks\/*\?*$|'    => '/all-the-looks/home',
    );
  
    $uri_mapped = preg_replace(array_keys($regexp), array_values($regexp), $uri_clean);
  }
  
  return $uri_mapped;
}

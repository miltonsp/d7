<?php
// $Id: ltv_analytics.helpers.ltvd6.inc 130852 2012-02-17 16:03:23Z milton $

/**
 * @file
 * Helper functions for the ltv_analytics module (no Drupal hooks here). 
 */

global $analytics;	// It's a global object containing all the omniture analytics info

// Check if $analytics is defined and if not create it
if (isset($analytics) || $analytics = new stdClass()) {};
 
//  Sections which are prefixed for a given site
/*  Removed -- not used in ltv.analytics.helpers.ltvd6.inc
if (variable_get('site_short_name', '') == 'tbmcomm') {
     $analytics->prefix_sections =  array('BeautyStyle');
}

if (variable_get('site_short_name', '') == 'allthelooks') {
     $analytics->prefix_sections =  array('BeautyStyle');
}
*/

/**
 * Implementation of hook_post_analytics().
 *   called at the end of ltv_analytics_populate()
 *   Put in here code for one-time updates
 */

function ltv_analytics_post_analytics($analytics) {

  // Special update for JusticeForNataleeHolloway movie
  if (isset($analytics->eVar8) && ($analytics->eVar8 == "MYL:NataleeHolloway")) {
    $analytics->eVar8 = "MYL:JusticeForNataleeHolloway";
  }

  // Special update for The Protector clue hunt game
  if (isset($analytics->eVar7) && ($analytics->eVar7 == "MYL:TheProtector")) {
	if(drupal_get_path_alias($_GET['q'])=='shows/the-protector/clue-hunt-game') {
	    $analytics->eVar9 = "Game";
	    $analytics->eVar20 = "MYL:TheProtectorClueHuntGame";
	    $analytics->eVar21 = "Promo";
	    $analytics->eVar22 = "PhotoMemory";
	}
	
  }
  
   //Override the analytics variables for the video pages
   $pattern ="/\/video\//"; //Other than video index page
   $current_split_url = drupal_get_path_alias($_GET['q']);
   if(substr($current_split_url,0,5) == "video") {
     $analytics->pageName = 'MYL:Video:Home';
	 $analytics->eVar1 = 'MYL:Video:Home';
	 $analytics->eVar5 = 'Mix';
	 $analytics->eVar9 = 'LandingPage';
   } else if(preg_match($pattern,$current_split_url)) {   
     $analytics->eVar9 = 'Video';
   }
   
   if (isset($analytics->pageName) && ($analytics->pageName == "MYL:WatchFullMoviesOnline")) {
     $analytics->pageName = "MYL:Movies:WatchFullMoviesOnline:Home";
	 $analytics->eVar49 = "MYL:Movies";
	 $analytics->eVar1 = "MYL:Movies:WatchFullMoviesOnline";
	 $analytics->eVar2 = "MYL:Movies:WatchFullMoviesOnline:Home";
	 $analytics->eVar3 = "None";
	 $analytics->eVar4 = "None";   
	 $analytics->eVar5 = 'TV';
	 $analytics->eVar9 = "Video";   
   } else if (isset($analytics->pageName) && ($analytics->pageName == "MYL:WatchFullEpisodesOnline")) {
     $analytics->pageName = "MYL:Shows:WatchFullEpisodesOnline:Home";
     $analytics->eVar49 = "MYL:Shows";
     $analytics->eVar1 = "MYL:Shows:WatchFullEpisodesOnline";
     $analytics->eVar2 = "MYL:Shows:WatchFullEpisodesOnline:Home";
     $analytics->eVar3 = "None";
     $analytics->eVar4 = "None";    
	 $analytics->eVar5 = 'TV';
	 $analytics->eVar9 = "Video";
   }
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
    	// $val = 'community';
    	$val = '/home';
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
  if (is_numeric(arg(1))) {
    $nid = arg(1);
  }

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
	  $type = 'index';
	  //Override the analytics variables for the Show Premium Type Homepages
	  if ($node->type == 'show') {
	    $type = 'LandingPage';
	  }
	  //Override the analytics variables for the Show Contestant & Show Judges pages
	  if ($node->type == 'show_contestant' || $node->type == 'show_judge') {
	    $type = 'CastPage';
	  }
	  //Override the analytics variables for the Photo Gallery pages
	  if ($node->type == 'photo_gallery') {
	    $type = 'PhotoGallery';
	  }
	  //Override the analytics variables for the Photo Gallery pages
	  if ($node->type == 'video') {
	    $type = 'Video';
	  }		
	  //Override the analytics variables for the Show About page
	  if ($node->type == 'article') {
	    $about_split = explode('/',$node->path);
	    if ($about_split[2] == 'about') {
	      $type = 'AboutShowPage';
	    }
	  }	
	  return $type;
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
  $uri= rtrim(ltv_analytics_get_uri("url"), '/');

  // Custom Mappings
  $uri = ltv_analytics_uri_mapping($uri);

  // community = homepage (but specified to be community so not to overlap with mylifetime.com homepage)
  if ($uri == '/') {
  	$section = 'home';
  }
  else  if ($uri == 'community') {
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

/**
 * Will add event to the page load omniture event
 *    Limit the use of this function to static events that can be registered at page load time
 *   (don't use for asynchronous events occurring after page load -- use: aetn.lib.analytics.oTrackLink()
 *
 * @param $event
 *   This string contains the event number, e.g. event43
 *
 * @return $boolean
 *   true: written; false: not written
 */

function ltv_analytics_setOmnitureEvent($event = ''){

  global $analytics;	// It's a global object containing all the omniture analytics info 

  if ($analytics->events && $event) {
    $analytics->events .=  "," . $event;
    return true;
  } else if ($event) {
   $analytics->events = $event;
    return true;
  } 
    
  return false;
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
  // Replace 'Season1'
  $return = preg_replace("/Season\w[:]/", "", $return);
  return ucfirst($return);
}

/*   ltv_analytics_uri_mapping()
 *   For purposes of generating a custom converted site hierarchy from a given url,
 *   convert one url to another .
 *   Add patterns and replacements
 * 
 */
function ltv_analytics_uri_mapping($uri) {
  static $uri_mapped;
  
  // if $uri_mapped has already been computed once, there is no need to do it again
  if (!isset($uri_mapped)) {
    $u = trim($uri , '/');  // for shortenning the call to arg(n, $u)
    $uri_mapped = $uri;
  
    
    $regexp      = array(
      // '|lifestyle/beauty-style|'     => 'beauty-style',
      // '|lifestyle/entertainment|'    => 'entertainment',
      // '|lifetime-tv-schedule|'       => 'schedule',
      
      // Detect home page for these sub-sites
      // '|^.*/total-beauty-makeover\/*\?*$|'     => '/total-beauty-makeover/home',
      // '|^.*all-the-looks\/*\?*$|'    => '/all-the-looks/home',
  
      // Detect quizzes
      '|^/fun-quizzes\/*\?*$|'       => '/quizzes/home',    
      '|^/fun-quizzes|'       => '/quizzes',    
  
    );
  
    $uri_mapped = preg_replace(array_keys($regexp), array_values($regexp), $uri);
  
    // Weird, but need to add home to category pages with home
    // Note the arg(n, $path) will not get confused with node/xyx
    if (arg(0, $u) == 'fun-quizzes' && arg(1, $u) && !arg(2, $u) && arg(1, $u) != 'all') {
      $uri_mapped = $uri_mapped . '/home';
    }
  
    if (arg(0, $u) == 'fun-quizzes' && arg(1, $u) && arg(2, $u) && !arg(3, $u)) {
      if (arg(2, $u) != 'most-popular' &&  arg(2, $u) != 'most-shared') {
        $uri_mapped = $uri_mapped . '/takeQuiz';
      }
    }
  
    // debug
    /*
    error_log("From ltv_analytics.helpers.ltvd6.inc line 344:   \$uri: "  . print_r($uri, 1));
    error_log("From ltv_analytics.helpers.ltvd6.inc line 345:   \$uri_mapped: " . print_r($uri_mapped, 1));
    error_log("From ltv_analytics.helpers.ltvd6.inc line 346:   \arg(0, uri) \arg(1, uri): " . print_r(arg(0, $u) . ' ' . arg(1, $u), 1));
    error_log("From ltv_analytics.helpers.ltvd6.inc line 347:   \arg(2, uri) \arg(3, uri): " . print_r(arg(2, $u) . ' ' . arg(3, $u), 1));
    */
  }
  
  return $uri_mapped;
}
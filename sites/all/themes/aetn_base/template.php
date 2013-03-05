<?php
define('AETN_BASE_WRAPPER_TTL', 1800); // 30 minutes

function aetn_base_theme() {
  return array(
    
  );
}

function aetn_base_get_user_tools(&$vars) {
  global $user;
  if ($user->uid !== 0) {
    $num = function_exists('_messaging_users_unread') ? _messaging_users_unread($user->uid) : 0;
    $vars['welcome'] = t('Welcome %username', array('%username' => $user->name));
    $vars['welcome'] .= l(' ('. format_plural($num, '1 message', '@count messages') .')', 'user/'. $user->uid .'/messages');
    $vars['account_links'] = array(l(t('My Account'), 'user/'. $user->uid), l(t('Logout'), 'logout'));  
    }
  else {
    // had to set to ser/register to get a value > 0
    if (!strpos($_REQUEST['q'], 'ser/register')) {
      $popups = ' popups-form-reload';
    }
    $vars['account_links'] = array(l(t('sign in'), 'user', $options = array('attributes' => array('class' => 'sign-in' . $popups))), l(t('register'), 'user/register'));
  }
}


function aetn_base_preprocess_page(&$vars) {
  global $conf;
  
  $vars['wrapper'] = aetn_base_get_wrapper();

  //  Get Welcome, My Account, Login, Logout toolbar variables
  aetn_base_get_user_tools($vars);
  
  $title = drupal_get_title();

  $headers = drupal_get_http_header();
  // fix drupal_get_http_header() function
  if (is_array($headers))  { $headers = implode($headers); }

  // wrap taxonomy listing pages in quotes and prefix with topic
  if (arg(0) == 'taxonomy' && arg(1) == 'term' && is_numeric(arg(2))) {
    $title = t('Topic') .' &#8220;'. $title .'&#8221;';
  }
  // if this is a 403 and they aren't logged in, tell them they need to log in
  else if (strpos($headers, 'HTTP/1.1 403 Forbidden') && !user_is_logged_in()) {
    $title = t('Please login to continue');
  }
  $vars['title'] = $title;

  if (!drupal_is_front_page()) {
    $vars['head_title'] = $title;
    if ($vars['site_slogan'] != '') {
      $vars['head_title'] .= ' &ndash; '. $vars['site_slogan'];
    }
  }
  
  $vars['scripts'] = drupal_get_js();
  
  // Skip all global_analytics for biossos
  if (variable_get('site_short_name', '') != 'biossos') {
    // Add global_analytics.tpl.php data
    if (!isset($vars['global_analytics']))  $vars['global_analytics'] ='';     // initiallize if not set
    $vars['global_analytics'] .= theme_render_template(path_to_theme() . '/global_analytics.tpl.php', array());
  
    if ($conf['omniture_account'] != '') {
      $vars['global_analytics'] = '
    <!-- Start Quantcast tag for Targeted ads /-->
    <script language="JavaScript" type="text/javascript" src="' . $conf['cdn_static2'] . base_path() . drupal_get_path('theme', 'aetn_base') . '/js/quantcast_d6.js"></script>
    <!-- End Quantcast tag for Targeted ads  /-->
    <!--  For Omniture -->
    <script language="JavaScript" type="text/javascript"><!--
      // var s_account="' . $conf['omniture_account'] . '";
      var omniture = omniture || {};  // Create omniture object if it does not exist
      omniture.s_account = "' . $conf['omniture_account'] . '"; //(account is populated from server settings)
      omniture.linkInternalFilters =  "' . $conf['omniture_internal_filters'] . '"; // "internal_link_filters_for_site"
      omniture.visitorMigrationServer  = "' . $conf['omniture_internal_filters'] . '"; // "your_migration_server"
      omniture.visitorMigrationServerSecure  = "' . $conf['omniture_migration_server'] . '"; // "your_secure_migration_server" 
    //--></script>
    <script language="JavaScript" type="text/javascript" src="' . $conf['cdn_static2'] . base_path() . drupal_get_path('theme', 'aetn_base') . '/js/omniture_aetn.js?2"></script>
    ' . $vars['global_analytics'];
    }
  }
}

function aetn_base_get_wrapper() {
  $template = '{var:content}'; 
  $template = _aetn_base_get_wrapper();
  
  return $template;
}

function _aetn_base_get_wrapper($url=NULL, $user=NULL) {
  $query = array();
  if ($url) {
    $query['url'] = $url;
  }
  if (isset($user) && $user->uid > 0) {
    $query['user'] = $user->name;
  } 
  $query = http_build_query($query);
  
  //get wrapper url
  $wrapper_list = variable_get('wrapper', array());
  $wrapper_url = $wrapper_list['default'];

  if (isset($user) && $user->uid > 0) { // we don't cache authenticated wrappers
    $response = drupal_http_request($wrapper_url . ($query? '?' . $query: ''));
    if ($response->data) {
      return $response->data;
    }
    else {
      watchdog('error', 'Failed to retrieve wrapper.');
    }
  } 
  elseif ($cache = cache_get('_aetn_base_get_wrapper:' . $query .'@' . $wrapper_url)) { // assert(0 == $user->uid);
    return $cache->data;
  } 
  else {
    $response = drupal_http_request($wrapper_url . ($query? '?' . $query: ''));
    if ($response->data) {
      cache_set('_aetn_base_get_wrapper:' . $query .'@' . $wrapper_url, $response->data, 'cache', time() + AETN_BASE_WRAPPER_TTL);
      return $response->data;
    } 
    else {
      watchdog('error', 'Failed to retrieve wrapper.');
    }
  }
  
  return FALSE;
}

function aetn_base_parse_template($template, $vars) {

  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$vars['content']: " .  print_r($vars['content'], 1));
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$template: " .  print_r($template, 1));

  return preg_replace('/{var:([\w_]+)}/e', 'array_key_exists(\'$1\', $vars)? $vars[\'$1\']: \'\';', $template);
}

/**
 * Intercept box template variables
 *
 * @param $vars
 *   A sequential array of variables passed to the theme function.
 */
function aetn_base_preprocess_box(&$vars) {
  // rename to more common text
  if (strpos($vars['title'], 'Post new comment') === 0) {
    $vars['title'] = 'Add your comment';
  }
}


/**
 * Override, make sure Drupal doesn't return empty <P>
 *
 * Return a themed help message.
 *
 * @return a string containing the helptext for the current page.
 */
function aetn_base_help() {
  $help = menu_get_active_help();
  // Drupal sometimes returns empty <p></p> so strip tags to check if empty
  if (strlen(strip_tags($help)) > 1) {
    return '<div class="help">'. $help .'</div>';
  }
}


/**
 * Override, use a better default breadcrumb separator.
 *
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 * @return a string containing the breadcrumb output.
 */
function aetn_base_breadcrumb($breadcrumb) {
  if (count($breadcrumb) > 1) {
    $breadcrumb[] = drupal_get_title();
    return '<div class="breadcrumb">'. implode(' &rsaquo; ', $breadcrumb) .'</div>';
  }
}


/**
 * Rewrite of theme_form_element() to suppress ":" if the title ends with a punctuation mark.
 */
function aetn_base_form_element($variables) {
  $args = func_get_args();
  return preg_replace('@([.!?]):\s*(</label>)@i', '$1$2', call_user_func_array('theme_form_element', $args));
}


/**
 * Set status messages to use Blueprint CSS classes.
 * Let theme_status_messages() in theme.inc do its theming
 */
function aetn_base_xxxxxx_status_messages($variables) {

  $display = $variables['display'];
  $output = '';

  $status_heading = array(
    'status' => t('Status message'),
    'error' => t('Error message'),
    'warning' => t('Warning message'),
  );

  foreach (drupal_get_messages($display) as $type => $messages) {
    // blueprint can either call this success or notice
    if ($type == 'status') {
      $type = 'success';
    }
    $output .= "<div class=\"messages $type\">\n";
    if (count($messages) > 1) {
      $output .= " <ul>\n";
      foreach ($messages as $message) {
        $output .= '  <li>'. $message ."</li>\n";
      }
      $output .= " </ul>\n";
    }
    else {
      $output .= $messages[0];
    }
    $output .= "</div>\n";
  }
  return $output;
}


/**
 * Trim a post to a certain number of characters, removing all HTML.
 */
function blueprint_trim_text($text, $length = 150) {
  // remove any HTML or line breaks so these don't appear in the text
  $text = trim(str_replace(array("\n", "\r"), ' ', strip_tags($text)));
  $text = trim(substr($text, 0, $length));
  $lastchar = substr($text, -1, 1);
  // check to see if the last character in the title is a non-alphanumeric character, except for ? or !
  // if it is strip it off so you don't get strange looking titles
  if (preg_match('/[^0-9A-Za-z\!\?]/', $lastchar)) {
    $text = substr($text, 0, -1);
  }
  // ? and ! are ok to end a title with since they make sense
  if ($lastchar != '!' && $lastchar != '?') {
    $text .= '...';
  }
  if ($text == '...') {
    return '';
  }
  return $text;
}

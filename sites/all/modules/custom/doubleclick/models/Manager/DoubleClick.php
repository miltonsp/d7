<?php
// namespace Ad;
require_once dirname(dirname(__FILE__)) . '/Manager.php';

class Manager_DoubleClick extends Manager {
  protected $site = '';
  protected $zone1 = '';
  protected $zone2 = '';
  protected $s1 = '';
  protected $s2 = '';
  protected $pid = '';
  protected $kw = '';
  protected $game = '';
  protected $sweeps = '';
  protected $show = '';
  protected $movie = '';
  protected $ptype = '';
  protected $cat = '';
  protected $aetn = 'ad';
  protected $attributes = array();
  protected static $globalInstance = NULL;

  private $escaped_chars = '#"/*.,()=<>[];%&?';
  private $path_prefix_trim = array(
    'header/',
    'header_cache/',
    'masthead/',
    'masthead_cache/',
    'masthead/',
    'js/wrapper-tech.js/',
    'd6/wrapper/game-wrapper.php/',
    'd6/wrapper/',
  );
  private $validPtypes = array(
    'landing',
    'about',
    'video',
    'epguide',
    'photos', 'photos-album',
    'games',
    'meet',
    'sweeps', 'sweepslanding', 'sweepsentry', 'sweepsprizing', 'sweepsthankyou', 'sweepsregister',
    'sweepsrules', 'sweepsmatchgame',
    'exclusives',
    'quiz',
    'other',
    'music',
    'blog',
    'recipes', 'recipe-guide',
  );

  const BASE_SITE = 'ltv.myltv.';
  const TEST_BASE_SITE = 'test.myltv.';
  const CACHE_TTL = 300; // 5 minutes; unit in seconds

  // PUBLIC METHODS
  public function __construct($uri = NULL) {
    parent::__construct($uri);

    $url_parts = $this->_getUrlParts();
    foreach($url_parts as $k=>$v) {
      $this->{$k} = $v;
    }
  }

  public function register(Placement_DoubleClick $ad, $region = 'content') {
    if(!$ad->getSite())   $ad->setSite($this->site);
    if(!$ad->getZone1())  $ad->setZone1($this->zone1);
    if(!$ad->getZone2())  $ad->setZone2($this->zone2);
    if(!$ad->getS1())     $ad->setS1($this->s1);
    if(!$ad->getS2())     $ad->setS2($this->s2);
    if(!$ad->getPid())    $ad->setPid($this->pid);
    if(!$ad->getKw())     $ad->setKw($this->kw);
    if(!$ad->getGame())   $ad->setGame($this->game);
    if(!$ad->getSweeps()) $ad->setSweeps($this->sweeps);
    if(!$ad->getShow())   $ad->setShow($this->show);
    if(!$ad->getMovie())  $ad->setMovie($this->movie);
    if(!$ad->getPtype())  $ad->setPtype($this->ptype);
    if(!$ad->getCat())    $ad->setCat($this->cat);
    if(!$ad->getAetn())   $ad->setAetn($this->aetn);

    if($this->test)       $ad->setTest(true);
    if(!$ad->getPos())    $ad->setPos('top');
    $ad->setAttributes(array_merge($this->attributes, $ad->getAttributes()));

    return parent::register($ad, $region);
  }

  public function iframe($width, $height, $region = 'top') {
    $ad = Manager_DoubleClick::getInstance('IFrame');
    $ad->addDimension($width, $height);
    $ad->setRegion($region);

    return $this->register($ad, $region);
  }

  public function wallpaper($region = 'top') {
    $ad = Manager_DoubleClick::getInstance('Wallpaper');
    $ad->setRegion($region);

    return $this->register($ad, $region);
  }

  public function script($width, $height, $region = 'top') {
    $ad = Manager_DoubleClick::getInstance('Script');
    $ad->addDimension($width, $height);
    $ad->setRegion($region);

    return $this->register($ad, $region);
  }

  public function hybrid($width, $height, $region = 'top') {
    $ad = Manager_DoubleClick::getInstance('Hybrid');
    $ad->addDimension($width, $height);
    $ad->setRegion($region);

    return $this->register($ad, $region);
  }
  
  public function timedintervalhybrid($width, $height, $region = 'inside_frame') {
    $ad = Manager_DoubleClick::getInstance('TimedIntervalHybrid');
    $ad->addDimension($width, $height);
    $ad->setRegion($region);

    return $this->register($ad, $region);
  }
  

  public function multisize($width, $height, $region = 'top') {
    $ad = Manager_DoubleClick::getInstance('multisize');
    $ad->addDimension($width, $height);
    $ad->setRegion($region);

    return $this->register($ad, $region);
  }

  public function interstitial($width, $height, $region = 'top', $showSkipButtonAfter = 15, $hideAdAfter = 30){
    $ad = Manager_DoubleClick::getInstance('interstitial');
    $ad->addDimension($width, $height);
    $ad->setRegion($region);
    return $this->register($ad, $region);
  }
  
  public function brandedcanvas($width, $height, $region = 'top', $showSkipButtonAfter = 15, $hideAdAfter = 30){
      die('blah test');
  }

  public function getSite() { return $this->site; }
  public function setAetn($value) { return $this->aetn; } // aetn should ALWAYS be ad
  public function setZone1($value) { return $this->zone1 = $this->s1 = $value; }
  public function setZone2($value) { return $this->zone2 = $this->s2 = $value; }
  public function setS1($value) { return $this->s1 = $this->zone1 = $value; }
  public function setS2($value) { return $this->s2 = $this->zone2 = $value; }
  public function setPtype($value) {
    if('episodes' == $value) {
      $value = 'epguide';
    } elseif('cast' == $value) {
      $value = 'meet';
    } elseif(!in_array($value, $this->validPtypes)) {
      error_log('Invalid ptype: ' . $value);
      return '';
    }

    return $this->ptype = $value;
  }
  public function setAttributes($value) { return is_array($value)? $this->attributes = $value: $this->attributes; }

  public function getAttribute($key) { return $this->attributes[$key]; }
  public function setAttribute($key, $value) { return $this->attributes[$key] = $value; }

  public function getValidPtypes() {
    return $this->validPtypes;
  }

  public function serializeAttributes(array $attributes) {
    $return = '';
    foreach($attributes as $k=>$v) {
      if($return) $return .= ';';
      if(is_array($v)) {
        foreach($v as $v2) {
          if($return) $return .= ';';
          $return .= $k . '=' . $v2;
        }
      }
      else {
        $return .= $k . '=' . $v;
      }
    }

    return $return;
  }
  public function unserializeAttributes($attributes) {
    $return = array();
    if($attributes != '') {
      foreach(explode(';', $attributes) as $v) {
        $tmp = explode('=', $v, 2);
        if(isset($return[$tmp[0]])) {
          if(!is_array($return[$tmp[0]])) {
            $return[$tmp[0]] = array($return[$tmp[0]]);
          }
          $return[$tmp[0]][] = $tmp[1];
        } else {
          $return[$tmp[0]] = $tmp[1];
        }
      }
    }

    return $return;
  }

  public function getSimpleObject() {
    $obj = new stdClass();

    $obj->site   = $this->site;
    $obj->zone1  = $this->zone1;
    $obj->zone2  = $this->zone2;
    $obj->s1     = $this->s1;
    $obj->s2     = $this->s2;
    $obj->pid    = $this->pid;
    $obj->kw     = $this->kw;
    $obj->game   = $this->game;
    $obj->sweeps = $this->sweeps;
    $obj->show   = $this->show;
    $obj->movie  = $this->movie;
    $obj->ptype  = $this->ptype;
    $obj->cat    = $this->cat;
    $obj->aetn   = $this->aetn;
    $obj->attributes = $this->attributes;
    $obj->test   = $this->test;

    return $obj;
  }

  public function toJS() {
    return drupal_json_encode($this->getSimpleObject());
  }

  public static function getInstance($view = "") {
    $ad = parent::getInstance('DoubleClick');
    $ad->setView($view);
    return $ad;
  }

  /**
   *
   * @return Manager_DoubleClick
   */
  public static function singleton() {
    if(!self::$globalInstance) {
      // DoubleClickManager is url dependant
      $cache_key = 'doubleclick:DoubleClick::$globalInstance(' . $_SERVER['REQUEST_URI'] . ')';
      if(!isset($_GET['test']) && $cache = cache_get($cache_key, 'cache')) {
        self::$globalInstance = $cache->data;
      } else {
        self::$globalInstance = new self();
        cache_set($cache_key, self::$globalInstance, 'cache', time() + self::CACHE_TTL);
      }
    }

    return self::$globalInstance;
  }

  // PRIVATE METHODS
  private function _getUrlParts($uri = NULL) {
    $url_parts = parse_url($uri? $uri: $this->uri_raw);
    if(!$url_parts['host']) $url_parts['host'] = $_SERVER['HTTP_HOST'];

    parse_str($url_parts['query'], $url_parts['params']);
    $url_parts['site'] = 'other';

    if(isset($url_parts['params']['test']) && $url_parts['params']['test']) {
      $url_parts['test'] = TRUE;
    }

    $url_parts['path'] = $this->_trimPath($url_parts['path']); // normalize path (should I do strtolower?)

    if($url_parts['path'] == variable_get('homepage_path', '') ) {// home page
      $url_parts['path'] = '<front>';
      $url_parts['site'] = $url_parts['zone1'] = $url_parts['s1'] = 'home';

    } else if(($doubleclick_primary_navigation_id = variable_get('doubleclick_primary_navigation_id', $default)) > 0) {


      // $rs = db_query_slave('SELECT path, title FROM menu WHERE pid = %d ORDER BY LENGTH(path) ASC', $doubleclick_primary_navigation_id); // great canidate for cache
      // while($row = db_fetch_array($rs)) {

      $rs = db_query('SELECT path, title FROM menu
              WHERE pid = :pid
              ORDER BY LENGTH(path) ASC',
              array(':pid' => $doubleclick_primary_navigation_id),    
              array(
                'target' => 'slave',     // Use slave DB
                'fetch' => PDO::FETCH_ASSOC,  // Fetch as a associative array
              )
            );
      foreach ($rs as $row) {
        $mp = parse_url($row['path']); // unfortunately our content producers like putting absolue urls in there grrr
        $mp['path'] = trim($mp['path'], '/ ');
        if(strpos($url_parts['path'], $mp['path']) === 0) {
          $url_parts['site'] = preg_replace('/[^\w]+/', '-', strtolower($row['title']));
          if($url_parts['path'] == $mp['path']) { // not just starts but is exactly
            $url_parts['zone1'] = 'landing';
            break; // cann't get any closer than that
          }
        }
      }
    }

    if(preg_match('/^(local|dev|qa|stage)/i', $url_parts['host']))  { // a little redundant, but I want this function to work appart from the constructor
      $url_parts['site'] = self::TEST_BASE_SITE . $url_parts['site'];
    } else {
      $url_parts['site'] = self::BASE_SITE . $url_parts['site'];
    }
    $url_parts['pid'] = preg_replace('/['.preg_quote($this->escaped_chars, '/').']+/', '_', $url_parts['path']);

    // TODO: make a path_regex field that caches this regex version of the path so I don't have to do it on the fly
    $sql = '
      SELECT tsite
        ,tzone1
        ,tzone2
        ,ts1
        ,ts2
        ,tpid
        ,tkw
        ,tgame
        ,tsweeps
        ,tshow
        ,tmovie
        ,tptype
        ,tcat
        ,tattributes
      FROM {doubleclick_paths} dp
      INNER JOIN {doubleclick_tags} dt ON dp.doubleclick_tags_id = dt.id
      WHERE :match REGEXP CONCAT(\'^\', REPLACE(dp.path, \'*\', \'.*\'), \'$\')
      ORDER BY LENGTH(dp.path) ASC';

      // WHERE \'%s\' REGEXP CONCAT("^", REPLACE(dp.path, \'*\', \'.*\'), "$")


    // $rs = db_query_slave($sql, $url_parts['path']);
    // while($row = db_fetch_array($rs)) {

    $rs = db_query($sql,
              array(':match' => $url_parts['path']),    
              array(
                'target' => 'slave',     // Use slave DB
                'fetch' => PDO::FETCH_ASSOC,  // Fetch as a associative array
              )
            );
    foreach ($rs as $row) {
      $tags = array();
      foreach($row as $k=>$v) if($v) $tags[substr($k, 1)] = $v;
      $tags['attributes'] = $this->unserializeAttributes($tags['attributes']);
      $url_parts = array_merge($url_parts, $tags);
    }

    return $url_parts;
  }

  private function _trimPath($path) {
    $path = trim($path, ' /');

    // remove wrapper-tech urls
    if('d6/wrapper/game-wrapper.php' == $path && isset($_GET['url'])) { // I should be pulling this from an instance specific url_parts['params']
      $path = trim($_GET['url'], ' /');
    } else {
      foreach($this->path_prefix_trim as $v) {
        if(strpos($path, $v) === 0) {
          $path = substr($path, strlen($v));
          break;
        }
      }
    }

    return $path;
  }

  // MAGIC METHODS
  public function __toString() {
    return '
    <script type="text/javascript">
    /* <![CDATA[ */
		var doubleClickManager = ' . $this->toJS() . ';
    /* ]]> */
    </script>
    ';
  }

  // lazy man's way of faking some of the plumbing
  public function __call($name, $args) {
    $field = '';
    if(strpos($name, 'set') === 0) {
      $field = strtolower($name{3}) . substr($name, 4);
      if(isset($this->{$field})) {
        return $this->{$field} = count($args) > 1? $args: $args[0];
      }
    } else {
      if(strpos($name, 'get') === 0) {
        $field = strtolower($name{3}) . substr($name, 4);
        if(isset($this->{$field})) {
          return $this->{$field};
        }
      }
    }

    throw new Exception("Call to undefined method: $name");

    return NULL;
  }
}

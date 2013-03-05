<?php
// namespace Ad;
require_once dirname(dirname(__FILE__)) . '/Placement.php';

class Placement_DoubleClick extends Placement {
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
  protected $pos = 'top';
  protected $dimensions = array(); // array(array(width, height)) this will replace Placement::width and Placement::height
  
  public function __construct() {parent::__construct();}


  public function setWidth($value) { return $this->width; }
  public function setHeight($value) { return $this->height; }
  public function setZone1($value) { return $this->zone1 = $this->s1 = $value; }
  public function setZone2($value) { return $this->zone2 = $this->s2 = $value; }
  public function setS1($value) { return $this->s1 = $this->zone1 = $value; }
  public function setS2($value) { return $this->s2 = $this->zone2 = $value; }
  public function setAttributes($value) { return is_array($value)? $this->attributes = $value: $this->attributes; }
  public function setDimensions($value) {
    if(is_array($value)) {
      $this->width = 0;
      $this->height = 0;
      $this->dimensions = array();
      foreach($value as $d) {
        if(isset($d[0]) && isset($d[1])) {
          if($d[0] > $this->width) $this->width = $d[0];
          if($d[1] > $this->height) $this->height = $d[1];
          $this->dimensions[] = array($d[0], $d[1]);
        }
      }

      $this->dimensions = $value;
    }

    return $this->dimensions;
  }

  public function getAttribute($key) { return $this->attributes[$key]; }
  public function setAttribute($key, $value) { return $this->attributes[$key] = $value; }
  public function getDimension($key) { return $this->dimensions[$key]; }
  public function setDimension($key, $value) {
    $d = NULL;
    if(is_array($value) && isset($value[0]) && isset($value[1])) {
      if($value[0] > $this->width) $this->width = $value[0];
      if($value[1] > $this->height) $this->height = $value[1];
      $this->dimensions[] = $d = array($value[0], $value[1]);
    }

    return $d;
  }
  public function addDimension($width, $height) {
    if($width > $this->width) $this->width = $width;
    if($height > $this->height) $this->height = $height;

    $this->dimensions[] = array(intval($width), intval($height));

    return count($this->dimensions);
  }
  
  public function toJS() {
    return drupal_to_js($this->getSimpleObject());
  }
  
  public function getSimpleObject() {
    $obj = $this->manager->getSimpleObject(); // inherit from global manager

    // let ad overwrite anything
    if($this->site) $obj->site   = $this->site;
    if($this->zone1) $obj->zone1  = $this->zone1;
    if($this->zone2) $obj->zone2  = $this->zone2;
    if($this->s1) $obj->s1     = $this->s1;
    if($this->s2) $obj->s2     = $this->s2;
    if($this->pid) $obj->pid    = $this->pid;
    if($this->kw) $obj->kw     = $this->kw;
    if($this->game) $obj->game   = $this->game;
    if($this->sweeps) $obj->sweeps = $this->sweeps;
    if($this->show) $obj->show   = $this->show;
    if($this->movie) $obj->movie  = $this->movie;
    if($this->ptype) $obj->ptype  = $this->ptype;
    if($this->cat) $obj->cat    = $this->cat;
    if($this->aetn) $obj->aetn   = $this->aetn;
    $obj->attributes = array_merge($obj->attributes, $this->attributes);
    $obj->test   = $obj->test || $this->test;

    $obj->width  = $this->width;
    $obj->height = $this->height;
    $obj->dimensions = $this->dimensions;
    $obj->pos    = $this->pos;
    $obj->region = $this->region;
    
    return $obj;
  }
  
  public function __toString() {
    return $this->render();
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

<?php
// namespace Ad;
class Manager {
  protected $test = FALSE;
  protected $ads = array();
  protected $uri_raw = '';
  protected $uri_parts = array();
  
  public function __construct($uri = NULL) {
    $this->uri_raw = $uri? $uri: $_SERVER['REQUEST_URI'];

    // debug
    // error_log("From models/Manager.php (line 13):  \$this->uri_raw: " . print_r($this->uri_raw, 1));


    $this->uri_parts = parse_url($this->uri_raw);
    if(!$this->uri_parts['host']) {
      $this->uri_raw = 'http://' . ($this->uri_parts['host'] = $_SERVER['HTTP_HOST']) . '/' . $this->uri_raw;
    }

    // debug
    // error_log("From models/Manager.php (line 22):  \$this->uri_raw: " . print_r($this->uri_raw, 1));



    if(isset($this->uri_parts['params']['test']) && $this->uri_parts['params']['test'])  {
      $this->test = TRUE;
    }
  }
  
  public function register(Placement $ad, $region = 'content') {
    $ad->setManager($this);
    
    if(!$this->ads[$region]) $this->ads[$region] = array();
  
    $this->ads[$region][] = $ad;
    
    return $ad;
  }
  
  public function getTest() { return $this->test; }
  public function setTest($value) { return $this->test = ($value == TRUE); }
  
  public static function getInstance($class = "") {
    $class = 'Placement' . ($class? '_' . $class: '');
    
    $file_name = dirname(__FILE__) . '/' . str_replace('_', '/', $class) . '.php';
    if(!file_exists($file_name)) throw new Exception('Manager::factory(): file "' . $file_name . '" does not exist.'); 
    
    include_once $file_name;
    
    if(!class_exists($class)) throw new Exception('Manager::factory(): class "' . $class . '" does not exist.'); 
    
    return new $class();
  }
}

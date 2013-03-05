<?php
// namespace Ad;
class Placement {
  protected $manager = NULL;
  protected $width = 0;
  protected $height = 0;
  protected $region = 'content';
  protected $test = FALSE;

  protected $view = '';
  
  public function __construct() {}
  
  public function getWidth() { return $this->width; }
  public function setWidth($value) { return $this->width = intval($value); }

  public function getHeight() { return $this->height; }
  public function setHeight($value) { return $this->height = intval($value); }
  
  public function getRegion() { return $this->region; }
  public function setRegion($value) { return $this->region = trim($value); }

  public function getTest() { return $this->test; }
  public function setTest($value) { return $this->test = ($value == TRUE); }
  
  public function getManager() { return $this->manager; }
  public function setManager(Manager $value) { return $this->manager = $value; }

  public function getView() { return $this->view; }
  public function setView($value) { return $this->view = strtolower($value); }

  public function render($template_name=NULL) {
    if($template_name) $this->view = $template_name;

    require_once(dirname(__FILE__) . '/../views/View.php');
    
    return (string) new AdView($this, $this->view); // I went ahead and added "Ad" to the begining as I can't count on namespaces yet
  }
}

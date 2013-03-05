<?php
//namespace Ad;
class AdView {
  public $ad = NULL;

  protected $template_base = 'script';
  protected $template_dir = '../templates';
  protected $template_extension = 'phtml';

  public function __construct($ad, $template_base = NULL) {
    if($template_base) $this->template_base = $template_base;
    $this->ad = $ad;
  }

  public function serializeAttributes(array $attributes) {
    return Manager_DoubleClick::singleton()->serializeAttributes($attributes);
  }
  public function unserializeAttributes($attributes) {
    return Manager_DoubleClick::singleton()->unserializeAttributes($attributes);
  }
  public function render() {
    global $conf;
    $output = '';

    $template_path = dirname(__FILE__) . '/' . $this->template_dir . '/' . $this->template_base . '.' . $this->template_extension;
    if(file_exists($template_path)) {
      $ad = $this->ad->getSimpleObject();
      $ad->sz = '';
      foreach($ad->dimensions as $k=>$d) $ad->sz .= ($k>0?',':'').$d[0].'x'.$d[1];
      $ad->attributes = $this->serializeAttributes($ad->attributes);

      if ($ad->ptype != 'games') {
        $ad->test = $ad->test? 'on': '';
      } else {
        $ad->test = 'aetn.lib.ad.testLocation()';
      }

      extract((array) $ad);

      ob_start();
      include $template_path;
      $output = ob_get_contents();
      ob_end_clean();
    }

    return $output;
  }
  public function __toString() {
    return $this->render();
  }
}

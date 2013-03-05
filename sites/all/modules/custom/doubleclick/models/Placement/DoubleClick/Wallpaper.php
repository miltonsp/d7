<?php
// namespace Ad;
require_once dirname(dirname(__FILE__)) . '/DoubleClick.php';

class Placement_DoubleClick_Wallpaper extends Placement_DoubleClick {
  protected $pos = 'wall';
  protected $view = 'wallpaper';
}

<?php
 /**
  * This template is used to print a single field in a view. It is not
  * actually used in default Views, as this is registered as a theme
  * function which has better performance. For single overrides, the
  * template is perfectly okay.
  *
  * Variables available:
  * - $view: The view object
  * - $field: The field handler object that can process the input
  * - $row: The raw SQL result that can be used
  * - $output: The processed output that will normally be used.
  *
  * When fetching output from the $row, this construct should be used:
  * $data = $row->{$field->field_alias}
  *
  * The above will guarantee that you'll always get the correct data,
  * regardless of any changes in the aliasing that might happen if
  * the view is modified.
  */
?>
<?php

//debug
// print print_r(array_keys(get_defined_vars()), 1);
// print print_r($row, 1);
// print print_r($row->field_field_video_still_url[0]['raw']['uri'], 1);

// $video_still_url = $row->field_field_video_still_url[0]['raw']['uri'];
// replace public:/// with TBD  NEED TO UPDATE
// $video_still_url = preg_replace('|public://|', 'http://devd7.mylifetime.com/sites/default/files/', $video_still_url);

$video_still_url = file_create_url($row->field_field_video_still_url[0]['raw']['uri']);

$output_rendered = '';
$output_rendered .= <<<ENDOFTEXT
 <video width="320" height="240" controls="controls"
        poster="$video_still_url">
   <source src="$output"
      type="video/mp4" />
   Your browser does not support the video tag.
 </video>
ENDOFTEXT;


 print $output_rendered;
 
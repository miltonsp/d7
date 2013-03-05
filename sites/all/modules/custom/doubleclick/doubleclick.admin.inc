<?php
// $Id: doubleclick.admin.inc 130855 2012-02-17 16:07:56Z milton $

function doubleclick_create_ad($form, $form_state) {

//edit option
$d_count=1;
$collapsed = TRUE;
  $addTitle = t('Create an Ad');
  $dimensionWidth = 0;
  $dimensionHeight = 0;
  $submit = t('Save');
  
  if(is_numeric(arg(4)) && arg(5) == 'edit') {

	  // $result = db_query("SELECT * FROM {doubleclick_ads} WHERE id=%d",arg(3));
	  // $editAd = mysql_fetch_array($result);
	  // $result1 = db_query("SELECT * FROM {doubleclick_tags} WHERE id = %d",$editAd['doubleclick_tags_id']);
	  // $edit = mysql_fetch_array($result1);

	  $editAd = db_query("SELECT * FROM doubleclick_ads WHERE id=:id", array(':id' => arg(4)))->fetchAssoc();
	  $edit   = db_query("SELECT * FROM doubleclick_tags WHERE id=:id", array(':id' => $editAd['doubleclick_tags_id']))->fetchAssoc();

	  $collapsed = FALSE;
	  $addTitle = t('Edit an Ad');
	  $edit['type'] = $editAd['type'];
	  $edit['name'] = $editAd['name'];
	  $edit['pos'] = $editAd['pos'];	  
	  $edit['frequency'] = $editAd['frequency'];	  
	  $edit['timing'] = $editAd['timing'];	  
	  $dimensions = unserialize($editAd['dimensions']);

          // debug
          // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$dimensions: " .  print_r($dimensions, 1));


	  $d_count=count($dimensions);
	
	
	  $submit = t('Update');
  }
  variable_set('dim_count',$d_count);
  //edit option end
	
  $arr_fields = array(
    '#cache' => TRUE,
  );
  $fields = _doubleclick_default_tags();
  $headers = array();

  $form['add'] = array(
    '#type'   => 'fieldset',
    '#title'  =>  $addTitle,
    '#weight' => 1,
    '#collapsible' => TRUE,
    '#collapsed'   => $collapsed,
  );
  $form['add']['type'] = array(
    '#type'   => 'select',
    '#title'  => t('Type of Ad'),
    '#default_value'  => $edit['type'],
    '#options'=> array('Script'=>'Script','IFrame'=>'IFrame','Wallpaper'=>'Wallpaper','Hybrid'=>'Hybrid', 'Multisize'=>'Multisize', 'Interstitial'=>'Interstitial', 'TimedIntervalHybrid'=>'TimedIntervalHybrid', 'BrandedCanvas' => 'BrandedCanvas'),
  );
  $headers[] = array('data'=> 'Type', 'field'=> 'type');
  $form['add']['name'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Name'),
	'#default_value'  => $editAd['name'],
  );
  $headers[] = array('data'=> 'Name', 'field'=> 'name');
  $dimensions_count = isset($form_state['values']['dimensions'])? count($form_state['values']['dimensions']) + 1: 1;

  // debug
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$dimensions: " .  print_r($dimensions, 1));
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$dimensions_count: " .  print_r($dimensions_count, 1));

  $form['add']['dimensions_wrapper'] = array(
    '#tree'   => FALSE,
    '#prefix' => '<div id="dimensions-wrapper">',
    '#suffix' => '</div>',
  );
  $form['add']['dimensions_wrapper']['dimensions'] = array(
    '#prefix' => '<div id="dimensions-fields-wrapper">',
    '#suffix' => '</div>',
    '#theme'   => 'dimensions_form',
  );
  for($i=0; $i<$d_count; $i++) {
  
    $w = isset($form_state['values']['dimensions'][$i]['width'])? $form_state['values']['dimensions'][$i]['width']: 0;
    $h = isset($form_state['values']['dimensions'][$i]['height'])? $form_state['values']['dimensions'][$i]['height']: 0;
	  if($dimensions[$i][0]) {
		$w = $dimensions[$i][0];
	  }
	  if($dimensions[$i][1]) {
		$h = $dimensions[$i][1];
	  }	 
    $form['add']['dimensions_wrapper']['dimensions'][$i] = _doubleclick_dimension_form($i, $w, $h);
  }
  
  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form['add']['dimensions_wrapper']['dimensions']: " .  print_r($form['add']['dimensions_wrapper']['dimensions'], 1));

  
  $form['add']['dimensions_wrapper']['dimensions_more'] = array(
    '#type' => 'submit',
    '#value' => t('More Dimensions'),
    '#weight' => 1,
    '#submit' => array('doubleclick_more_dimensions_submit'), // If no javascript action.
    '#ahah' => array(
      'path' => 'admin/settings/js',
      'wrapper' => 'dimensions-fields-wrapper',
      'method' => 'append',
      'effect' => 'fade',
	  'disabled'=>'TRUE',
    ),
  );
  $headers[] = array('data'=> 'Dimensions', 'field'=> 'dimensions');
  $form['add']['pos'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Pos'),
	'#default_value'  => $edit['pos'],
  );
  $headers[] = array('data'=> 'Pos', 'field'=> 'pos');

  $form['add']['frequency'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Frequency'),
	'#default_value'  => ($edit['frequency']) ? $edit['frequency'] : 10,
  );

  $form['add']['timing'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Timing'),
	'#default_value'  => ($edit['timing']) ? $edit['timing'] : 10,
  );
  
  $form['add']['tags'] = array(
    '#type'   => 'fieldset',
    '#title'  => t('Adjust Ad Tags'),
    '#weight' => 4,
    '#collapsible' => TRUE,
    '#collapsed'   => $collapsed,
  );
  $form['add']['tags']['additional'] = array(
    '#type'   => 'fieldset',
    '#title'  => t('Additional Tags'),
    '#weight' => 7,
    '#collapsible' => TRUE,
    '#collapsed'   => $collapsed,
  );
  $container =& $form['add']['tags'];
  foreach($fields as $k=>$v) {
    if($k == 6) $container =& $form['add']['tags']['additional'];

    $container[$v] = array(
      '#type'           => 'textfield',
      '#title'          => t(ucwords($v)),
      '#default_value'  => isset($edit['t'.$v]) ? $edit['t'.$v] : '',
    );

    if($k == 1 || $k == 3) $container[$v]['#prefix'] = '<div class="left-col" style="width: 50%; float: left;">';
    elseif($k == 2 || $k == 4) $container[$v]['#suffix'] = '</div>';

    $headers[] = array('data'=> $container[$v]['#title'], 'field'=> 't' . $v);
  }

  $form['add']['tags']['additional']['ptype']['#type'] = 'select';
  $form['add']['tags']['additional']['ptype']['#options'] = array_merge(array(''=> '<none>'), array_combine(Manager_DoubleClick::singleton()->getValidPtypes(), Manager_DoubleClick::singleton()->getValidPtypes()));
  $form['add']['tags']['additional']['attributes']['#description'] = t('Attributes are custom key/value tags that are put directly into the ad call.  Attributes should be formated as "key=value" or for multiple key/values "key1=value1;key2=value2".');

  $form['add']['delete_id'] = array(
    '#type' => 'hidden',
  );
 $form['add']['tag_id'] = array(
    '#type' => 'hidden',
	'#value' => $editAd['doubleclick_tags_id'],
  );
  $form['add']['ad_id'] = array(
    '#type' => 'hidden',
    '#value' => arg(4),
  );
  $form['add']['save'] = array(
    '#type'   => 'submit',
    '#value'  => $submit,
  );


  // TODO: I should wrap this in a theme function to get it out of the form function
  $headers[0]['sort'] = 'asc';
  $headers[] = array('data'=> t('Action'));
  $rows = array();
  $attributes = array('class'=>'doubleclick-tags');
  $caption = t('Existing DoubleClick Ads');

  $records_per_page = isset($_REQUEST['per_page'])? $_REQUEST['per_page']: 25;
  $order = 'name';$headers[1]['sort'] = TRUE;
  if($_REQUEST['order']) foreach($headers as $header) if($_REQUEST['order'] == $header['data']) $order = $header['field'];
  $sort = isset($_REQUEST['sort'])? strtoupper($_REQUEST['sort']): 'ASC';

  $sql = 'SELECT da.id, da.type, da.name, da.dimensions, da.pos, t' . implode(', t', $fields) . '
          FROM {doubleclick_ads} da
          LEFT JOIN {doubleclick_tags} dt ON da.doubleclick_tags_id = dt.id
          ORDER BY ' . $order . ' ' . $sort;

          // ORDER BY ' . db_escape_string($order) . ' ' . db_escape_string($sort);

  // $rs = pager_query($sql, $records_per_page);
  
  // TODO:  Need the equivalent of pager_query() fro D7
  $rs = db_query($sql,
              array(),    // No placeholders
              array(
                // 'target' => 'slave',       // Use slave DB
                'fetch' => PDO::FETCH_ASSOC,  // Fetch as a associative array
              )
            );

  $query = '';
  if($_GET['page'] && $_GET['qa']) {
       $query = 'page='.$_GET['page'].'&qa='.$_GET['qa'];
	}else if($_GET['page'] && !$_GET['qa']) {
	  $query = 'page='.$_GET['page'];
	}else if($_GET['qa']){
	  $query = 'qa='.$_GET['qa'];	
	}
  // while($row = db_fetch_array($rs)) {
  foreach ($rs as $row) {
    $row['Action'] =l('[ Edit ]','admin/config/services/doubleclick/'.$row['id'].'/edit',array(),$query). '<a class="dc-override-delete" href="javascript:void(0);" onclick="dc_ad_delete(' . $row['id'] . ');">[delete]</a>';
    $row['dimensions'] = unserialize($row['dimensions']);
    foreach($row['dimensions'] as $k=>$d) $row['dimensions'][$k] = $d[0] . 'x' . $d[1];
    $row['dimensions'] = implode(',', $row['dimensions']);
    unset($row['id']);
    $rows[] = $row; // TODO: I should do escaping here
  }

  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$row['dimensions']: " .  print_r($row['dimensions'], 1));

  // TODO: I should require js to delete
  drupal_add_js('
    function dc_ad_delete(id) {
      if(confirm(\'Are you sure you want to delete this ad?\')){
        if(id > 0) {
          // $(\'#edit-delete-id\').val(id).parents(\'form\').find(\'#edit-save\').click();
          jQuery(":input[name=\'delete_id\']").val(id).parents(\'form\').find(\'#edit-save\').click();
        }
      }
    }
  ', 'inline');
  
  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$rows: " .  print_r($rows, 1));
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$headers: " .  print_r($headers, 1));

  pager_default_initialize(25, $records_per_page);

  $variables['tags'] = array();
  $variables['quantity'] = 1;   //$records_per_page;
  $form['grid'] = array(
    '#markup'  => 
       // theme('table', array('header' => $headers, 'rows' => $rows, 'attributes' => $attributes, 'caption' => $caption)) .
       // theme('pager', $variables),

       theme('table', array('header' => $headers, 'rows' => $rows, 'attributes' => '', 'caption' => $caption)) .
       theme('pager', $variables),
       
    '#weight' => 2,
  );

  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form['grid']: " .  print_r($form['grid'], 1));

  return $form;
}
function _doubleclick_dimension_form($delta, $width, $height) {
  $form = array(
    '#tree'=> TRUE,
  );
  $form['width'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Width'),
    '#default_value'  => $width,
    '#prefix' => '<div class="left-col" style="width: 50%; float: left;">',
    '#suffix' => '</div>',
    '#parents' => array('dimensions', $delta, 'width'),
  );
  $form['height'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Height'),
    '#default_value'  => $height,
    '#prefix' => '<div class="left-col" style="width: 50%; float: left;">',
    '#suffix' => '</div>',
    '#parents' => array('dimensions', $delta, 'height'),
  );

  return $form;
}
function theme_dimensions_form() {
  // Change the button title to reflect the behavior when using JavaScript.
  drupal_add_js('if (Drupal.jsEnabled) { $(document).ready(function() { $("#edit-dimensions-more").val("'. t('Add another dimension') .'"); }); }', 'inline');
  // no special rendering
  $output = drupal_render($form);
  return $output;
}
function doubleclick_more_dimensions_submit($form, &$form_state) {
  // Set the form to rebuild and run submit handlers.
  // Unset any button-level handlers, execute all the form-level submit
  // functions to process the form values into an updated node.
  unset($form_state['submit_handlers']);
  $form_state['rebuild'] = TRUE;
}
function doubleclick_dimensions_js() {
$dcount=variable_get('dim_count','');
$clickcount=variable_get('cdim_count','');
if(!isset($clickcount))
{
variable_set('cdim_count','1');
}
else
{
$clickcount=$clickcount+1;
variable_set('cdim_count',$clickcount);
}
$clickcount=variable_get('cdim_count','');
if($dcount>$clickcount)
{
$clickcount=$dcount;
}
$form_state = array('storage' => NULL, 'submitted' => FALSE, 'rebuild' => TRUE);
$form_build_id = $_POST['form_build_id'];
$form = form_get_cache($form_build_id, $form_state);
$args = $form['#parameters'];
$form_id = array_shift($args);
$form_state['post'] = $form['#post'] = $_POST;
$form['#programmed'] = $form['#redirect'] = FALSE;
 
// Skip validation in project issue.
$form_state['doubleclick-create-ad'] = TRUE;
drupal_process_form($form_id, $form, $form_state);

 
  $output = drupal_render();
$output='<div style="width: 50%; float: left;" class="left-col"><div id="edit-dimensions-'.$clickcount.'-width-wrapper" class="form-item">
 <label for="edit-dimensions-'.$clickcount.'-width">Width: </label>
 <input type="text" class="form-text" value="0" size="60" id="edit-dimensions-'.$clickcount.'-width" name="dimensions['.$dcount.'][width]" maxlength="128">
</div>
</div><div style="width: 50%; float: left;" class="left-col"><div id="edit-dimensions-'.$clickcount.'-height-wrapper" class="form-item">
 <label for="edit-dimensions-'.$clickcount.'-height">Height: </label>
 <input type="text" class="form-text" value="0" size="60" id="edit-dimensions-'.$clickcount.'-height" name="dimensions['.$clickcount.'][height]" maxlength="128">
</div>
</div>
';
  drupal_json_output(array('status' => TRUE, 'data' => $output));
}
function doubleclick_create_ad_validate($form, &$form_state) {
  $form_values = $form_state['values'];
  // validations?
}
function doubleclick_create_ad_submit($form, &$form_state) 
{
  $form_values = $form_state['values'];

  // handle deletions
  if($form_values['delete_id'] > 0) 
  {

    // if($tag_id = db_result(db_query("SELECT doubleclick_tags_id FROM {doubleclick_ads} WHERE id = %d", $form_values['delete_id']))) 
    if ($tag_id = db_query("SELECT doubleclick_tags_id FROM {doubleclick_ads} WHERE id = :id",
            array( ':id' => $form_values['delete_id']))
            ->fetchColumn())
    {
      _doubleclick_delete_tag($tag_id);
    }
    // db_query('DELETE FROM {doubleclick_ads} WHERE id = %d', $form_values['delete_id']);
    db_delete('doubleclick_ads')
      ->condition('id', $form_values['delete_id'])
      ->execute();

    drupal_set_message(t('The ad has been deleted.'));
    return ;
  }

  $ad_args = array();
  $tag_args = array();
  // normalize data
  $ad_args['type'] = trim($form_values['type']);
  if($form_values['name']) {
    $ad_args['name'] = trim($form_values['name']);
  } else {
    $ad_args['name'] = '';

    // debug
    // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form_state['values']['dimensions']: " .  print_r($form_state['values']['dimensions'], 1));


    foreach($form_state['values']['dimensions'] as $v) {
      if($ad_args['name']) $ad_args['name'] .= ',';
      $ad_args['name'] = intval($v['width']) . 'x' . intval($v['height']);
    }
    $ad_args['name'] .= ' ' . $ad_args['type'] . ' Ad';
  }
  $ad_args['dimensions'] = array();
 
  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form_state['values']['dimensions']: " .  print_r($form_state['values']['dimensions'], 1));
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form_state: " .  print_r($form_state, 1));


  foreach($form_state['values']['dimensions'] as $v) {
    $ad_args['dimensions'][] = array(intval($v['width']), intval($v['height']));
  }



  $ad_args['dimensions'] = serialize($ad_args['dimensions']);
  $ad_args['pos'] = trim($form_values['pos']);
  $ad_args['frequency'] = trim($form_values['frequency']);
  $ad_args['timing'] = trim($form_values['timing']);
  
  foreach(_doubleclick_default_tags() as $k=>$v) {
    if(trim($form_values[$v])) $tag_args[$v]  = trim($form_values[$v]);
  }
  
  $insert_tags = FALSE;
  foreach($tag_args as $v) {
    if($v) {
      $insert_tags = TRUE;
      break;
    }
  }
     if($insert_tags) {
    $ad_args['doubleclick_tags_id'] = _doubleclick_save_tag($tag_args);
  } else {
    $ad_args['doubleclick_tags_id'] = 0;
  }
  //edit option
	if($form_values['ad_id']) 
	{

	  $arr_fields = array_values(array_merge($ad_args,array('id'=> $form_values['ad_id'])));

          // debug
          error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form_values['ad_id']: " .  print_r($form_values['ad_id'], 1));
          error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$arr_fields: " .  print_r($arr_fields, 1));


	  
	  // db_query("UPDATE {doubleclick_ads} SET type='%s', name = '%s', dimensions = '%s', pos = '%s', frequency = '%s', timing = '%s', doubleclick_tags_id = '%d' WHERE id = %d", array_values(array_merge($ad_args,array('id'=> $form_values['ad_id']))));
	  $num_updated = db_update('doubleclick_ads') 
	  ->fields(array(
	    'type' 	 => $arr_fields[0],
	    'name' 	 => $arr_fields[1],
	    'dimensions' => $arr_fields[2],
	    'pos' 	 => $arr_fields[3],
	    'frequency'  => $arr_fields[4],
	    'timing' 	 => $arr_fields[5],
	    'doubleclick_tags_id' => $arr_fields[6],
  	  ))
  	  ->condition('id', $arr_fields[7])
  	  ->execute();

	  drupal_set_message('<em>ad</em> ' . t('Has been Updated.'));
  
		}
	else 
		{

	  // $id = db_result(db_query(" select max(id) from doubleclick_ads"));
	  $id = db_query("select max(id) from doubleclick_ads")->fetchColumn();
	  
	  $id = $id+1;
	  $arr_fields = array_values(array_merge(array('id'=> $id), $ad_args));

          // debug
          error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$arr_fields: " .  print_r($arr_fields, 1));

	  
 	  // db_query("INSERT INTO {doubleclick_ads} (id, type, name, dimensions, pos, frequency, timing, doubleclick_tags_id) VALUES(%d, '%s', '%s', '%s', '%s','%s', '%s', %d)", array_values(array_merge(array('id'=> $id), $ad_args)));
          db_insert('doubleclick_ads') 
	  ->fields(array(
	    'id'        => $arr_fields[0],
	    'type' 	=> $arr_fields[1],
	    'name' 	=> $arr_fields[2],
	    'dimensions' => $arr_fields[3],
	    'pos' 	=> $arr_fields[4],
	    'frequency' => $arr_fields[5],
	    'timing' 	=> $arr_fields[6],
	    'doubleclick_tags_id' => $arr_fields[7],
  	  ))
          ->execute();

	  drupal_set_message('<em>ad</em> ' . t('has been created.'));
		}
		
  if($_GET['page'] || $_GET['qa']) 
  {
		if($_GET['page'] && $_GET['qa'])
		{
		   $query = 'page='.$_GET['page'].'&qa='.$_GET['qa'];
		}
		else if($_GET['page'] && !$_GET['qa']) 
		{
			$query = 'page='.$_GET['page'];
		}
		else if($_GET['qa'])
		{
		$query = 'qa='.$_GET['qa'];	
		}
		drupal_goto('admin/config/services/doubleclick', array('query' => $query));
  }
  else 
  {
	drupal_goto('admin/config/services/doubleclick');
  }
 
  if($insert_tags) {
    $ad_args['doubleclick_tags_id'] = _doubleclick_save_tag($tag_args);
  } else {
    $ad_args['doubleclick_tags_id'] = 0;
  }

  // debug
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$ad_args: " .  print_r($ad_args, 1));


  drupal_write_record('doubleclick_ads', $ad_args);
  drupal_set_message('<em>ad</em> ' . t('has been created.'));
}

function doubleclick_create_path($form, $form_state) {

 
  $form = array();
  
  $fields = _doubleclick_default_tags();
  $headers = array();
  //tag url edit option
  $collapsed = TRUE;
  $addTitle=t('Add a DoubleClick Tag Definition');
  if(is_numeric(arg(5)) && arg(6) == 'edit') 
  {
	  // $result = db_query("SELECT * FROM {doubleclick_paths} WHERE id=%d",arg(5));
	  // $editAd = mysql_fetch_array($result);
          //$result1 = db_query("SELECT * FROM {doubleclick_tags} WHERE id = %d",$editAd['doubleclick_tags_id']);
          // $edit = mysql_fetch_array($result1);

	  $editAd = db_query("SELECT * FROM doubleclick_paths WHERE id=:id", array(':id' => arg(5)))->fetchAssoc();
	  $edit   = db_query("SELECT * FROM doubleclick_tags WHERE id=:id", array(':id' => $editAd['doubleclick_tags_id']))->fetchAssoc();
	  
	  $collapsed = FALSE;
	  $addTitle = t('Edit a DoubleClick Tag Definition');
	  $edit['path'] = $editAd['path'];	  
	  $submit = t('Update');
  }

  // debug
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$editAd: " .  print_r($editAd, 1));


  $form['add'] = array(
    '#type'   => 'fieldset',
    '#title'  => $addTitle,
    '#weight' => 1,
    '#collapsible' => TRUE,
    '#collapsed'   => $collapsed,
  );
  $form['add']['additional'] = array(
    '#type'   => 'fieldset',
    '#title'  => t('Additional Tags'),
    '#weight' => 7,
    '#collapsible' => TRUE,
    '#collapsed'   => $collapsed,
  );
  $container =& $form['add'];
  $container['path'] = array(
    '#type'           => 'textfield',
    '#title'          => t('Path'),
    '#default_value'  => $edit['path'],
    '#description'    => t('The path, or path root, that the following ad tags will be applied to.  You can specify an asterisk ( * ) as a wild card.  Example: path/to/page  or  root/path/*'),
    //'#required'       => TRUE,  // I can't make this required because we are also using this for for delete.  alas my laziness knows no bounds.
  );
  $headers[] = array('data'=> $container['path']['#title'], 'field'=> 'path');
  foreach($fields as $k=>$v) {
    if($k == 6) $container =& $form['add']['additional'];

    $container[$v] = array(
      '#type'           => 'textfield',
      '#title'          => t(ucwords($v)),
	   '#default_value'  => $edit['t'.$v],
    );

    if($k == 1 || $k == 3) $container[$v]['#prefix'] = '<div class="left-col" style="width: 50%; float: left;">';
    elseif($k == 2 || $k == 4) $container[$v]['#suffix'] = '</div>';

    $headers[] = array('data'=> $container[$v]['#title'], 'field'=> 't' . $v);
  }

  $form['add']['additional']['ptype']['#type'] = 'select';
  $form['add']['additional']['ptype']['#options'] = array_merge(array(''=> '<none>'), array_combine(Manager_DoubleClick::singleton()->getValidPtypes(), Manager_DoubleClick::singleton()->getValidPtypes()));
  $form['add']['additional']['attributes']['#description'] = t('Attributes are custom key/value tags that are put directly into the ad call.  Attributes should be formated as "key=value" or for multiple key/values "key1=value1;key2=value2".');

  $form['add']['delete_id'] = array(
    '#type' => 'hidden',
  );

  $form['add']['save'] = array(
    '#type'   => 'submit',
    '#value'  => t('Save'),
  );

  // debug
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$editAd: " .  print_r($editAd, 1));


  // TODO: I should wrap this in a theme function to get it out of the form function
  $headers[0]['sort'] = 'asc';
  $headers[] = array('data'=> t('Action'));
  $rows = array();
  $attributes = array('class'=>'doubleclick-tags');
  $caption = t('Existing DoubleClick Tag Definitions');

  $records_per_page = isset($_REQUEST['per_page'])? $_REQUEST['per_page']: 25;
  $order = 'path';
  if($_REQUEST['order']) foreach($headers as $header) if($_REQUEST['order'] == $header['data']) $order = $header['field'];
  $sort = isset($_REQUEST['sort'])? strtoupper($_REQUEST['sort']): 'ASC';

  $sql = 'SELECT dp.id, dp.path, t' . implode(', t', $fields) . '
          FROM doubleclick_paths dp
          INNER JOIN doubleclick_tags dt ON dp.doubleclick_tags_id = dt.id
          ORDER BY ' . $order . ' ' . $sort;
  
  
  // $rs = pager_query($sql, $records_per_page);
  $rs = db_query($sql,
              array(),    // No placeholders
              array(
                // 'target' => 'slave',       // Use slave DB
                'fetch' => PDO::FETCH_ASSOC,  // Fetch as a associative array
              )
            );

  $query = '';  
  if($_GET['page'] && $_GET['qa']) {
       $query = 'page='.$_GET['page'].'&qa='.$_GET['qa'];
	}else if($_GET['page'] && !$_GET['qa']) {
	  $query = 'page='.$_GET['page'];
	}else if($_GET['qa']){
	  $query = 'qa='.$_GET['qa'];	
	}

  // while($row = db_fetch_array($rs)) {
  foreach ($rs as $row) {
    $row['Action'] = l('[ Edit ]','admin/config/services/doubleclick/paths/'.$row['id'].'/edit',array(),$query).'<a class="dc-override-delete" href="javascript:void(0);" onclick="dc_tag_delete(' . $row['id'] . ');">[delete]</a>';
    unset($row['id']);
    $rows[] = $row; // TODO: I should do escaping here
  }
  // TODO: I should require js to delete
  drupal_add_js('
    function dc_tag_delete(id) {
      if(confirm(\'Are you sure you want to delete this tag definition?\')){
      
        if(id > 0) {
          // jQuery(\'#doubleclick-create-path\').val(id).parents(\'form\').find(\'#edit-save\').click();
          // $(\'#edit-delete-id\').val(id).parents(\'form\').find(\'#edit-save\').click();
          // $("input[name=\'delete_id\']").val(id).parents(\'form\').find(\'#edit-save\').click();
          jQuery(":input[name=\'delete_id\']").val(id).parents(\'form\').find(\'#edit-save\').click();
       
          // var inp1 = jQuery("input[name^=\'delete_\']").val(id);
          // var inp2 = inp1.parents(\'form\').find(\'#edit-save\').css("background-color","green");
          // inp2.click();
        }
      }
    }
  ', 'inline');


  pager_default_initialize(25, $records_per_page);
  
  $variables['tags'] = array();
  $variables['quantity'] = 1;   //$records_per_page;

  $form['grid'] = array(
    // '#markup'  => theme('pager', array(), $records_per_page) . theme('table', $headers, $rows, $attributes, $caption) . theme('pager', array(), $records_per_page),
    '#markup'  => 
       // theme('table', array('header' => $headers, 'rows' => $rows, 'attributes' => $attributes, 'caption' => $caption)) .
       // theme('pager', $variables),

       theme('table', array('header' => $headers, 'rows' => $rows, 'attributes' => '', 'caption' => $caption)) .
       theme('pager', $variables),              

    '#weight' => 2,
  );

  return $form;
}

/**
 *
 */
function doubleclick_create_path_validate($form, &$form_state) {

  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form: " .  print_r($form, 1));


  $form_values = $form_state['values'];
  if(!($form_values['delete_id'] > 0)) { // not deleting
    if(!$form_values['path']) {
      form_set_error('path', t('Path field is required.'));
    } else {
      $tag_value_set = FALSE;
      foreach(_doubleclick_default_tags() as $k) {
        if(isset($form_values[$k]) && $form_values[$k]) {
          $tag_value_set = TRUE;
          break;
        }
      }
      if(!$tag_value_set) {
        form_set_error('site', t('You forgot to any tags.'));
      }
    }
  }
  
  // debug
  // error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form: " .  print_r($form, 1));
  
}

/**
 *
 */
function doubleclick_create_path_submit($form, &$form_state) {

  // debug
  error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$form_values['delete_id']: " .  print_r($form_values['delete_id'], 1));

  $form_values = $form_state['values'];
  // handle deletions
  if($form_values['delete_id'] > 0) {
  
    //     if($tag_id = db_result(db_query("SELECT doubleclick_tags_id FROM {doubleclick_paths} WHERE id = %d", $form_values['delete_id']))) {
    if ($tag_id = db_query("SELECT doubleclick_tags_id FROM doubleclick_paths WHERE id = :id",
       array(':id' => $form_values['delete_id']))
                   ->fetchColumn())
    {
       _doubleclick_delete_tag($tag_id);
    }

    // db_query('DELETE FROM {doubleclick_paths} WHERE id = %d', $form_values['delete_id']);
    db_delete('doubleclick_paths')
      ->condition('id', $form_values['delete_id'])
      ->execute();
    
    drupal_set_message(t('The tag definition has been deleted.'));
    return;
  }

  $path_args = array();
  $tag_args = array();

  // normalize data
  $path_args['path']       = trim($form_values['path'], ' /');
  foreach(_doubleclick_default_tags() as $k=>$v) {
    $tag_args[$v]  = trim($form_values[$v]);
  }

  // if($path_row = db_fetch_array(db_query("SELECT id, doubleclick_tags_id FROM {doubleclick_paths} WHERE path = '%s'", $path_args['path']))) {
  if ($path_row = db_query("SELECT id, doubleclick_tags_id FROM doubleclick_paths WHERE path = :path",
            array( ':path' => $path_args['path']))
            ->fetchAssoc())  
  {
    if($path_row['doubleclick_tags_id'] > 0) $tag_args['id'] = $path_row['doubleclick_tags_id'];
    $path_args['doubleclick_tags_id'] = _doubleclick_save_tag($tag_args);
    $path_args['id'] = $path_row['id'];

    // debug
    error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$path_args: " .  print_r($path_args, 1));

    drupal_write_record('doubleclick_paths', $path_args, 'id');
    drupal_set_message('<em>' . $form_values['path'] . '</em> ' . t('has been updated.')); // I should escape $form_values['path'];
  } else {
    $path_args['doubleclick_tags_id'] = _doubleclick_save_tag($tag_args);

    // debug
    error_log("From " . basename(__FILE__). " line " .__LINE__. ":  \$path_args: " .  print_r($path_args, 1));

    drupal_write_record('doubleclick_paths', $path_args);
    drupal_set_message('<em>' . $form_values['path'] . '</em> ' . t('has been added to the tag definitions.'));
  }
}

// I should redirect the saving of paths and ads as well
function _doubleclick_save_tag(&$tags) {
  $args = array();
  foreach($tags as $k=>$v) {
    if($k == 'id') {// not namespaced
      $args[$k] = $v;
    } else {
      $args['t' . $k] = $v;
    }
  }
  if(isset($args['id']) && $args['id'] > 0) {
    drupal_write_record('doubleclick_tags', $args, 'id');
  } else {
    drupal_write_record('doubleclick_tags', $args);
  }
  return $tags['id'] = $args['id'];
}

function _doubleclick_delete_tag($id) {
  // return db_query('DELETE FROM {doubleclick_tags} WHERE id = %d', $id);
  return  db_delete('doubleclick_tags')
      ->condition('id', $id)
      ->execute();
}

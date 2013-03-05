<?php
/*
 * ppl_feeds_feed_admin() function
 * Setup feeds via admin interface
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * 
 * @return  Form
 */
function ppl_feeds_feed_admin() {
  $settings = ppl_feeds_get_settings();
		
  $form = array(
    '#submit' => array('ppl_feeds_feed_admin_submit'),
  );
  
  $form['feeds_schedule_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Schedule URL'),
    '#default_value' => $settings['feed']['schedule']['url'],
    '#size' => 128,
    '#maxlength' => 255,
    '#required' => TRUE,
    '#description' => t('Feed Schedule URL'),
  );
  
  $form['feeds_schedule_call'] = array(
    '#type' => 'textfield',
    '#title' => t('Schedule Call'),
    '#default_value' => $settings['feed']['schedule']['call'],
    '#size' => 25,
    '#maxlength' => 50,
    '#required' => TRUE,
    '#description' => t('Feed Schedule Call'),
  );
  
  $form['feeds_program_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Program URL'),
    '#default_value' => $settings['feed']['program']['url'],
    '#size' => 128,
    '#maxlength' => 255,
    '#required' => TRUE,
    '#description' => t('Feed Program URL'),
  );
  
  $form['feeds_program_call'] = array(
    '#type' => 'textfield',
    '#title' => t('Program Call'),
    '#default_value' => $settings['feed']['program']['call'],
    '#size' => 25,
    '#maxlength' => 50,
    '#required' => TRUE,
    '#description' => t('Feed Program Call'),
  );
  
  return system_settings_form($form);
}

/*
 * ppl_feeds_reports_admin() function
 * Setup feeds via admin interface
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * 
 * @return  Form
 */
function ppl_feeds_reports_admin() {
  $settings = ppl_feeds_get_settings();

  $form['feeds_program'] = array(
    '#type' => 'radios',
    '#title' => t('Program Listing'),
    '#required' => FALSE,
    '#description' => t('Select which type of programs to be included in the Program Listing'),
    // '#default_value' => 'episodes',
    '#options' => array(
      'movies' => t('Movies'),
      'episodes' => t('Episodes'),
      'all' => t('All'),
    ),
  );
 
  
  $form['feeds_schedule'] = array(
    '#type' => 'textfield',
    '#title' => t('Schedule Listing'),
    '#required' => FALSE,
    '#description' => t('Insert the Show Code. Example \'ARMY 1002\'. Enter \'all\' to get a Schedule listing for all Show Codes.'),
    '#size' => 12,

  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value'  => t('Display'),
  );  

  return $form;
}

/*
 * ppl_feeds_actions_admin() function
 * Setup feeds via admin interface
 * 
 * 
 * @access  public
 * 
 * @return  Form
 */
function ppl_feeds_actions_admin() {
  $settings = ppl_feeds_get_settings();

  $form['feeds'] = array(
    '#type' => 'fieldset',
    '#title' => t('Update Feed from PPL'),
    '#description' => t('Update Feed from PPL through running ppl_feeds Cron hook.'),
  );

  $form['feeds']['feeds_cron'] = array(
    '#type' => 'submit',
    '#title' => t('Update Feed from PPL'),
    '#value' => t('Update Feed'),
    '#submit' => array('ppl_feeds_actions_cron_submit'),
  );
  
  $form['feeds_out'] = array(
    '#type' => 'fieldset',
    '#title' => t('Generate Xml output files'),
    '#description' => t('Generate Xml output files for the <em>schedule.swf</em> application.'),
  );

  $form['feeds_out']['feeds_xml'] = array(
    '#type' => 'submit',
    '#title' => t('Generate Xml output files'),
    '#value' => t('Generate Xml'),
    '#submit' => array('ppl_feeds_actions_out_xml_submit'),
  );
 
  // return system_settings_form($form);
  return $form;
}  

/*
 * ppl_feeds_feed_admin_submit() function
 * Proccess form created by ppl_feeds_feed_admin()
 * 
 * @access  public
 * @param $form Array Drupal Vals
 * @param $form_state Array Drupal Vals
 * 
 * 
 */
function ppl_feeds_feed_admin_submit($form, &$form_state)  {	
	
  $feed_schedule = array();
  $feed_schedule['url'] = $form['feeds_schedule_url']['#value'];
  $feed_schedule['call'] = $form['feeds_schedule_call']['#value'];
  
  $feed_program = array();
  $feed_program['url'] = $form['feeds_program_url']['#value'];
  $feed_program['call'] = $form['feeds_program_call']['#value'];
  
  variable_set('ppl_feeds_feed_schedule', serialize($feed_schedule));
  variable_set('ppl_feeds_feed_program', serialize($feed_program));
	
  return;
}

/*
 * ppl_feeds_feed_reports_admin_submit() function
 * Proccess form created by ppl_feeds_feed_admin()
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * @param $form Array Drupal Vals
 * @param $form_state Array Drupal Vals
 * 
 * 
 */
function ppl_feeds_reports_admin_submit($form, &$form_state)  {	
	
  // $out = ppl_feeds_list_by_program('movies');
  // print $out;

  $program_type  = $form['feeds_program']['#value'];
  $schedule_type = $form['feeds_schedule']['#value'];

  if ($program_type) {
    drupal_goto("admin/settings/ppl_feeds/programs/list/$program_type");
  }  

  if ($schedule_type) {
    drupal_goto("admin/settings/ppl_feeds/shows/list/$schedule_type");
  }
  
  drupal_set_message('Please select one of the choices!','warning'); 
    
  return;
}

/**
 * Submit callback; Update feeds cron.
 *
 */
function ppl_feeds_actions_cron_submit($form, &$form_state) {

  ppl_feeds_cron(TRUE);
  drupal_set_message(t('ppl_feeds_cron completed.'));

}

/**
 * Submit callback; Output Xml files.
 *
 */
function ppl_feeds_actions_out_xml_submit($form, &$form_state) {

  foreach (array('et', 'ct', 'mt', 'pt') as $timezone) {

    // Display output detail only for 'et' timezone
    if ($timezone == 'et') {
      // Execute shell level command
      $output = "<b>Details are displayed only</b> for <b>'et'</b> timezone. \n"; 
      $output .= shell_exec("cd /home/web/sites/ltvd6/scripts ; /usr/bin/php schedule_feed_gen.php $timezone");
      drupal_set_message("<pre>$output</pre>");

    } else {
      shell_exec("cd /home/web/sites/ltvd6/scripts ; /usr/bin/php schedule_feed_gen.php $timezone");
    }
  
    // echo "<pre>$output</pre>";
    // exit();
 
    drupal_set_message(t("Generated output Xml files for <b>$timezone</b> timezone."));
  }  
}

/*
 * ppl_feeds_list_by_showcode() function
 * Called through /admin/settings/ppl_feeds/shows/list/<$show_code>
 * 
 * List of shows (all|<showcode>)
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * @param $show_code String Show code
 * 
 * @return String Themed List
 * 
 */
function ppl_feeds_list_by_showcode($show_code=null) {
		
	$modelScheduleSystem = ppl_feeds_get_object('scheduleSystem', 'model');
  
	if($show_code && $show_code!='all') {
		$data = $modelScheduleSystem->listByShowcode(trim(urldecode($show_code)));
		
		$out = '<div class="ppl_feeds">';
    $out.= theme('ppl_feeds_listByShowcode', $data);
    $out.= '</div>';
	} else {
	  $data = $modelScheduleSystem->listByShowcode();
	  
	  $out = '<div class="ppl_feeds">';
	  $out.= theme('ppl_feeds_listAllShowcodes', $data);
	  $out.= '</div>';
	}
  
  return $out;
}

/*
 * ppl_feeds_shows_input_allowed() function
 * Is the user allowed to input on the field?
 * 
 * List of shows (all|<showcode>)
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * @param $val String Field
 * 
 * @return bool (true|false)
 * 
 */
function ppl_feeds_shows_input_allowed($val) {
	if(!$val) {
		return false;
	}
	
	//allowed to edit array
  $allowed = array('title');
    
  return in_array($val, $allowed);
}

/*
 * ppl_feeds_shows_get_input() function
 * Convert themed field to input
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * @return String JSON Array field info
 * 
 */
function ppl_feeds_shows_get_input() {
  $return = array();
  
  $type = trim($_POST['type']);
  $contents = trim($_POST['contents']);
  
  $return['input'] = '<input type="text" name="' . $type . '" class="edit" value="' . $contents . '"/>';
  
  drupal_json($return);
  
  return;
}

/*
 * ppl_feeds_shows_save_input() function
 * Saves input of field
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * @return String JSON Array field info
 * 
 */
function ppl_feeds_shows_save_input() {
	
	$type = trim($_POST['type']);
	$value = trim($_POST['value']);
	$old_contents = trim($_POST['old_contents']);
	$item_id = trim($_POST['item_id']);
	
	$item_id_parts = explode("-", $item_id);
	
	if($item_id_parts[0]!='item') {
		drupal_json(array('saved'=>false));
		return;
	}
	
	$id = $item_id_parts[1];
	
	$return = array();
	if(ppl_feeds_shows_input_allowed($type)) {
		//save
		$modelScheduleSystem = ppl_feeds_get_object('scheduleSystem', 'model');
		
		$modelScheduleSystem->updateFieldById($type, $value, $id);
		$return['html'] = $value;
    $return['saved'] = true;
	} else {
		$return['html'] = $old_contents;
    $return['saved'] = false;
	}
	
	drupal_json($return);
	
	return;
}

/*
 * ppl_feeds_list_by_program() function
 * Get all programs by type
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * @param $type String program type (movies|episodes)
 * 
 * @return String JSON Array field info
 * 
 */
function ppl_feeds_list_by_program($type = false) {
	$modelProgramSystem = ppl_feeds_get_object('programSystem', 'model');
	
	if($type=='movies') {
		$data = $modelProgramSystem->getAllPrograms('movie');
		
		//get nids from content table
		foreach($data as $k => $v) {
			$data[$k]['nids'] = $modelProgramSystem->getNidsForShowCode($v['show_code'], 'movie');
		}
		
		$out = '<div class="ppl_feeds">';
		$out.= theme('ppl_feeds_listAllPrograms', $data);
		$out.= '</div>';

	} else if($type=='episodes') {
		$data = $modelProgramSystem->getAllPrograms('episode');
		
		//get nids from content table
		foreach($data as $k => $v) {
			$data[$k]['nids'] = $modelProgramSystem->getNidsForShowCode($v['show_code'], 'episode');
		}
		
		$out = '<div class="ppl_feeds">';
		$out.= theme('ppl_feeds_listAllPrograms', $data);
		$out.= '</div>';

	} else if($type=='all') {
		$data = $modelProgramSystem->getAllPrograms('');
		
		//get nids from content table
		foreach($data as $k => $v) {
			$data[$k]['nids'] = $modelProgramSystem->getNidsForShowCode($v['show_code'], 'all');
		}
		
		$out = '<div class="ppl_feeds">';
		$out.= theme('ppl_feeds_listAllPrograms', $data);
		$out.= '</div>';
	}	
	return $out;
}

/*
 * ppl_feeds_program_import() function
 * Import Program to Drupal
 * AJAX Call
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * 
 * @return String JSON Array update info
 * 
 */
function ppl_feeds_program_import() {
	
	$type = trim($_POST['type']);
  $value = trim($_POST['value']);
  
  $item_id = trim($_POST['item_id']);
  
  $item_id_parts = explode("-", $item_id);
  
  if($item_id_parts[0]!='item') {
    drupal_json(array('status'=>false, 'error'=>'Missing ID'));
    return;
  }
  
	$modelProgramSystem = ppl_feeds_get_object('programSystem', 'model');
	
	$return = array();
	
	$id = $item_id_parts[1];
	
	$row = $modelProgramSystem->getProgramById($id);
	
	if($row['nid']) {
		$return['error'] = 'Already Imported';
		$return['status'] = false;
	} else {
		if($row['type']=='movie') {
		  $nid = $modelProgramSystem->rowToMovieNode($row);
		} if($row['type']=='episode') {
		  $nid = $modelProgramSystem->rowToEpisodeNode($row);
		}
		
		if(!$nid) {
		  $return['error'] = 'Cannot create node';
      $return['status'] = false;
		} else {
	  	$return['nid'] = $nid;
	  	$return['edit_url'] = l($nid, 'node/'.$nid.'/edit');
	  	$return['status'] = true;
		}
	}
	
	drupal_json($return);
  
  return;
}

/*
 * ppl_feeds_program_search() function
 * Program Search
 * Empty search will yeild result for 'all'
 * 
 * @author Eric Spector <Eric.Spector@aetn.com>
 * 
 * 
 * @access  public
 * 
 * 
 * @return String JSON Array HTML info
 * 
 */
function ppl_feeds_program_search() {
	$type = trim($_POST['type']);
  $text = trim($_POST['text']);
  $field = trim($_POST['field']);
  $imported = trim($_POST['imported']);
  
  $path = drupal_get_path('module', 'ppl_feeds');
  
  $modelProgramSystem = ppl_feeds_get_object('programSystem', 'model');
  
  $return = array();
  
  if($type=='movie') {
  	$data = $modelProgramSystem->searchProgramsByField($field, $text, 'movie', $imported);
  	
  	$return['status'] = true;
  	$out = '';

        //  Output field names header
        $out .= theme_render_template($path.'/templates/admin.listAllPrograms.header.tpl.php', array());

  	foreach($data as $row) {
      //theme
  	  $out .= theme_render_template($path.'/templates/admin.listAllPrograms.row.tpl.php', $row);
  	}
  	
  	$return['html'] = $out;
  }else if($type=='episode') {
  	$data = $modelProgramSystem->searchProgramsByField($field, $text, 'episode', $imported);
  	
  	$return['status'] = true;
  	$out = '';
  	
        //  Output field names header
        $out .= theme_render_template($path.'/templates/admin.listAllPrograms.header.tpl.php', array());
  	
  	foreach($data as $row) {
      //theme
  	  $out .= theme_render_template($path.'/templates/admin.listAllPrograms.row.tpl.php', $row);
  	}
  	
  	$return['html'] = $out;
  } else {
  	//fail
  	$return['error'] = "Invalid Type";
  	$return['status'] = false;
  }
  
  
  drupal_json($return);
  
  return;
}

<?php
class modelProgramSystem {
  private $feed = array();
  
  private $networks = array();
  private $ppl_networks = array();  
  private $network_default;
  
  /*
   * __construct() function
   * Construct
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  public
   * 
   * @param $feed Array Optional feed overwrite
   * @param $networks Array Optional networks overwrite
   * 
   */
  public function __construct($feed = false, $networks = false, $ppl_networks = false) {
    
    $settings = ppl_feeds_get_settings();
    
    if($feed) {
      $this->feed = $feed;
    } else {
      $this->feed = $settings['feed']['program'];
    }
    
    if($networks) {
      $this->networks = $networks;
    } else {
      $this->networks = $settings['networks'];
    }

    if($ppl_networks) {
      $this->ppl_networks = $ppl_networks;
    } else {
      $this->ppl_networks = $settings['ppl_networks'];
    }
    
    $this->network_default = $settings['network_default'];
  }
  
  /*
   * getNetworkId() function
   * Get Network ID
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  private
   * 
   * @param $name String Network name
   * 
   * @return Int Network ID
   * 
   */
  private function getNetworkId($name = null) {
    if (!$name || $name==null) {
      $networkid = $this->networks[$this->network_default];
    } else if ($this->networks[$name]) {
      $networkid = $this->networks[$name];
    } else {
      $networkid = $this->networks[$this->network_default];
    }
    
    return $networkid;
  }
  
  /*
   * getPplNetworkId() function
   * Get PPL Network ID.  This is different from standard Network ID
   * @access  private
   * 
   * @param $name String Network name
   * 
   * @return Int Ppl Network ID
   * 
   */
  private function getPplNetworkId($name = null) {
    if (!$name || $name==null) {
      $ppl_networkid = $this->ppl_networks[$this->network_default];
    } else if ($this->ppl_networks[$name]) {
      $ppl_networkid = $this->ppl_networks[$name];
    } else {
      $ppl_networkid = $this->ppl_networks[$this->network_default];
    }
    
    return $ppl_networkid;
  }


  /*
   * getNetworkNameFromId() function
   * Get Network Name From ID
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  private
   * 
   * @param $networkid Int Network ID
   * 
   * @return String Network name
   * 
   */
  private function getNetworkNameFromId($networkid) {
    static $networks = false;
    if(!$networks) {
      $networks = array();
      foreach($this->networks as $k=>$v) {
        $networks[$v] = $k;
      }
    }
    
    if($networks[$networkid]) {
      return $networks[$networkid];
    } else {
      return false;
    }
  }
  

  /*
   * bindArrayToObject() function
   * This function will convert any multidimensional array to an equivalent multidimensional object. 
   * It will recursively traverse the array to an infinite number of dimensions.
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  private
   * 
   * @param $array Array input array
   * @param $single_level Bool Only do the first level?
   * 
   * @return Object converted from array
   * 
   */
  private function bindArrayToObject($array, $single_level=false) {
    //declare blank class for return
    $return = new stdClass();
    
    if($single_level) {
      //if we only want to return a single level object result then
      //this should do it
      
      if (!empty($array)) {
          //iterate through the array list and set up the return object
          foreach ($array as $akey => $aval) {
              $return -> {$akey} = $aval;
          }
          
          //return the new object
          return $return;
      }
      return false; //if the array is empty return false
    } else {
      //do a multi-level object conversion
      //this is a recursive function
      
      foreach ($array as $k => $v) {
        if (is_array($v)) {
          $return->$k = $this->bindArrayToObject($v);
        } else {
          $return->$k = $v;
        }
      }
    }
    
    return $return;
  }
  
  /*
   * _parseGetData() function
   * Parse XML returned by the server
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  private
   * 
   * @param $xml Array SimpleXML data
   * 
   * @return Array Info data
   * 
   */
  private function _parseGetData($xml) {
    if (strtolower(trim($xml->status)) === "success" && isset($xml->programs)) {
      
      foreach ($xml->programs->children() as $prog) {
        $type = (string)$prog['type'];
        $showcode = (string)$prog['show_code'];
        $program_id = (string)$prog['program_id'];
        $eps_id = (string)$prog['eps_id'];
        $title = (string)$prog->title;
        $xml = (string)$prog->asXML();
   
        if ($type === "series") { 
          //if the type ingested was series, then we need to tweak it to be a show since that's the name of our content type
          $type = "show"; 
        }
    
         $feeditems[] = array("type" => $type, "show_code" => $showcode, "program_id" => $program_id, "eps_id" => $eps_id, "title" => $title, "xml" => $xml );
      }//end - foreach
    }//end - if success
    
    return $feeditems;
  }
  
  /*
   * getRemoteData() function
   * Parse XML returned by the server
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $network String Network name
   * @param $checked String Date check from
   * 
   * @return Array Info data
   * 
   */
  public function getRemoteData($network = null, $checked = false) {
    
    if (!$checked) {
      //pull last check
      $checked = variable_get('on_tv_feed_program_checked', strtotime("-1 month")); //defaults to the last month
      //todo: change month to 1 after testing
    }
    
    $networkid     = $this->getNetworkId($network);
    $ppl_networkid = $this->getPplNetworkId($network);    // networkid is different in PP<  1,2,3  are mapped to 11,12,13

    //set up date calculations
    $daysahead =  variable_get('on_tv_feed_program_daysahead', 7);//system setting variable for the number of days into the future to pull data for
    $daysbehind = variable_get('on_tv_feed_program_daysbehind', 7);//system setting variable for the number of days into the past to pull data for

    // $datefrom = date ( "Y-m-d\TH:i:s", mktime(0, 0, 0, date("m")  , date("d"), date("Y")) );
    $dateto = date ( "Y-m-d\TH:i:s", mktime(0, 0, 0, date("m"), date("d")+$daysahead, date("Y")) );
    // $datemods = date ( "Y-m-d\TH:i:s" , $checked - strtotime("-1 week") );//this will only pull things that have been updated since last go around (minus 1 week)
    // $datemods = date ( "Y-m-d\TH:i:s" , mktime(0, 0, 0, date("m", $checked), date("d", $checked) - 7, date("Y", $checked)) ); //this will only pull things that have been updated since last go around (minus 7 days)
    $datemods = date ( "Y-m-d\TH:i:s" , mktime(0, 0, 0, date("m"), date("d") - $daysbehind, date("Y")) ); //this will only pull things that have been updated starting from 7 days ago
    $datefrom = $datemods;   // $datefrom also needs to go-back 7 days

    // debug
    if ($this->debug) {
      // error_log("From ppl_feeds.module (programSystem):  \$datefrom: " . $datefrom);
      // error_log("From ppl_feeds.module (programSystem):  \$dateto: " . $dateto);
      error_log("From ppl_feeds.module (programSystem):  \$datemods: " . $datemods);
    }
    
    //set showcode
    $showcode = ""; //blank
  
    //params for the soap call
    $params = array();
    $params['pNetId'] = $ppl_networkid;
    $params['pFromDt'] = $datefrom;
    $params['pToDt'] = $dateto;
    $params['pModDt'] = $datemods;
    $params['pSeries'] = $showcode;
    $params['IgnoreDateRange'] = 0;

    // debug
    error_log("From programSystem.inc (line 269) \$params: " . print_r($params, 1));

    
    //get xml via soap feed
    $xml = aetn_feeder_get_feed($this->feed, $params, 'soap');
    
    //parse the data
    $xml = $this->_parseGetData($xml);
    
    //convert to normalized data
    $data = array(); //init
    foreach($xml as $xmlData) {
      $data[] = $this->parseXmlProgramData($xmlData['xml']);
    }
    
    //return array
    $return = array();
    $return['data'] = $data;
    $return['networkid'] = $networkid;
    
    return $return;
  }
  
  /*
   * getDataForEpisode() function
   * Get Data for an Episode by Show Information
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $show_code String Show Code
   * @param $eps_id String Episode ID
   * @param $networkid Int Network ID
   * 
   * @return Array Row data or FALSE if nonexistant
   * 
   */
  public function getDataForEpisode($show_code, $eps_id, $networkid) {
    $_sql = "SELECT * FROM {ppl_feeds_program} where show_code='%s' and eps_id='%s' and networkid='%d'";
    
    $result = db_query($_sql, $show_code, $eps_id, $networkid);
    
    $row = db_fetch_array($result);
    
    if (!$row) {
      return false;
    }
    
    return $row;
  }
  
  /*
   * episodeDifferent() function
   * Is episode different from the one in the DB ?
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access private
   * 
   * @param $show_code String Show Code
   * @param $program_id String Episode ID
   * @param $eps_id String Episode ID
   * @param $networkid Int Network ID
   * @param $newdata Array New data array
   * 
   * @return Bool Is data different?
   * 
   */
  private function episodeDifferent($show_code, $eps_id, $networkid, $newdata) {
    $data = $this->getDataForEpisode($show_code, $eps_id, $networkid);
    
    if (!$data) {
      return true; //data doesn't exist, so they're different
    }
    
    $fields_to_compare = array('title', 'type', 'show_code', 'eps_id', 'program_id', 'title', 'teaser', 'year', 'body', 'genre', 'rating', 'cast');
    
    $diff = false;
    foreach($fields_to_compare as $field) {
      if ($data[$field]!=$newdata[$field]) {
        $diff = true;
          
        if ($this->debug) {
          error_log("ppl_feeds.module (programSystem) timeslot diff:    [" . $field."]: " . $data[$field]);
          error_log("ppl_feeds.module (programSystem) timeslot diff: vs [" . $field."]: " . $newdata[$field]);
        }
      }
    }
    
    if ($diff) {
      return true;
    } else {  
      return false;
    }
  }
  
  /*
   * wipeEpisode() function
   * Wipe Episode
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access private
   * 
   * @param $show_code String Show Code
   * @param $eps_id String Episode ID
   * @param $networkid Int Network ID
   * 
   */
  private function wipeEpisode($show_code, $eps_id, $networkid) {
    $_sql = "DELETE FROM {ppl_feeds_program} where show_code='%s' and eps_id='%s' and networkid='%d'";
    
    $result = db_query($_sql, $show_code, $eps_id, $networkid);
    
    if ($this->debug) {
      error_log("ppl_feeds.module (programSystem) wiping netid:" . $networkid . " show_code:".$show_code." eps_id:".$eps_id);
    }
  }
  
  /*
   * dbUpdate() function
   * Update data in the db
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access private
   * 
   * @param $data 
   * 
   */
  private function dbUpdate($data) {
    if (sizeof($data['data'])<1 || !$data['data']) {
      return;
    }
    
    $fields = array('title', 'networkid', 'type', 'show_code', 'program_id', 'eps_id', 'teaser', 'year', 'body', 'genre', 'rating', 'cast', 'xml');
    $types = array(
                    'title'=>'%s',
                    'networkid'=>'%d',
                    'type'=>'%s',
                    'show_code'=>'%s',
                    'program_id'=>'%d',
                    'eps_id'=>'%d',
                    'teaser'=>'%s',
                    'year'=>'%d',
                    'body'=>'%s',
                    'genre'=>'%s',
                    'rating'=>'%s',
                    'cast'=>'%s',
                    'show_code'=>'%s',
                    'xml'=>'%s',
                  );
        
    foreach($data['data'] as $row) {
      //set networkid row
      $row['networkid'] = $data['networkid'];
      
      //cast modification
      if (is_array($row['cast']) && sizeof($row['cast'])>=1) {
        $row['cast'] = implode(", ", $row['cast']);
      } else {
        unset($row['cast']);
      }
      
      $diff = $this->episodeDifferent($row['show_code'], $row['eps_id'], $row['networkid'], $row);

      if ($diff) {
        $this->wipeEpisode($row['show_code'], $row['eps_id'], $row['networkid']);
      } else {
        continue;
      }
      
      $_sql = "INSERT INTO {ppl_feeds_program} (" . implode(",", $fields) . ") ";
      $_sql.= " VALUES (";
      $count = 0;
      
      $args = array();
      foreach($fields as $key=>$v) {
        ++$count;
        $_sql.= (($count!=1)?',':'')."'". $types[$v] ."'";
        
        $args[] = $row[$v];
      }
      $_sql.= ")";
      
      db_query($_sql, $args);
    }
  }
  
  /*
   * parseXmlProgramData() function
   * Helper function used to parse the individual program data xml block
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access private
   * 
   * @param $progxml Array Program xml block
   * 
   * @return Array Structure of values pulled from the xml
   * 
   */
  public function parseXmlProgramData($progxml) {
    $xml = new SimpleXMLElement($progxml);

    $data['xml'] = $progxml;
    $data['show_code'] = (string)$xml['show_code'];
    $data['program_id'] = (string)$xml['program_id'];
    $data['eps_id'] = (string)$xml['eps_id'];
    $data['title'] = (string)$xml->title;
    $data['year'] = (string)$xml->year;
    $data['rating'] = (string)$xml->rating;//pg-13 l
    $data['teaser'] = (string) $xml->descriptions->description[0];//tv_guide should be the first entry, if there is one
    $data['body'] = (count($xml->descriptions->description) >= 2 ? (string) $xml->descriptions->description[1] : $teaser);//should be plot, unless it wasn't provided, then it copies the teaser
    $data['genre'] = (string)$xml->genre;//ie. drama, etc.
    $data['medium'] = (string)$xml->medium;//ie. acquired series, etc.
    $data['format'] = (string)$xml->format;//ie. scripted, etc.
    $data['credits'] = $xml->credits;//ie. star, costar and director
    $data['holidays'] = $xml->holidays;//ie. christmas, etc.
    $data['subjects'] = $xml->subjects;//aka keywords: ie. family situations, wedding, single parenthood
    $data['type'] = (string)$xml['type'];
    
    if (sizeof($data['credits'])>=1) {
      $data['cast'] = array();
      foreach($data['credits']->credit as $credit) {
        $roleAttribs = $credit->role->attributes();
        
        if ((string)$roleAttribs['type']=='star') {
          if (!in_array((string)$credit->first_name[0] . ' ' . (string)$credit->last_name[0], $data['cast'])) {
            $data['cast'][] = (string)$credit->first_name[0] . ' ' . (string)$credit->last_name[0];
          }
        }
      }
      
      asort($data['cast']);
    }
  
    return $data;
  }
  
  /*
   * sync() function
   * Sync DB data with the server
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $network String Network name
   * @param $checked String Optional date last checked
   * 
   * @return Array data
   * 
   */
  public function sync($network = null, $checked = false) {
    $data = $this->getRemoteData($network, $checked);
        
    $this->dbUpdate($data);
    
    variable_set('on_tv_feed_program_checked', time());
    
    return $data;
  }
  
  /*
   * getAllPrograms() function
   * Get all programs
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $type String Optional by type
   * 
   * @return Array All programs
   * 
   */
  public function getAllPrograms($type=false) {
    if($type) {
      $_sql = "SELECT * FROM {ppl_feeds_program} WHERE type='%s' ORDER BY title ASC";
      $result = db_query($_sql, $type); 
    } else {
      $_sql = "SELECT * FROM {ppl_feeds_program} ORDER BY title ASC";
      $result = db_query($_sql); 
    }
    
    $data = array();
    
    while($row = db_fetch_array($result)) {
      $data[] = $row;
    }
    
    return $data;
  }
  
  
  /*
   * getNidsForShowCode() function
   * Get nid for Show Code
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $show_code String Show code
   * @param $type String Type (movie for now)
   * 
   * @return Array Search results
   * 
   */
  public function getNidsForShowCode($show_code, $type='movie') {
    $_sql = "SELECT nid FROM {content_field_show_code} WHERE field_show_code_value='%s' ORDER BY nid ASC";
        
    $result = db_query($_sql, $show_code); 
    
    $data = array();
    
    while($row = db_fetch_array($result)) {
      $data[] = $row['nid'];
    }
        
    return $data;
  }
  
  /*
   * searchProgramsByField() function
   * Search programs by field
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $field String Field name
   * @param $text String Text for the field
   * @param $type String Optional type
   * @param $imported String Optional (all|imported|not imported)
   * 
   * @return Array Search results
   * 
   */
  public function searchProgramsByField($field, $text, $type=false, $imported=false) {
    
    if($type) {
      $_sql = "SELECT * FROM {ppl_feeds_program} WHERE type='%s' AND " . $field . " LIKE '%%%s%%' ORDER BY title ASC";
      $result = db_query($_sql, $type, $text); 
    } else {
      $_sql = "SELECT * FROM {ppl_feeds_program} WHERE " . $field . " LIKE '%%%s%%' ORDER BY title ASC";
      $result = db_query($_sql, $text); 
    }
    
    $data = array();
    
    while($row = db_fetch_array($result)) {
      $row['nids'] = $this->getNidsForShowCode($row['show_code'], 'movie');
      if ($imported == 'all' || !$imported) {
        //do nothing
      } elseif ($imported == 'imported') {
        if(sizeof($row['nids'])<=0) {
          continue;
        }
      } else {
       if(sizeof($row['nids'])>=1) {
          continue;
        }
      }
      
      $data[] = $row;
    }
    
    return $data;
  }
  
  /*
   * getProgramById() function
   * Get programs by id
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $programId Int program id
   * 
   * @return Array Results
   * 
   */
  public function getProgramById($programId) {
    if(!$programId) {
      return false;
    }
    
    $_sql = "SELECT * FROM {ppl_feeds_program} WHERE id='%d'";
    $result = db_query($_sql, $programId);
    
    $row = db_fetch_array($result);
    
    return $row;
  }
  
  /*
   * rowToMovieNode() function
   * Convert $row data to a Drupal Node
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $row Array row info
   * 
   * @return Int node id
   * 
   */
  public function rowToMovieNode($row=array()) {
    if($row['type']!='movie') {
      return false;
    }
    
    global $user;
    
    $node = array();
    $node['type'] = 'movie';
    $node['status'] = 0; //unpublished
    $node['uid'] = $user->uid;
    $node['name'] = $user->name;
    $node['title'] = $row['title'];
    $node['body'] = $row['body'];
    $node['teaser'] = $row['teaser'];
    
    $node['field_alternate_title'][0]['value'] = $row['title'];
    $node['field_cast'][0]['value'] = $row['cast'];
    $node['field_show_code'][0]['value'] = $row['show_code'];
    $node['field_tv_network'][0]['value'] = $this->getNetworkNameFromId($row['networkid']);
    $node['field_alternate_title'][0]['value'] = $row['title'];
    
    $node['field_rating'][0]['value'] = $row['rating'];
    $node['field_year'][0] = array('value'=>$row['year'], 'timezone'=>'UTC', 'timezone_db'=>'UTC', 'date_type'=>'date');

    $new_node = $this->bindArrayToObject($node, true); 
    node_save($new_node);
    
    return $new_node->nid;
  }

  /*
   * rowToEpisodeNode() function
   * Convert $row data to a Drupal Node
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $row Array row info
   * 
   * @return Int node id
   * 
   */
  public function rowToEpisodeNode($row=array()) {
    if($row['type']!='episode') {
      return false;
    }
    
    global $user;
    
    $node = array();
    $node['type'] = 'episode';
    $node['status'] = 0; //unpublished
    $node['uid'] = $user->uid;
    $node['name'] = $user->name;
    $node['title'] = $row['title'];
    $node['body'] = $row['body'];
    $node['teaser'] = $row['teaser'];
    
    $node['field_alternate_title'][0]['value'] = $row['title'];
    $node['field_cast'][0]['value'] = $row['cast'];
    $node['field_show_code'][0]['value'] = $row['show_code'];
    $node['field_tv_network'][0]['value'] = $this->getNetworkNameFromId($row['networkid']);
    $node['field_alternate_title'][0]['value'] = $row['title'];
    
    $node['field_rating'][0]['value'] = $row['rating'];
    $node['field_year'][0] = array('value'=>$row['year'], 'timezone'=>'UTC', 'timezone_db'=>'UTC', 'date_type'=>'date');

    $new_node = $this->bindArrayToObject($node, true); 
    node_save($new_node);
    
    return $new_node->nid;
  }
}

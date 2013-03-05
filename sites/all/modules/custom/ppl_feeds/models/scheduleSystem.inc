<?php
class modelScheduleSystem {
	private $debug;
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
    	$this->feed = $settings['feed']['schedule'];
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
   * idToNetworkName() function
   * Get Network Name From ID
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  public
   * 
   * @param $networkid Int Network ID
   * 
   * @return String Network name
   * 
   */
	public function idToNetworkName($networkid) {
		static $network_list = array();
		
		if(sizeof($network_list)<=0) {
			$network_list = array();
			
			foreach($this->network as $key => $value) {
				$network_list[$value] = $key;
			}
		}
		
		if(isset($network_list[$value])) {
			return $network_list[$value];
		} else {
			return $this->network_default;
		}
	}
	
	/*
   * getScheduleForShowCode() function
   * Get Schedule for Show Code
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  public
   * 
   * @param $showcode String Optional show code
   * @param $futureOnly Bool Show future only
   * 
   * @return Array Info data
   * 
   */
	public function getScheduleForShowCode($showcode = false, $futureOnly = true) {
		
		if($futureOnly) {
			if($showcode) {
		    $_sql = "SELECT * FROM {ppl_feeds_schedule} WHERE show_code='%s' AND airdate >= now() ORDER BY airdate ASC";
			} else {
				$_sql = "SELECT * FROM {ppl_feeds_schedule} WHERE airdate >= now() ORDER BY airdate ASC";
			}
		} else {
			if($showcode) {
			  $_sql = "SELECT * FROM {ppl_feeds_schedule} WHERE show_code='%s' ORDER BY airdate ASC";
			} else {
				$_sql = "SELECT * FROM {ppl_feeds_schedule} ORDER BY airdate ASC";
			}
		}
		
		if($showcode) {
		  $result = db_query($_sql, $showcode);
		} else {
			$result = db_query($_sql);
		}
    
	  if (!$result) {
      return false;
    }
		
    $out = array();
    while($row = db_fetch_array($result)) {
    	$out[] = $row;
    }
    
    return $out;
	}
	
	
	/*
   * formatdate() function
   * Helper function to format date in a valid database friendly manner.
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access  private
   * 
   * @param $date String Date to format
   * 
   * @return The date string that we want to format
   * 
   */
	private function formatdate($date) {
	  $tmp = strtotime($date);
	  if ($tmp) {
	    $tmp = date("Y-m-d H:i", $tmp);
	  } else {
	    $tmp = "";
	  }
	  return $tmp;
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

    if (strtolower(trim($xml->status)) === "success" && isset($xml->schedule)) {    	
    	$results = array();
    	
      foreach ($xml->schedule->children() as $timeslot) {
        $out = array();

      	$out['show_code'] = (string)$timeslot['show_code'];
      	$out['program_id'] = (string)$timeslot['program_id'];
        $out['eps_id'] = (string)$timeslot['eps_id'];
        $out['title'] = (string)$timeslot->series;
        $out['episode'] = (string)$timeslot->episode;
        $out['body'] = (string)$timeslot->tv_guide;
        $out['date'] = (string)$timeslot->date;
        $out['time'] = (string)$timeslot->time;
        $out['exact_time'] = (string)$timeslot->exact_time;
        $out['duration'] = (string)$timeslot->duration;
        $out['rating'] = (string)$timeslot->rating;
        $out['closed_caption'] = (string)$timeslot->closed_caption;
        $out['audio_sap'] = (string)$timeslot->audio_sap;
        $out['audio_format'] = (string)$timeslot->audio_format;

        /*  Inneffective because this field with "Movie" does not indicate if its a Movie
        if ($out['series'] == "Movie") {
          $out['title'] = $out['episode'];
          $out['episode'] = "";
        }
        */

        if ($out['title'] == "") {
          $out['title'] = "None";
        }
  
        $out['airdate'] = $out['date'] . " " . $out['time'];
        $out['airexact'] = $out['date'] . " " . $out['exact_time'];

        $out['airdate'] = $this->formatdate($out['airdate']);
        $out['airexact'] = $this->formatdate($out['airexact']);
        $out['paid_no_listing'] = (string)$timeslot->paid_no_listing;
		
        $results[] = $out;
			}
			return $results;
    }
    
    return false;
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
      $checked = variable_get('on_tv_feed_schedule_checked', strtotime("-1 month")); //defaults to the last month
    }
    
    $feeditems = array();
  
    $daysahead = variable_get('on_tv_feed_schedule_daysahead', 45);//system setting variable for the number of days into the future to pull data for
  
    $networkid = $this->getNetworkId($network);
    $ppl_networkid = $this->getPplNetworkId($network);    // networkid is different in PP<  1,2,3  are mapped to 11,12,13


    // Need format of "2007-04-10T00:00:00" otherwise Web Services Server will reject it!
    $datefrom = date ( "Y-m-d\TH:i:s", mktime(0, 0, 0, date("m")  , date("d"), date("Y")) );
    $dateto = date ( "Y-m-d\TH:i:s", mktime(0, 0, 0, date("m")  , date("d")+$daysahead, date("Y")) );
  

    // $datemods = date ( "Y-m-d\TH:i:s" , $checked - strtotime("-1 week") );//this will only pull things that have been updated since last go around (minus 1 week)
    $datemods = "1990-01-01T00:00:00";
    $showcode = "";
    $paid_showcodes = variable_get('ppl_feeds_schedule_paid_programming', '');  //system setting variable paid-programming shows to include
  
    // debug
    if ($this->debug) {
      error_log("From ppl_feeds.module (scheduleSystem):  \$datefrom: " . $datefrom);
      error_log("From ppl_feeds.module (scheduleSystem):  \$dateto: " . $dateto);
      error_log("From ppl_feeds.module (scheduleSystem):  \$datemods: " . $datemods);
    }
    
    //params for the soap call
    $params = array();
    $params['pNetId'] = $ppl_networkid;
    $params['pFromDt'] = $datefrom;
    $params['pToDt'] = $dateto;
    $params['pModDt'] = $datemods;
    $params['pSeries'] = $showcode;
    $params['pPaidPgms'] = $paid_showcodes;

    // debug
    error_log("From scheduleSystem.inc (line 317) \$params: " . print_r($params, 1));
    
    
    //get xml via soap feed
    $xml = aetn_feeder_get_feed($this->feed, $params, 'soap');
    
    $data = array();
    //parse the data
    $data['data'] = $this->_parseGetData($xml);
    $data['networkid'] = $networkid;

    return $data;
    }
	
	/*
   * getDataForTimeslot() function
   * Get data for a timeslot
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $timeslot String Date Timeslot
   * @param $checked Int Network ID
   * 
   * @return Array Schedule info row
   * 
   */
	public function getDataForTimeslot($timeslot, $networkid=null) {
		$_sql = "SELECT * FROM {ppl_feeds_schedule} WHERE airdate='%s' AND networkid='%d'";
		
		$result = db_query($_sql, $timeslot, $networkid);
		
		$row = db_fetch_array($result);
		
		if (!$row) {
			return false;
		}
		
		return $row;
	}
	
	/*
   * timeslotDifferent() function
   * Is the timeslot different?
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access private
   * 
   * @param $timeslot String Date Timeslot
   * @param $networkid Int Network ID
   * @param $newdata Array row date
   * 
   * @return Bool Different?
   * 
   */
	private function timeslotDifferent($timeslot, $networkid=null, $newdata) {
		$data = $this->getDataForTimeslot($timeslot, $networkid);
		
		if (!$data) {
			return true; //data doesn't exist, so they're different
		}
				
		$fields_to_compare = array('title', 'episode', 'body', 'show_code', 'program_id', 'eps_id', 'duration', 'airdate', 'airexact', 'rating', 'closed_caption', 'audio_sap', 'audio_format', 'paid_no_listing');
		
		$diff = false;
		foreach($fields_to_compare as $field) {
			if ($data[$field]!=$newdata[$field]) {
				$diff = true;
				  
				if ($this->debug) {
					error_log("ppl_feeds.module (scheduleSystem) timeslot diff:    [" . $field. "]: " . $data[$field]);
					error_log("ppl_feeds.module (scheduleSystem) timeslot diff: vs [" . $field. "]: " . $newdata[$field]);
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
   * wipeTimeslot() function
   * wipe timeslot
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access private
   * 
   * @param $timeslot String Date Timeslot
   * @param $duration Int Network ID
   * @param $networkid Int Network ID
   * 
   * 
   */
	private function wipeTimeslot($timeslot, $duration=30, $networkid=null) {
		$start_time = strtotime($timeslot);
		$end_time = $start_time + ($duration * 60);
		
		$start_str = date('Y-m-d H:i:s', $start_time);
		$end_str = date('Y-m-d H:i:s', $end_time);
		
		$_sql = "DELETE FROM {ppl_feeds_schedule} WHERE airdate>='%s' AND airdate<'%s' AND networkid='%d'";
		
		db_query($_sql, $start_str, $end_str, $networkid);
		
	  if ($this->debug) {
      error_log("ppl_feeds.module (scheduleSystem) wiping networkid:" . $networkid . " timeslot:".$timeslot." duration:".$duration);
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
			
        
			
		$fields = array('title', 'networkid','episode', 'body', 'show_code', 'program_id', 'eps_id', 'duration', 'airdate', 'airexact', 'rating', 'closed_caption', 'audio_sap', 'audio_format' ,'paid_no_listing');
		$types = array(
			              'title'=>'%s',
		                  'networkid'=>'%d',
			              'episode'=>'%s',
			              'body'=>'%s',
			              'show_code'=>'%s',
      		                      'program_id'=>'%d',
		                      'eps_id'=>'%d',
			              'duration'=>'%d',
			              'airdate'=>'%s',
			              'airexact'=>'%s',
			              'rating'=>'%s',
			              'closed_caption'=>'%s',
			              'audio_sap'=>'%s',
			              'audio_format'=>'%s',
						  'paid_no_listing'=>'%s',
		              );
		
    $date_formats = array('airdate', 'airexact');
		
		foreach($data['data'] as $row) {
			$local_fields = $fields;
		  //format dates if needed
			foreach($date_formats as $date_format) {
		  	if ($row[$date_format]) {
          $row[$date_format] = date("Y-m-d H:i:s", strtotime($row[$date_format]));
		  	}
      }
      
      //set networkid row
      $row['networkid'] = $data['networkid'];
			
			$newData = $this->timeslotDifferent($row['airdate'], $row['networkid'], $row);
			
			if ($newData) {
				$this->wipeTimeslot($row['airdate'], $row['duration'], $row['networkid']);
			} else {
				continue;
			}
			$_sql = '';
			$_sql = " VALUES (";
			$count = 0;
			
			$args = array();
			foreach($local_fields as $key=>$v) {
				if (!$row[$v] || sizeof($row[$v])<=0) {
					unset($local_fields[$key]);
					
					continue;
				}
				
				++$count;
				$_sql.= (($count!=1)?',':'')."'". $types[$v] ."'";
				
				$args[] = $row[$v];
			}
			$_sql.= ")";
			
			$_sql = "INSERT INTO {ppl_feeds_schedule} (" . implode(",", $local_fields) . ") " . $_sql;
			
            db_query($_sql, $args);
		}
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
	
    // debug
    error_log("From scheduleSystem.inc (line 532) count(\$data['data']): " . print_r(count($data['data']), 1));
    error_log("From scheduleSystem.inc (line 533) \$data['networkid']): " . print_r($data['networkid'], 1));

    $this->dbUpdate($data);
    
    variable_set('on_tv_feed_schedule_checked', time());
    
    return $data;
  }
  
  /*
   * listByShowcode() function
   * Get list by showcode
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $show_code String Show code
   * 
   * @return Array data
   * 
   */
  public function listByShowcode($show_code = null) {
  	if($show_code) {
  	  $_sql = "SELECT * FROM {ppl_feeds_schedule} WHERE show_code='%s' ORDER BY airdate ASC, title ASC";
  	  $result = db_query($_sql, $show_code);
  	} else {
  		$_sql = "SELECT * FROM {ppl_feeds_schedule} GROUP BY show_code ORDER BY show_code ASC, title ASC";
  		$result = db_query($_sql);
  	}
  	
  	$data = array();
  	
    while($row = db_fetch_array($result)) {
      $data[] = $row;
    }
    
    return $data;
  }
  
  /*
   * updateFieldById() function
   * Get list by showcode
   * 
   * @author Eric Spector <Eric.Spector@aetn.com>
   * 
   * 
   * @access public
   * 
   * @param $field String Name of field
   * @param $value String Value
   * @param $id Int ID to update
   * 
   * @return Array data
   * 
   */
  public function updateFieldById($field, $value, $id) {
  	if(!$field || !$value || !$id) {
  		return false;
  	}
  	
  	$_sql = "UPDATE {ppl_feeds_schedule} SET " . $field . "='%s' WHERE id=%d";
  	
  	$result = db_query($_sql, $value, $id);
  	
  	return $result;
  }
}
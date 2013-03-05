<div class="list_row" id="item-<?php echo $id ?>">
  <div class="item type" type="type">
    <?php echo $type ?>
  </div>
  <div class="item title" type="title">
    <?php echo $title ?>
  </div>
  <div class="item show_code" type="show_code">
    <?php echo $show_code ?>
  </div>
  <div class="item year" type="year">
    <?php echo $year ?>
  </div>
  <div class="item genre" type="genre">
    <?php echo $genre ?>
  </div>
  <div class="item program_id" type="program_id">
    <?php echo $program_id ?>
  </div>
  <div class="item eps_id" type="eps_id">
    <?php echo $eps_id ?>
  </div> 
  <div class="item networkid" type="networkid">
    <?php echo $networkid ?>
  </div> 
  <div class="item import <?php echo (sizeof($nids)<=0?'import_me':'imported');?>" type="import" <?php echo ($nids[0]?'nid="'.$nids[0].'"':'');?>>
    <?php if (sizeof($nids)==1): ?>
      <?php echo l($nids[0], 'node/'.$nids[0].'/edit'); ?>
    <?php elseif (sizeof($nids)>1): ?>
      <?php foreach($nids as $c_nid): ?>
        <?php echo l($c_nid, 'node/'.$c_nid.'/edit'); ?>
      <?php endforeach;?>
    <?php else: ?>
      Import
    <?php endif;?>
  </div>
</div>

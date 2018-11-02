<?php

  $GLOBALS['log']='/data/logs.log';

  uopz_allow_exit(true);

  function logger($txt) {
    if ($txt != 'OPEN WRITE ' . $GLOBALS['log']) {
      $txt = date_format(new DateTime('now'),'c') . " PHP {$txt}";
      $myfile = file_put_contents($GLOBALS['log'], $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
    }
    return false;
  }
  
  foreach (array('system', 'shell_exec', 'exec', 'passthru') as $cmd) {
    uopz_set_hook($cmd, function ($str) { logger("EXEC: {$str}"); });
  }
    uopz_set_hook('fopen', function ($str, $type) {
      logger("OPEN ". (($type == 'r') ? 'READ' : 'WRITE') ." {$str}");
    });
    uopz_set_hook('file_get_contents', function ($str) { logger("OPEN READ {$str}"); });
    uopz_set_hook('file_put_contents', function ($str) { logger("OPEN WRITE {$str}"); });

  $cmd = $argv[1];
  if (preg_match("/^[a-zA-Z0-9=]+$/", $cmd)) {
    $cmd = base64_decode($cmd);
  }

  eval($cmd);

?>

<?php
$DAY = 86400;

$BASE = (new DateTime())->getTimestamp();
$START_TIME = $BASE - $DAY;
$END_TIME = ($BASE + $DAY);

header('Content-type: application/json');
echo "{\"running\": true, \"start_time\": $START_TIME, \"end_time\": $END_TIME}";

<?php
$START_TIME = (new DateTime())->getTimestamp();
$END_TIME = $START_TIME + 86400;

header('Content-type: application/json');
echo "{running: true, start_time: $START_TIME, end_time: $END_TIME}";

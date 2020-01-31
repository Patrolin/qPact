<?php

header('Content-Type: application/json');

$flag = $_POST['flag'];
$time_start = $_POST['time_start'];
$time_end = $_POST['time_end'];

error_log("$flag, $time_start, $time_end");

echo "{\"success\": true, \"message\": \"you are awesome\"}";

<?php
session_start();
if (isset($_GET["submit"])) {
	$x = $_GET["x"];
	$y = $_GET["y"];
	if ($x === "0") {
		var_dump($_SESSION);
	} else {
		$_SESSION["numbers"][] = $y;
	}
}

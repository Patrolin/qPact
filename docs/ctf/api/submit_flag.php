<?php

header('Content-Type: application/json');

$flag = strval($_POST["flag"] ?? "");
$wallet_id = strval($_POST["wallet_address"] ?? "");
$comment = strval($_POST["comment"] ?? "");
error_log("$flag, $wallet_id, $comment");


function validate_flag(string $flag): bool
{
	return (bool) preg_match('/^\{LBRY-.+\}$/', $flag);
}

function validate_wallet(string $wallet_id): bool
{
	return (bool) preg_match('/^(b|r)(?=[^0OIl]{32,33})[\da-zA-Z]{32,33}$/', $wallet_id);
}

$message = "";
if (!validate_flag($flag)) {
	$message = "Unvalid flag format.<br>Check for typos.";
} elseif (!validate_wallet($wallet_id)) {
	$message = "Unvalid wallet address.<br>Check for typos.";
}

if (!strcmp($flag, "{LBRY-abc}")) {
	$success = true;
	$message = "Success";
	header("HTTP/1.1 200 OK");
} else {
	$success = false;
	$message = "Unvalid flag";
	header("HTTP/1.1 400 Bad Request");
}
echo json_encode(["success" => $success, "message" => $message]);

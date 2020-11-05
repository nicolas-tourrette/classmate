<?php

if(isset($_POST["data"])){
    $data = json_decode($_POST["data"], true);
    if($data["password"] !== "hash"){
        header("HTTP/1.0 401 Error: Unauthorized.");
        throw new Exception("Error 401. Unauthorized.");
    }
}
else{
    header("HTTP/1.0 400 Error: Bad request.");
    throw new Exception("Error 400. Bad request.");
}
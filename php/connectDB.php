<!DOCTYPE HTML>
<html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="">
	<meta name="author" content="">



</head>

<body>

	<?php
    ini_set("display_errors", 1); 
    


	$con = mysqli_connect('localhost','rlawlsdnjswk','jina4398!','rlawlsdnjswk');

        // Check connection
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    } 
    else{
        echo "My sql 접속완료 ";
    }    
       


    
    ?>

</body>

</html>

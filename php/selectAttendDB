<?php
     ini_set("display_errors", 1); 


//mysql연결
	$con = mysqli_connect('localhost','rlawlsdnjswk','jina4398!','rlawlsdnjswk');

   if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    } 
    else{
       // echo "My sql 접속완료 <br>";
    }

		$date = $_POST['popupDate'];
 		
$query = "SELECT reason FROM $date WHERE member='공지'";
$result = mysqli_query($con, $query);
$array = mysqli_fetch_array($result);
echo $array['reason'];



$con->close();
?>

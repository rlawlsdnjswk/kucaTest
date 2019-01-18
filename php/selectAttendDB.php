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

	$date   = $_POST['sendDate'];
	$query  = "SELECT member,status,reason FROM $date ";
	$result = mysqli_query($con, $query);

	while($row = mysqli_fetch_array($result)){
		
		$member = $row['member']."-";
		$status = $row['status']."-";
		$reason = $row['reason']."/";
		echo $member;
		echo $status;
		echo $reason;
	} 

$con->close();
?>

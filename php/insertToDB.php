<meta charset="utf-8">
<?php
     ini_set("display_errors", 1); 


//mysql연결
	$con = mysqli_connect('localhost','rlawlsdnjswk','jina4398!','rlawlsdnjswk');

   if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    } 
    else{
        echo "My sql 접속완료 <br>";
    }


		$date = $_POST['sendDate'];
		$member = $_POST['member'];
		$status = $_POST['status'];
		$reason =$_POST['reason'];	

	if($member==""){
		echo "에러";
		return;
	}

$searchQuery = "SELECT * FROM $date WHERE member = '$member'";
$result = mysqli_query($con,$searchQuery);

//이미 입력된 DB가 있을경우 UPDATE
if ( mysqli_num_rows($result) > 0 ) {
$query = "UPDATE $date
SET status= '$status', reason= '$reason'
WHERE member = '$member'";
}
//없을경우 INSERT
else{
$query = "INSERT INTO $date (member, status, reason)
VALUES ('$member','$status','$reason')";
}


if (mysqli_query($con,$query)) {
echo "성공";
}
else{
echo "에러";
	}
$con->close();
?>

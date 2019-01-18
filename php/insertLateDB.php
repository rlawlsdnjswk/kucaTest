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
		$time = $_POST['sendTime'];
	

	if($member==""){
		echo "에러";
		return;
	}

$searchQuery = "SELECT * FROM $date WHERE member = '$member'";
$searchDelayQuery = "SELECT status FROM $date WHERE member = '$member'AND status =  '늦참' ";
$searchAttendQuery = "SELECT status FROM $date WHERE member = '$member'AND status =  '참석' ";
$searchDelayCompleteQuery = "SELECT status FROM $date WHERE member = '$member'AND status =  '늦참완료' ";

$delayResult = mysqli_query($con,$searchDelayQuery);
$delayCompleteResult = mysqli_query($con,$searchDelayCompleteQuery);
$attendResult = mysqli_query($con,$searchAttendQuery);
$result = mysqli_query($con,$searchQuery);

//늦참이었을 경우 
if ( mysqli_num_rows($delayResult) > 0 ) {
	
	$query = "UPDATE $date
SET status= '늦참완료',
	reason= '$time'
WHERE member = '$member'";
	
	
}
else if( mysqli_num_rows($delayCompleteResult) > 0 ){
$query = "UPDATE $date
SET status= '늦참완료',
WHERE member = '$member'";
}
else if( mysqli_num_rows($attendResult) > 0 ){
$query = "UPDATE $date
SET status= '참석',
WHERE member = '$member'";
}
else if( mysqli_num_rows($result) > 0 ){
$query = "UPDATE $date
SET status= '지각',
	reason= '$time'
WHERE member = '$member'";
}

//없을경우 INSERT
else{
$query = "INSERT INTO $date (member, status,reason)
VALUES ('$member','지각','$time')";
}


if (mysqli_query($con,$query)) {
echo "성공";
}
else{
echo "에러";
	}
$con->close();
?>

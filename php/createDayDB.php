<?php
$servername = "localhost";
$username = "rlawlsdnjswk";
$password = "jina4398!";
$dbname = "rlawlsdnjswk";
     ini_set("display_errors", 1); 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
	
  $query = "CREATE TABLE Date0216 (
member VARCHAR(30) PRIMARY KEY,
status VARCHAR(30) ,
reason VARCHAR(30) ,
reg_date TIMESTAMP
)";
                     

	if (mysqli_query($conn,$query)) {
		echo "<script>	alert(\"정상적으로 입력되었습니다.\");</script>";
    }   



$conn->close();
?>

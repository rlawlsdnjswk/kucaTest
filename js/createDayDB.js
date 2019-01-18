	for (var i = 0; i < 4; i++) {
		if (i < 10) {
			i = "0" + i;
		}

		var sendingData = "Date01" + i;

		sendingData = JSON.stringify(sendingData);

		console.log(sendingData);


		$.ajax({
			url: "../php/createDayDB.php",
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: {
				param: "SIbal"
			},
			success: function (data) {
				console.log("완료! ");
				console.log(data);


			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);
			}
		});

	}

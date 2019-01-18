var memberData = "";
var today = new Date(); //오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var login = false;
var userName = "";
var getData = "";
var date = "";

var dateJson = {
	"912b9e0": "Date0108",
	"efc7254": "Date0110",
	"d6f0738": "Date0112",
	"de153b4": "Date0115",
	"c1bed6f": "Date0117",
	"3c838aa": "Date0119",
	"87b6644": "Date0122",
	"3be0fd8": "Date0124",
	"ff592fa": "Date0126",
	"9bfe5db": "Date0129",
	"edfba1d": "Date0131",
	"e9616ca": "Date0202",
	"2271c8f": "Date0207",
	"1d56ef3": "Date0209",
	"2aefde8": "Date0211",
	"b8fc7b0": "Date0212",
	"437e6eb": "Date0213",
	"ba69ad5": "Date0214",
	"c246faf": "Date0215",
	"1b38024": "Date0216"
};

$(document).ready(function () {

	Kakao.init('549ad08092a2e0b322e405512825b0d5');

	checkToken();
	receivingData();

	//접속 플랫폼 확인
	mobileCheck();

	$(".loginBtn").bind("click", loginWithKakao);

	if (memberData.length < 3) {
		$.ajax({
			url: "../js/memberList.json",
			type: 'GET',
			dataType: 'JSON',
			contentType: 'application/json',

			success: function (data) {
				console.log("완료! 응답 : ");
				memberData = data.member;
				memberList = data.member['list'];

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);
			}
		});
	} else {}

	// 사용할 앱의 JavaScript 키를 설정해 주세요.

	function loginWithKakao() { // 로그인 창을 띄웁니다.
		Kakao.Auth.login({
			success: function (authObj) {

				Kakao.API.request({

					url: '/v1/user/me',

					success: function (res) {

						userName = res.properties['nickname'];
						userName = validateRealName(userName);
						console.log(res.id); //<---- 콘솔 로그에 id 정보 출력(id는 res안에 있기 때문에  res.id 로 불러온다)
						console.log(userName); //<---- 콘솔 로그에 닉네임 출력(properties에 있는 nickname 접근 

						$(".submit").attr("userName", userName);
						$(".userName").text(userName);
						login = true;
						$(".loginBtn").hide();
						attend();
					}
				})
			},
			fail: function (err) {
				alert(JSON.stringify(err));
			}
		});
	};
});

//로그인에 사용된 토큰이 남아있는지 체크
function checkToken() {

	var userToken = Kakao.Auth.getAccessToken();

	if (userToken) {
		Kakao.API.request({

			url: '/v1/user/me',

			success: function (res) {


				userName = res.properties['nickname'];
				userName = validateRealName(userName);
				console.log(res.id); //<---- 콘솔 로그에 id 정보 출력(id는 res안에 있기 때문에  res.id 로 불러온다)
				console.log(userName); //<---- 콘솔 로그에 닉네임 출력(properties에 있는 nickname 접근 

				$(".submit").attr("userName", userName);
				$(".userName").text(userName);
				login = true;
				$(".loginBtn").hide();
				attend();

			}
		})
	} else {
		$(".loginBtn").show();
	}
}
//카카오톡 로그아웃(현재 구현안됨)
function logout() {
	Kakao.Auth.logout(function () {
		setTimeout(function () {
			$(".submit").attr("userName", "");
			$(".userName").text("");
			$(".logoutBtn").hide();
			$(".hello").hide();
			$(".alert").hide();

			$(".loginBtn").fadeIn(2000);
			$("#manittoName").text("");
		}, 300);
	});
}

//접속 환경 판별
function mobileCheck() {
	var filter = "win16|win32|win64|mac";
	var vWebType = "";
	var onlineBase = navigator.userAgent;

	if (navigator.platform) {

		if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {

			//			if (onlineBase.indexOf("KAKAOTALK") > -1) {
			//
			//			} else {
			//				window.location.href = "https://cafe.naver.com/kuca1979";
			//			}
			vWebType = "MOBILE";
		} else {
			vWebType = "PC";
			window.location.href = "https://cafe.naver.com/kuca1979";
		}
	}
}

//실명인지 아닌지 판별
function validateRealName(name) {

	if (typeof (memberData[name]) == "undefined") {
		return;
	} else if (typeof (memberData[name]) != "number") {

		return memberData[name];
	} else {
		return name;
	}
}

//출석체크
function attend() {

	console.log(login);
	if (login) {

		if (memberData[userName] == null || memberData[userName] == "" && memberData[userName] != 0) {
			alert("아직 합주단원이 아닙니다. 운영진에게 연락하세요");
			return;
		} else {

		}

		var hour = today.getHours();
		var minute = today.getMinutes();
		var minuteStr = "";
		var connectUrl = "";

		if (minute < 10) {
			minuteStr = "0" + minute.toString();
		} else {
			minuteStr = minute.toString();
		}
		console.log(minuteStr);

		$("#sendDate").val(date);
		$("#senderName").val(userName);
		$("#sendTime").val(hour + ":" + minuteStr);
		console.log($("#sendDate").val());
		console.log($("#senderName").val());
		console.log($("#sendTime").val());


		if (hour == 13 && minute <= 30) {
			connectUrl = "../php/insertAttendDB.php";
			connectAjax();
		} else if (hour >= 14 && hour < 18) {
			connectUrl = "../php/insertLateDB.php";
			connectAjax();
		} else {
			alert("출석시간이 아닙니다.");
			return;
		}




		console.log(connectUrl);

		function connectAjax() {
			$.ajax({
				url: connectUrl,
				type: "post",
				data: $("form").serialize(),
				success: function (data) {
					alert("출석되었습니다");
					console.log("ajax를 통한 출석완료");
					window.location.href = "http://healthrun.net/working/manitto/html/main.html";
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);
					alert("오류가 발생했습니다. 운영진에게 문의하세요");
				}
			});
		}
	} else {}
}

//get방식으로 온 데이터를 가공
function receivingData() {
	// 파라메터 정보가 저장될 오브젝트
	// common.js 같은 모든 페이지에서 로딩되는 js 파일에 넣어두면 됨.
	getData = function (key) {
		var _parammap = {};
		document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			function decode(s) {
				return decodeURIComponent(s.split("+").join(" "));
			}
			_parammap[decode(arguments[1])] = decode(arguments[2]);
		});
		return _parammap[key];
	};


	date = getData("date");

	date = dateJson[date];
	console.log(date);
	if (typeof (date) == "undefined") {
		alert("비정상적인 접근입니다");
		window.location.href = "http://healthrun.net/working/manitto/html/main.html";
		return;
	}
}

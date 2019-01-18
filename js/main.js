var memberData = "";
var today = new Date(); //오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date(); //today의 Date를 세어주는 역할
var login = false;
var userName = "";
var readableUser = ["이현주", "최윤주", "송령신", "이용규", "김진원", "김창민"] //불참,지각 등 이유를 열람 가능한 사람

$(document).ready(function () {

	Kakao.init('549ad08092a2e0b322e405512825b0d5');
	//접속 플랫폼 확인
	mobileCheck();
	checkToken();
	buildCalendar();

	$(".attendList").bind("click", function () {
		$(".attendListBox").slideToggle(400);
		$(".folderBox").slideToggle();
		$(".popupFoot").slideToggle();
		$(".attendListBox").scrollTop(0);


		openAttenList();
	});
	$(".member").on("click", popupAbsentReason);
	$(".submit").bind("click", submitName);
	$(".submit").bind("click", submitName);
	$(".loginBtn").bind("click", loginWithKakao);
	$(".logoutBtn").bind("click", logout);
	$("#addReasonBtn").bind("click", openWriteReason);
	$("#sendReasonBtn").bind("click", sendReason);
	$("#attendBtn").bind("click", attend);
	$("table").delegate(".day", "click", checkDayAttend);
	$("#calcelReasonBtn").bind("click", function () {
		$(".popup").hide();
	});

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
	} else {

	}
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
						$(".loginBtn").hide();
						$(".logoutBtn").fadeIn(2000);
						$(".hello").fadeIn(2000);
						$("#calendar").fadeIn(2000);
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
				$(".loginBtn").hide();
				$(".logoutBtn").fadeIn(1000);
				$(".hello").fadeIn(1000);
				$("#calendar").fadeIn(1000);
			},

			fail: function (res) {
				$(".loginBtn").show();

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

//마니또 보기 클릭 시 마니또 출력
function submitName() {
	var name = $(".submit").attr("userName");

	if (memberData[name] == null || memberData[name] == "" && memberData[name] != 0) {
		alert("아직 합주단원이 아닙니다. 운영진에게 연락하세요");
		return;
	} else {
		var manittoName = memberList[memberData[name]];
		if (manittoName) {
			console.log(manittoName);
			console.log(memberData[name]);
			$("#manittoName").text(manittoName);

			$(".hello").hide();
			$(".alert").fadeIn(3000);
		} else {
			alert("아직 마니또가 없습니다. 운영진에게 연락하세요");

		}
	}
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

//달력관련 함수들
function prevCalendar() { //이전 달
	// 이전 달을 today에 값을 저장하고 달력에 today를 넣어줌
	//today.getFullYear() 현재 년도//today.getMonth() 월  //today.getDate() 일 
	//getMonth()는 현재 달을 받아 오므로 이전달을 출력하려면 -1을 해줘야함
	today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
	buildCalendar(); //달력 cell 만들어 출력 
}

function nextCalendar() { //다음 달
	// 다음 달을 today에 값을 저장하고 달력에 today 넣어줌
	//today.getFullYear() 현재 년도//today.getMonth() 월  //today.getDate() 일 
	//getMonth()는 현재 달을 받아 오므로 다음달을 출력하려면 +1을 해줘야함
	today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
	buildCalendar(); //달력 cell 만들어 출력
}

function buildCalendar() { //현재 달 달력 만들기
	var doMonth = new Date(today.getFullYear(), today.getMonth(), 1);
	//이번 달의 첫째 날,
	//new를 쓰는 이유 : new를 쓰면 이번달의 로컬 월을 정확하게 받아온다.     
	//new를 쓰지 않았을때 이번달을 받아오려면 +1을 해줘야한다. 
	//왜냐면 getMonth()는 0~11을 반환하기 때문
	var lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	//이번 달의 마지막 날
	//new를 써주면 정확한 월을 가져옴, getMonth()+1을 해주면 다음달로 넘어가는데
	//day를 1부터 시작하는게 아니라 0부터 시작하기 때문에 
	//대로 된 다음달 시작일(1일)은 못가져오고 1 전인 0, 즉 전달 마지막일 을 가져오게 된다
	var tbCalendar = document.getElementById("calendar");
	//날짜를 찍을 테이블 변수 만듬, 일 까지 다 찍힘
	var tbCalendarYM = document.getElementById("tbCalendarYM");
	//테이블에 정확한 날짜 찍는 변수
	//innerHTML : js 언어를 HTML의 권장 표준 언어로 바꾼다
	//new를 찍지 않아서 month는 +1을 더해줘야 한다. 
	tbCalendarYM.innerHTML = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월";

	/*while은 이번달이 끝나면 다음달로 넘겨주는 역할*/
	while (tbCalendar.rows.length > 2) {
		//열을 지워줌
		//기본 열 크기는 body 부분에서 2로 고정되어 있다.
		tbCalendar.deleteRow(tbCalendar.rows.length - 1);
		//테이블의 tr 갯수 만큼의 열 묶음은 -1칸 해줘야지 
		//30일 이후로 담을달에 순서대로 열이 계속 이어진다.
	}
	var row = null;
	row = tbCalendar.insertRow();
	//테이블에 새로운 열 삽입//즉, 초기화
	var cnt = 0; // count, 셀의 갯수를 세어주는 역할
	// 1일이 시작되는 칸을 맞추어 줌
	for (i = 0; i < doMonth.getDay(); i++) {
		/*이번달의 day만큼 돌림*/
		cell = row.insertCell(); //열 한칸한칸 계속 만들어주는 역할
		cnt = cnt + 1; //열의 갯수를 계속 다음으로 위치하게 해주는 역할
	}
	/*달력 출력*/
	for (i = 1; i <= lastDate.getDate(); i++) {
		//1일부터 마지막 일까지 돌림
		cell = row.insertCell(); //열 한칸한칸 계속 만들어주는 역할
		cell.innerHTML = i; //셀을 1부터 마지막 day까지 HTML 문법에 넣어줌
		cell.setAttribute("class", "day");
		cnt = cnt + 1; //열의 갯수를 계속 다음으로 위치하게 해주는 역할
		if (cnt % 7 == 1) { /*일요일 계산*/
			//1주일이 7일 이므로 일요일 구하기
			//월화수목금토일을 7로 나눴을때 나머지가 1이면 cnt가 1번째에 위치함을 의미한다
			cell.innerHTML = "<font color=#F79DC2>" + i
			//1번째의 cell에만 색칠
		}
		if (cnt % 7 == 0) { /* 1주일이 7일 이므로 토요일 구하기*/
			//월화수목금토일을 7로 나눴을때 나머지가 0이면 cnt가 7번째에 위치함을 의미한다
			cell.innerHTML = "<font color=lightskyblue>" + i
			//7번째의 cell에만 색칠
			row = calendar.insertRow();
			//토요일 다음에 올 셀을 추가
		}



		if (cnt % 7 == 1 || cnt % 7 == 2 || cnt % 7 == 4 || cnt % 7 == 6) {
			cell.setAttribute("class", "noPractice");
		}
		/*오늘의 날짜에 노란색 칠하기*/
		if (today.getFullYear() == date.getFullYear() &&
			today.getMonth() == date.getMonth() &&
			i == date.getDate()) {
			//달력에 있는 년,달과 내 컴퓨터의 로컬 년,달이 같고, 일이 오늘의 일과 같으면
			cell.bgColor = "#FAF58C"; //셀의 배경색을 노랑으로 
			cell.classList.add("today");
		}
		//2월 2번쨋주에서 noPractice 삭제
		if (today.getMonth() == 1) {
			if (cnt == 10) {
				cell.setAttribute("class", "noPractice");
			}
			if (cnt == 16 || cnt == 18 || cnt == 20) {
				cell.setAttribute("class", "day");
			}
			if (cnt == 21) {
				cell.classList.add("dDay");
				cell.innerHTML = "<font color=crimson>" + i;
			}
			if (cnt > 21) {
				cell.setAttribute("class", "noPractice");
			}
		}
		if (today.getMonth() == 0) {
			if (cnt < 5) {
				cell.setAttribute("class", "noPractice");
			}
		}
		if (today.getMonth() != 1 && today.getMonth() != 0) {
			cell.setAttribute("class", "noPractice");
		}
	}
}

//출첵 박스 팝업
function checkDayAttend() {


	//기타사유란 숨김
	$(".popupBody div").eq(0).show();
	$(".popupBody div").eq(2).hide();

	$(".attendListBox").hide();
	$(".folderBox").show();
	$(".popupFoot").show();
	$(".member").attr("class", "member");


	//클릭한 년 월 처리
	$(".yearMonthDate").text($("#tbCalendarYM").text().substr(6));
	$(".dayDate").text($(this).text() + "일");

	var month = $("#tbCalendarYM").text().substr(6, 1);
	var day = $(this).text();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	var selectDay = month + day;
	$("#PopupDiv").attr("date", selectDay);


	//팝업 정보 렌더
	renderDayInfo(selectDay);


	var popup = document.getElementById('PopupDiv');
	var closeBtn = document.getElementById("dayPopupCloseBtn");
	var span = document.getElementsByClassName("close")[0];

	popup.style.display = "block";
	//버튼 이벤트 -------------------------------------
	span.onclick = function () {
		popup.style.display = "none";
	}
	closeBtn.onclick = function (event) {
		popup.style.display = "none";
	}

}

//클릭 한 날 정보를 팝업에 렌더
function renderDayInfo(date) {

	var date = "Date" + date;
	var notice = $(".popupBody p").first();
	notice.text("공지 불러오는중...");
	$("#popupDate").val(date);
	$.ajax({
		url: "../php/selectDB.php",
		type: "post",
		data: $("form").serialize(),
		success: function (data) {
			console.log("완료!");
			console.log(data);
			if (data.length < 1) {
				notice.text("공지사항이 없습니다");
			} else {
				notice.text(data.toString());
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);


		}
	});




}

//결석 사유 팝업띄우는 함수
function popupAbsentReason() {

	//권한 있는 사람이 아닐경우 생략
	if (readableUser.indexOf(userName) < 1) {
		return;
	}



	if ($(this).hasClass("quit") || $(this).hasClass("absent") || $(this).hasClass("absentComplete") || $(this).hasClass("delay") || $(this).hasClass("late")) {

		var status = $(this).attr("status");
		var reason = $(this).attr("reason");
		$(".detailPopup").text(status + ":" + reason);
		$(".detailPopup").show();
		$(".detailPopup").fadeOut(1500);
	}
}

//기타 사유 작성 누를 시 입력 창 오픈
function openWriteReason() {

	$(".popupBody div").eq(0).hide();
	$(".popupBody div").eq(2).show();
	$("#addReasonInput").val("");

}

//기타사유 작성 후 확인 누를 시 ajax통한 Db전송
function sendReason() {

	if (userName == "") {
		alert("등록에 실패했습니다. 홈페이지를 새로고침 해주세요");
		return;
	}

	var date = "Date" + $("#PopupDiv").attr("date");
	$("#senderName").val(userName);
	$("#sendDate").val(date);

	var yes = confirm("정말 등록하시겠습니까?");
	if (yes == true) {
		$.ajax({
			url: "../php/insertToDB.php",
			type: "post",
			data: $("form").serialize(),
			success: function (data) {
				console.log("완료!");
				alert("등록되었습니다.");
				$(".popup").hide();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);
				alert("등록에 실패했습니다. 홈페이지를 새로고침 해주세요");
				$(".popup").hide();

			}
		});
	} else {
		return;
	}

}

//DB조회를 통한 출석 현황 멤버클래스 조정
function openAttenList() {

	var date = "Date" + $("#PopupDiv").attr("date");
	$("#sendDate").val(date);

	$.ajax({
		url: "../php/selectAttendDB.php",
		type: "post",
		data: $("form").serialize(),
		success: function (data) {
			console.log(data);
			refineData(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);
		}
	});


	function refineData(data) {

		var firstData = data.split("/");
		var dataLength = firstData.length;
		var memberList = new Object;
		for (var i = 0; i < dataLength; i++) {

			var secondData = firstData[i].split("-");
			var memberName = secondData[0];
			var status = secondData[1];
			var reason = secondData[2];

			var $memberList = $(".member");
			var memberLength = $memberList.length;
			for (var p = 0; p < memberLength; p++) {
				if ($memberList.eq(p).text() == memberName) {

					var matchTarget = $memberList.eq(p);
					matchTarget.attr("status", status);
					matchTarget.attr("reason", reason);

					if (status == "지각") {
						matchTarget.addClass("late");
					} else if (status == "참석") {
						matchTarget.addClass("here");
					} else if (status == "조퇴") {
						matchTarget.addClass("quit");
					} else if (status == "불참") {
						matchTarget.addClass("absent");
					} else if (status == "늦참완료") {
						matchTarget.addClass("delayComplete");
					} else if (status == "늦참") {
						matchTarget.addClass("delay");
					}

				}
			}
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

//출석체크 버튼 누를 시 참석바뀜함수 (현재안씀-qr써서)
function attend() {

	var targetDate = "Date" + $("#PopupDiv").attr("date");
	$("#sendDate").val(targetDate);
	$("#senderName").val(userName);

	var hour = date.getHours();
	var minute = date.getMinutes();

	if (hour < 13 && minute < 30) {


	} else {

	}
	$.ajax({
		url: "../php/insertAttendDB.php",
		type: "post",
		data: $("form").serialize(),
		success: function (data) {
			//	alert("출석되었습니다");
			$(".popup").hide();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("에러 발생~~ \n" + textStatus + " : " + errorThrown);
			alert("오류가 발생했습니다. 운영진에게 문의하세요");
			$(".popup").hide();
		}
	});
}

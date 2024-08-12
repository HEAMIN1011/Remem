$(document).ready(function() {
	
	console.log(loginUserId);
	
	// 오늘 할일 전체 조회하는 ajax
	fetchTodoList();

	// 기존 메뉴 버튼 클릭 이벤트
	$('.menu-btn').on('click', function() {
		$('.swiper-rightslide').hide();
		const target = $($(this).data('target'));
		target.show();
	});

	// 팝업 설정 함수
	setupPopup('#profile-icon', '#profile-popup', '#close-profile-popup');
	setupPopup('#addfriend-icon', '#addfriend-popup', '#close-addfriend-popup');

	// 날짜 입력값 변경 이벤트
	$('#input_date').on('change', function(event) {
		console.log('input_date change event');
		console.log(event.target.value);

		// Ajax 2024-08-20 data로 담아서 -> 서버 자료 요청
		// 서버 param 2024-08-20  -> DB select * from date -> 사용자 전달
		// Ajax 전달받은 값을 확인 -> 각 input 요소에 value로 세팅
	});

	// 저장 버튼을 눌렀을 때!
	$('#addTodoButton').on('click', addTodo);

	// 입력값을 Enter 키로 추가
	$('#todoInput').on('keypress', function(event) {
		if (event.key === 'Enter') {
			$('#addTodoButton').click(); // Enter 누르면 button 입력한 것과 동일하게 처리
		}
	});
});


// 전체 할 일 조회 Ajax 요청
function fetchTodoList() {
	$.ajax({
		url: "/todoList/viewAll",
		type: "POST",
		data: { loginUserId: loginUserId },
		dataType: "json",
		success: function(response) {
			const todoList = $('#todoList');
			todoList.empty(); // 기존 리스트를 비움

			response.forEach(todo => {
				const li = $('<li>').attr('id', todo.todolistId);
				const checkbox = $('<input>', { type: 'checkbox' }).prop('checked', todo.todolistStatus === 'cmp');

				if (checkbox.prop('checked')) li.addClass('checked');

				checkbox.on('change', function() {
					handleCheckboxChange(this, li);
				});

				const textNode = document.createTextNode(todo.todolistContents);
				const removeButton = $('<button>').text('x').addClass('remove-btn').on('click', function() {
					if (confirm("삭제하시겠습니까?")) {
						removeTodoItem(li);
					}
				});

				li.append(checkbox, textNode, removeButton);
				todoList.append(li);
				$('#todoInput').val('');
			});
		},
		error: function() {
			alert("투두리스트 select 에러 발생");
		}
	});
}

// 체크박스 상태 변경 처리
function handleCheckboxChange(checkbox, li) {
	const status = $(checkbox).prop('checked') ? 'cmp' : 'reg';
	$.ajax({
		url: "/todoList/checkedOn",
		type: "POST",
		data: JSON.stringify({
			loginUserId: loginUserId,
			todoListId: li.attr('id'),
			todoListStatus: status
		}),
		contentType: 'application/json; charset=utf-8',
		success: function() {
			alert(`db 테이블 todoList_status 상태 ${status} 변경`);
			li.toggleClass('checked', $(checkbox).prop('checked'));
		},
		error: function() {
			alert("체크박스 상태 변경 에러 발생");
		}
	});
}

// 할 일 추가 처리
function addTodo() {
	const todoText = $('#todoInput').val().trim();
	if (todoText === '') {
		alert('할 일을 입력해주세용~');
		return;
	}
	//추가만하고 전체 조회하는 함수를 호출
	$.ajax({
		url: "/todoList/register",
		type: "POST",
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({
			loginUserId: loginUserId,
			todoText: todoText
		}),
		success: function(response) {
//			if (response > 0) {
//				const li = $('<li>').attr('id', response);
//				const checkbox = $('<input>', { type: 'checkbox' }).on('change', function() {
//					handleCheckboxChange(this, li);
//				});
//
//				const textNode = document.createTextNode(todoText);
//				const removeButton = $('<button>').text('x').addClass('remove-btn').on('click', function() {
//
//					if (confirm("삭제하시겠습니까?")) {
//						removeTodoItem(li);
//					}
//
//				});
//
//				li.append(checkbox, textNode, removeButton);
//				$('#todoList').append(li);
//				$('#todoInput').val(''); // 저장 하려는 input clean 처리
//			}
		fetchTodoList();
		},
		error: function() {
			alert("에러 발생");
		}
	});
}

// 할 일 삭제 처리
function removeTodoItem(li) {
	// TODO: 삭제 Ajax 요청 필요
	console.log(li.attr('id')); //li의 id 값 가져오는 방법

	$.ajax({
		url: "/todoList/remove",
		type: "POST",
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({
			todoListId: li.attr('id'),
			loginUserId: loginUserId
		}),
		success: function(response) {
			//if (response > 0) {
				li.remove();
			//}
		},
		error: function() {
			alert("todoList 삭제 에러 발생");
		}

	});

}

// 팝업 설정 함수
function setupPopup(triggerId, popupId, closeId) {
	$(triggerId).on('click', function(event) {
		event.preventDefault();
		$(popupId).fadeIn();
	});

	$(closeId).on('click', function() {
		$(popupId).fadeOut();
	});

	$(popupId).on('click', function(event) {
		if ($(event.target).is(popupId)) {
			$(popupId).fadeOut();
		}
	});
}








//정민 파트
$(document).ready(function() {
	let currentDiaryEntry = null;
	
	//프로필 팝업창
	$('.menu-btn').on('click', function() {
		$('.swiper-rightslide').hide();
		$($(this).data('target')).show();
	});

	$('#profile-icon').on('click', function(event) {
		event.preventDefault();
		$('#profile-popup').fadeIn();
	});

	$('#close-profile-popup').on('click', function() {
		$('#profile-popup').fadeOut();
	});

	$('#profile-popup').on('click', function(event) {
		if ($(event.target).is('#profile-popup')) {
			$('#profile-popup').fadeOut();
		}
	});
	
	//주소 팝업창
	$('#open-address-popup').on('click', function(event) {
		event.preventDefault();
		$('#address-popup').fadeIn();
	});

	$('#close-address-popup').on('click', function() {
		$('#address-popup').fadeOut();
	});

	$('#address-popup').on('click', function(event) {
		if ($(event.target).is('#address-popup')) {
			$('#address-popup').fadeOut();
		}
	});
	
	//비밀번호 팝업창
	$('#open-password-popup').on('click', function(event) {
		event.preventDefault();
		$('#password-popup').fadeIn();
	});

	$('#close-password-popup').on('click', function() {
		$('#password-popup').fadeOut();
	});

	$('#password-popup').on('click', function(event) {
		if ($(event.target).is('#password-popup')) {
			$('#password-popup').fadeOut();
		}
	});
	
	//친구추가 팝업창
	$('#addfriend-icon').on('click', function(event) {
		event.preventDefault();
		$('#addfriend-popup').fadeIn();
	});

	$('#close-addfriend-popup').on('click', function() {
		$('#addfriend-popup').fadeOut();
	});

	$('#addfriend-popup').on('click', function(event) {
		if ($(event.target).is('#addfriend-popup')) {
			$('#addfriend-popup').fadeOut();
		}
	});
	
	//일기추가 팝업창
	/*$('.insert-btn').on('click', function(event) {
		event.preventDefault();
		$('#frm-diary')[0].reset();
		$('#save-diary-popup').show();
		currentDiaryEntry = null;
		$('#diary-popup').fadeIn();
	});

	$('#close-diary-popup').on('click', function(event) {
		event.preventDefault();
		$('#diary-popup').fadeOut();
	});

	$('#diary-popup').on('click', function(event) {
		if ($(event.target).is('#diary-popup')) {
			$('#diary-popup').fadeOut();
		}
	});*/

	// 일기 추가 및 수정
	$('#save-diary-popup').on('click', function(event) {
		event.preventDefault();

		const date = $('#diary-date').val();
		const title = $('#diary-title').val();
		const content = $('#diary-content').val();

		if (date && title && content) {
			if (currentDiaryEntry) {
				currentDiaryEntry.find('h3').text(title);
				currentDiaryEntry.find('.diary-date').text(date);
				currentDiaryEntry.find('.diary-content').text(content);
			} else {
				const diaryEntry = `
                            <div class="diary-entry">
                                <h3>${title}</h3>
                                <span class="diary-date">${date}</span>
                                <div class="diary-footer">
                                    <button class="diary-view-btn" id="view-diary">확인</button>
                                    <button class="diary-modify-btn" id="modify-diary">수정</button>
                                    <button class="diary-remove-btn" id="remove-diary">삭제</button>
                                </div>
                                <p class="diary-content" style="display:none;">${content}</p>
                            </div>
                        `;
				$('.diary-container').append(diaryEntry);
			}

			$('#frm-diary')[0].reset();
			currentDiaryEntry = null;
			$('#diary-popup').fadeOut();
		} else {
			alert('모든 필드를 작성해 주세요.');
		}
	});

	// 일기 수정
	$(document).on('click', '.diary-modify-btn', function() {
		currentDiaryEntry = $(this).closest('.diary-entry');
		const title = currentDiaryEntry.find('h3').text();
		const date = currentDiaryEntry.find('.diary-date').text();
		const content = currentDiaryEntry.find('.diary-content').text();

		$('#diary-date').val(date);
		$('#diary-title').val(title);
		$('#diary-content').val(content);
		$('#save-diary-popup').show();

		$('#diary-popup').fadeIn();
	});

	// 일기 확인
	$(document).on('click', '.diary-view-btn', function() {
		currentDiaryEntry = $(this).closest('.diary-entry');
		const title = currentDiaryEntry.find('h3').text();
		const date = currentDiaryEntry.find('.diary-date').text();
		const content = currentDiaryEntry.find('.diary-content').text();

		$('#diary-date').val(date);
		$('#diary-title').val(title);
		$('#diary-content').val(content);
		$('#save-diary-popup').hide();

		$('#diary-popup').fadeIn();
	});

	// 일기 삭제
	$(document).on('click', '.diary-remove-btn', function() {
		if (confirm('정말로 삭제하시겠습니까?')) {
			$(this).closest('.diary-entry').remove();
		}
	});
});

// 친구 추가 팝업창 필터
function filterFriends() {
	const input = document.getElementById('name-input').value.toLowerCase();
	const table = document.getElementById('addfriend-list');
	const rows = table.getElementsByTagName('tr');

	for (let i = 0; i < rows.length; i++) {
		const td = rows[i].getElementsByTagName('td')[0];
		if (td) {
			const textValue = td.textContent || td.innerText;
			if (textValue.toLowerCase().indexOf(input) > -1) {
				rows[i].style.display = "";
			} else {
				rows[i].style.display = "none";
			}
		}
	}
}

// 주소 변경
function sample6_execDaumPostcode() {
        new daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    document.getElementById("sample6_extraAddress").value = extraAddr;
                
                } else {
                    document.getElementById("sample6_extraAddress").value = '';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById('sample6_postcode').value = data.zonecode;
                document.getElementById("sample6_address").value = addr;
                // 커서를 상세주소 필드로 이동한다.
                document.getElementById("sample6_detailAddress").focus();
            }
        }).open();
    }

//혜민 파트 ****************************************************

/* 버튼 클릭 없이도 할일 조회 */









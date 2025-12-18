//#header gnb 이동하기
$(function () {
    let headerH = $('#header').outerHeight();

    $('.gnb li a').on('click', function (e) {
        e.preventDefault();

        let target = $(this).attr('href');
        let offsetTop = $(target).offset().top - headerH;

        $('html, body').animate({ scrollTop: offsetTop }, 1000);
    });
});



// 메인 배너 슬라이드 
$(function () {
            $('.banner-slider').slick({
                autoplay: true,      //자동시작 
                autoplaySpeed: 3000, //자동넘기기 시간
                speed: 1500,         //모션 시간 
                arrows: true,        //화살표
                prevArrow: $('.banner-prev'), // 좌 (이전) 화살표만 변경 (선택자 혹은 $(element))
                nextArrow: $('.banner-next'), // 우 (다음) 화살표만 변경 (선택자 혹은 $(element))

                // 여기 부분 변경 
                fade: false,          //페이드 대신 슬라이드
                cssEase: 'ease', // 슬라이드 전환 속도 기본값 : ease
                slidesToShow: 1,     //한번에 보여줄 사진의 갯수(int)
                slidesToScroll: 1,   //한번에 넘길 사진의 갯수(int)
                infinite: true,     //무한반복 
                dots: true         //네비게이션버튼 (boolean) -default:false
            });
        });

(function() {
    // --- 봉사활동 섹션 전용 스크립트 ---
    
    // Lucide Icons 아이콘 갱신 (이미 로드되어 있다고 가정)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // DOM 요소 선택 (변경된 ID/Class 사용)
    const calendarDates = document.querySelectorAll('.vol-calendar-dates div');
    const scheduleHeader = document.getElementById('vol-schedule-header');
    const scheduleList = document.getElementById('vol-schedule-list');
    const toggleListButton = document.getElementById('vol-toggle-list-button');

    const regionSelectBox = document.getElementById('vol-region-select-box');
    const regionOptions = document.getElementById('vol-region-options');
    const toggleRegionList = document.getElementById('vol-toggle-region-list');
    const selectedRegionText = document.getElementById('vol-selected-region-text');
    const dropdownArrow = document.getElementById('vol-dropdown-arrow');
    const categoryFilters = document.getElementById('vol-category-filters');

    // 상태 변수
    let currentSelectedRegion = "전체";
    let currentSelectedCategory = "전체";
    let currentlySelectedDate = "2025-11-20"; // 초기 선택 날짜
    let isListExpanded = false;

    // 일정 데이터
    const allSchedules = {
        '2025-11-20': [
            { id: 1, title: "활력 충전! 유기견 산책 봉사", description: "대형견 위주 산책 및 급수 봉사입니다.", time: "14:00 - 16:00", location: "서울 구로 보호소", needed: "5명 필요", type: "산책", region: "서울", difficulty: "하" },
            { id: 2, title: "보송보송 냥이 목욕/미용 보조", description: "고양이 미용 및 환경 정리 보조입니다.", time: "16:00 - 18:00", location: "경기 광주 임시 쉼터", needed: "2명 필요", type: "미용", region: "경기", difficulty: "중" },
            { id: 3, title: "이동 봉사 차량 운전 보조", description: "아이들 병원 이송 및 픽업 보조입니다.", time: "10:00 - 12:00", location: "서울 강남 이송 센터", needed: "1명 필요", type: "이동", region: "서울", difficulty: "중" },
            { id: 4, title: "보호소 환경 대청소", description: "견사 및 생활 공간 대청소 및 소독 봉사입니다.", time: "09:00 - 12:00", location: "경기 광주 임시 쉼터", needed: "10명 필요", type: "청소", region: "경기", difficulty: "상" },
            { id: 5, title: "입양 홍보 포스터 디자인", description: "온라인 입양 포스터 디자인 작업입니다.", time: "18:00 - 20:00", location: "온라인", needed: "1명 필요", type: "기타", region: "전체", difficulty: "중" }
        ],
        '2025-11-23': [
            { id: 6, title: "보호소 환경 대청소", description: "견사 및 생활 공간 대청소 및 소독 봉사입니다.", time: "09:00 - 12:00", location: "부산 해운대 센터", needed: "10명 필요", type: "청소", region: "부산", difficulty: "상" },
            { id: 7, title: "입양 가족 맞이 사진 촬영", description: "입양을 기다리는 아이들 프로필 사진 촬영 봉사입니다.", time: "13:00 - 15:00", location: "부산 해운대 센터", needed: "1명 필요", type: "사진", region: "부산", difficulty: "하" }
        ],
        '2025-11-29': [
            { id: 8, title: "입양 가족 맞이 사진 촬영", description: "입양을 기다리는 아이들 프로필 사진 촬영 봉사입니다.", time: "13:00 - 15:00", location: "제주 시청 보호소", needed: "1명 필요", type: "사진", region: "제주", difficulty: "하" }
        ]
    };

    // --- 유틸리티 함수 ---
    function formatDateHeader(dateString) {
        if (!dateString) return "날짜를 선택해 주세요";
        const dateObj = new Date(dateString);
        const utcDate = new Date(dateObj.getTime() + (9 * 60 * 60 * 1000)); // KST 보정
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[utcDate.getDay()];
        return `${utcDate.getMonth() + 1}월 ${utcDate.getDate()}일 (${dayOfWeek}) 일정`;
    }

    // --- 필터링 로직 ---
    function filterSchedules(dateString) {
        let list = allSchedules[dateString] || [];
        if (currentSelectedRegion !== "전체") {
            list = list.filter(item => item.region === currentSelectedRegion);
        }
        if (currentSelectedCategory !== "전체") {
            list = list.filter(item => item.type === currentSelectedCategory);
        }
        return list;
    }

    // --- 일정 패널 업데이트 ---
    function updateSchedulePanel(dateString) {
        if(!scheduleHeader || !scheduleList) return;

        scheduleHeader.innerHTML = `<span class="flex items-center"><i data-lucide="calendar" class="w-5 h-5 mr-2 text-[#cc0000]"></i> ${formatDateHeader(dateString)}</span>`;
        
        const scheduleData = filterSchedules(dateString);

        if (scheduleData.length === 0) {
            const regionName = selectedRegionText.textContent.trim().replace(/[\uD800-\uDBFF\uDC00-\uDFFF]/g, '').trim();
            const activeCategoryButton = categoryFilters.querySelector('.vol-pill-button.active');
            const categoryName = activeCategoryButton ? activeCategoryButton.textContent.trim().replace(/[\uD800-\uDBFF\uDC00-\uDFFF]/g, '').trim() : '전체';

            scheduleList.innerHTML = `
                <div class="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    😅 선택하신 조건 (<span class="font-extrabold text-blue-500">${regionName}</span> / <span class="font-extrabold text-blue-500">${categoryName}</span>)에 맞는 봉사 일정이 <span class="font-extrabold text-blue-500">없어요.</span><br>다른 날짜나 필터를 선택해 보세요.
                </div>
            `;
            if(toggleListButton) toggleListButton.classList.add('hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        scheduleList.innerHTML = '';
        scheduleData.forEach((item, index) => {
            const difficultyColor = item.difficulty === '하' ? 'bg-green-100 text-green-600' :
                                    item.difficulty === '중' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-red-100 text-red-600';
            
            const isHidden = index >= 2 && !isListExpanded;
            
            const cardHtml = `
                <div class="vol-schedule-card bg-white p-4 border border-gray-100 rounded-lg ${isHidden ? 'vol-hidden-card' : ''}" data-schedule-id="${item.id}">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div class="flex-1 pr-4 mb-3 sm:mb-0">
                            <h3 class="text-lg font-semibold mb-0.5">${item.title}</h3>
                            <p class="text-gray-500 text-sm">${item.description}</p>
                        </div>
                        <a href="#" class="vol-cta-button">신청하기</a>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm mt-3 pt-3 border-t border-gray-100">
                        <span class="vol-info-tag text-gray-700 bg-gray-50 flex items-center"><i data-lucide="clock" class="w-3.5 h-3.5 mr-1 text-[#cc0000]"></i> ${item.time}</span>
                        <span class="vol-info-tag text-gray-700 bg-gray-50 flex items-center"><i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1 text-[#cc0000]"></i> ${item.region}</span>
                        <span class="vol-info-tag ${difficultyColor} flex items-center"><i data-lucide="users" class="w-3.5 h-3.5 mr-1"></i> ${item.needed}</span>
                    </div>
                </div>
            `;
            scheduleList.insertAdjacentHTML('beforeend', cardHtml);
        });

        if(toggleListButton) {
            if (scheduleData.length > 2) {
                toggleListButton.classList.remove('hidden');
                toggleListButton.onclick = toggleScheduleList; // 핸들러 연결
                toggleListButton.innerHTML = isListExpanded 
                    ? `봉사 일정 간략히 보기 <i data-lucide="chevron-up" class="w-5 h-5 ml-1 transition-transform"></i>`
                    : `더 많은 봉사 일정 보기 (${scheduleData.length - 2}개 더) <i data-lucide="chevron-down" class="w-5 h-5 ml-1 transition-transform"></i>`;
            } else {
                toggleListButton.classList.add('hidden');
            }
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 목록 확장/축소 토글 ---
    function toggleScheduleList() {
        isListExpanded = !isListExpanded;
        const cards = scheduleList.querySelectorAll('.vol-schedule-card');
        
        cards.forEach((card, index) => {
            if (index >= 2) {
                if (isListExpanded) {
                    card.classList.remove('vol-hidden-card');
                } else {
                    card.classList.add('vol-hidden-card');
                }
            }
        });
        
        // 버튼 텍스트 업데이트를 위해 재호출하지 않고 직접 수정
        const scheduleData = filterSchedules(currentlySelectedDate);
        if (isListExpanded) {
            toggleListButton.innerHTML = `봉사 일정 간략히 보기 <i data-lucide="chevron-up" class="w-5 h-5 ml-1 transition-transform"></i>`;
        } else {
            toggleListButton.innerHTML = `더 많은 봉사 일정 보기 (${scheduleData.length - 2}개 더) <i data-lucide="chevron-down" class="w-5 h-5 ml-1 transition-transform"></i>`;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 이벤트 리스너 ---
    // 1. 캘린더 날짜 클릭
    calendarDates.forEach(dateElement => {
        const originalDate = dateElement.getAttribute('data-date');
        if (!originalDate) return;

        dateElement.addEventListener('click', () => {
            isListExpanded = false;
            document.querySelectorAll('.vol-calendar-dates .vol-selected-date').forEach(el => el.classList.remove('vol-selected-date'));
            dateElement.classList.add('vol-selected-date');
            
            currentlySelectedDate = originalDate;
            updateSchedulePanel(originalDate);
        });
    });
    
    // 2. 지역 드롭다운 토글
    if(toggleRegionList) {
        toggleRegionList.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const isHidden = regionOptions.classList.contains('hidden');
            if (isHidden) {
                regionOptions.classList.remove('hidden');
                dropdownArrow.classList.add('vol-rotate-180');
            } else {
                regionOptions.classList.add('hidden');
                dropdownArrow.classList.remove('vol-rotate-180');
            }
        });
    }

    // 3. 지역 선택 옵션 클릭
    if(regionOptions) {
        regionOptions.addEventListener('click', (event) => {
            const selectedLi = event.target.closest('li');
            if (selectedLi) {
                currentSelectedRegion = selectedLi.getAttribute('data-value');
                selectedRegionText.textContent = selectedLi.textContent.trim().replace(/[\uD800-\uDBFF\uDC00-\uDFFF]/g, '').trim(); 
                
                regionOptions.classList.add('hidden');
                dropdownArrow.classList.remove('vol-rotate-180');
                
                isListExpanded = false;
                updateSchedulePanel(currentlySelectedDate);
            }
        });
    }

    // 4. 카테고리 필터 클릭
    if(categoryFilters) {
        categoryFilters.addEventListener('click', (event) => {
            const target = event.target.closest('.vol-pill-button');
            if (target) {
                categoryFilters.querySelectorAll('.vol-pill-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('default');
                });

                target.classList.add('active');
                target.classList.remove('default');
                
                currentSelectedCategory = target.getAttribute('data-category');
                
                isListExpanded = false;
                updateSchedulePanel(currentlySelectedDate);
            }
        });
    }

    // 5. 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', (event) => {
        if (regionSelectBox && !regionSelectBox.contains(event.target)) {
            regionOptions.classList.add('hidden');
            if(dropdownArrow) dropdownArrow.classList.remove('vol-rotate-180');
        }
    });

    // 초기 실행
    updateSchedulePanel(currentlySelectedDate);

})(); // 즉시 실행 함수 끝


// 소통공간 tab 
 // 페이지 로드 후 실행
        window.addEventListener('DOMContentLoaded', function() {
            // Lucide 아이콘 초기화
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // 탭 버튼 클릭 이벤트
            const tabButtons = document.querySelectorAll('.community-tab-button');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // 모든 버튼에서 'see' 클래스 제거
                    tabButtons.forEach(btn => {
                        btn.classList.remove('see');
                    });
                    
                    // 클릭된 버튼에 'see' 클래스 추가
                    this.classList.add('see');
                    
                    // 탭 컨텐츠 전환
                    const tabName = this.getAttribute('data-tab');
                    const allContents = document.querySelectorAll('.tab-content');
                    
                    allContents.forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    const targetContent = document.getElementById('tab-' + tabName);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        });

//aside top 버튼 
$(function () {
    //맨 위 부드럽게 이동
    $(".aside button").click(function () {
        $("html,body").animate({
            // 세로위치 0
            scrollTop: '0'
            //1초동안
        }, 1000);
    });

    //일정 구간부터 버튼 나타나게 하기
    $(".aside button").hide();
    // 스크롤하면,
    $(window).scroll(function () {
        // 100보다 크면 보이고, 100보다 작으면 사라진다.
        if ($(this).scrollTop() > 100) {
            $(".aside button").fadeIn()
        } else {
            $(".aside botton").fadeOut()
        }
    });
});



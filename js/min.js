
        // Lucide Icons 초기화
        lucide.createIcons();

        // DOM 요소
        const calendarDates = document.querySelectorAll('.calendar-dates div');
        const scheduleHeader = document.getElementById('schedule-header');
        const scheduleList = document.getElementById('schedule-list');
        const toggleListButton = document.getElementById('toggle-list-button');

        const regionSelectBox = document.getElementById('region-select-box');
        const regionOptions = document.getElementById('region-options');
        const toggleRegionList = document.getElementById('toggle-region-list');
        const selectedRegionText = document.getElementById('selected-region-text');
        const dropdownArrow = document.getElementById('dropdown-arrow');
        const categoryFilters = document.getElementById('category-filters');

        // 상태 변수
        let currentSelectedRegion = "전체";
        let currentSelectedCategory = "전체";
        let currentlySelectedDate = "2025-11-20"; // 초기 선택 날짜 설정
        let isListExpanded = false;
        
        // 일정 데이터 (제공된 데이터보다 1개 더 추가하여 목록 확장 테스트)
        const allSchedules = {
            '2025-11-20': [
                { id: 1, title: "활력 충전! 유기견 산책 봉사", description: "대형견 위주 산책 및 급수 봉사입니다.", time: "14:00 - 16:00", location: "서울 구로 보호소", needed: "5명 필요", type: "산책", region: "서울", difficulty: "하" },
                { id: 2, title: "보송보송 냥이 목욕/미용 보조", description: "고양이 미용 및 환경 정리 보조입니다.", time: "16:00 - 18:00", location: "경기 광주 임시 쉼터", needed: "2명 필요", type: "미용", region: "경기", difficulty: "중" },
                { id: 3, title: "이동 봉사 차량 운전 보조", description: "아이들 병원 이송 및 픽업 보조입니다.", time: "10:00 - 12:00", location: "서울 강남 이송 센터", needed: "1명 필요", type: "이동", region: "서울", difficulty: "중" },
                { id: 4, title: "보호소 환경 대청소", description: "견사 및 생활 공간 대청소 및 소독 봉사입니다.", time: "09:00 - 12:00", location: "경기 광주 임시 쉼터", needed: "10명 필요", type: "청소", region: "경기", difficulty: "상" },
                { id: 5, title: "입양 홍보 포스터 디자인", description: "온라인 입양 포스터 디자인 작업입니다.", time: "18:00 - 20:00", location: "온라인", needed: "1명 필요", type: "기타", region: "전체", difficulty: "중" } // 5번째 항목 추가
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
            
            // KST 기준으로 요일을 얻기 위해 날짜 객체 생성 (UTC + 9시간)
            const utcDate = new Date(dateObj.getTime() + (9 * 60 * 60 * 1000));
            const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
            const dayOfWeek = dayNames[utcDate.getDay()];
            return `${utcDate.getMonth() + 1}월 ${utcDate.getDate()}일 (${dayOfWeek}) 일정`;
        }

        // --- 필터링 로직 ---
        function filterSchedules(dateString) {
            let list = allSchedules[dateString] || [];

            // 1. 지역 필터링
            if (currentSelectedRegion !== "전체") {
                list = list.filter(item => item.region === currentSelectedRegion);
            }

            // 2. 카테고리 필터링
            if (currentSelectedCategory !== "전체") {
                list = list.filter(item => item.type === currentSelectedCategory);
            }

            return list;
        }

        // --- 일정 패널 업데이트 ---
        function updateSchedulePanel(dateString) {
            
            // 날짜 헤더 업데이트
            scheduleHeader.innerHTML = `<span class="flex items-center"><i data-lucide="calendar" class="w-5 h-5 mr-2 text-[#cc0000]"></i> ${formatDateHeader(dateString)}</span>`;
            
            const scheduleData = filterSchedules(dateString);

            if (scheduleData.length === 0) {
                const regionName = selectedRegionText.textContent.trim().replace(/[\uD800-\uDBFF\uDC00-\uDFFF]/g, '').trim();
                const activeCategoryButton = categoryFilters.querySelector('.pill-button.active');
                const categoryName = activeCategoryButton ? activeCategoryButton.textContent.trim().replace(/[\uD800-\uDBFF\uDC00-\uDFFF]/g, '').trim() : '전체';

                scheduleList.innerHTML = `
                    <div class="no-schedule-message text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        😅 선택하신 조건 (<span class="font-extrabold text-blue-500">${regionName}</span> / <span class="font-extrabold text-blue-500">${categoryName}</span>)에 맞는 봉사 일정이 <span class="font-extrabold text-blue-500">없어요.</span><br>다른 날짜나 필터를 선택해 보세요.
                    </div>
                `;
                toggleListButton.classList.add('hidden');
                return;
            }

            scheduleList.innerHTML = '';
            scheduleData.forEach((item, index) => {
                const difficultyColor = item.difficulty === '하' ? 'bg-green-100 text-green-600' :
                                        item.difficulty === '중' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-red-100 text-red-600';
                
                // 목록 확장 상태에 따라 숨김 처리
                const isHidden = index >= 2 && !isListExpanded;
                
                const cardHtml = `
                    <div class="schedule-card bg-white p-4 border border-gray-100 rounded-lg ${isHidden ? 'hidden-card' : ''}" data-schedule-id="${item.id}">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div class="flex-1 pr-4 mb-3 sm:mb-0">
                                <h3 class="text-lg font-semibold mb-0.5">${item.title}</h3>
                                <p class="text-gray-500 text-sm">${item.description}</p>
                            </div>
                            <a href="#" class="cta-button">신청하기</a>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm mt-3 pt-3 border-t border-gray-100">
                            <span class="info-tag text-gray-700 bg-gray-50 flex items-center"><i data-lucide="clock" class="w-3.5 h-3.5 mr-1 text-[#cc0000]"></i> ${item.time}</span>
                            <span class="info-tag text-gray-700 bg-gray-50 flex items-center"><i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1 text-[#cc0000]"></i> ${item.region}</span>
                            <span class="info-tag ${difficultyColor} flex items-center"><i data-lucide="users" class="w-3.5 h-3.5 mr-1"></i> ${item.needed}</span>
                        </div>
                    </div>
                `;
                scheduleList.insertAdjacentHTML('beforeend', cardHtml);
            });

            // "더 보기" 버튼 표시 여부 및 텍스트 업데이트
            if (scheduleData.length > 2) {
                toggleListButton.classList.remove('hidden');
                toggleListButton.innerHTML = isListExpanded 
                    ? `봉사 일정 간략히 보기 <i data-lucide="chevron-up" class="w-5 h-5 ml-1 transition-transform"></i>`
                    : `더 많은 봉사 일정 보기 (${scheduleData.length - 2}개 더) <i data-lucide="chevron-down" class="w-5 h-5 ml-1 transition-transform"></i>`;
            } else {
                toggleListButton.classList.add('hidden');
            }
            
            // Re-create icons for newly inserted HTML
            lucide.createIcons();
        }

        // --- 목록 확장/축소 토글 ---
        window.toggleScheduleList = function() {
            isListExpanded = !isListExpanded;
            const cards = scheduleList.querySelectorAll('.schedule-card');
            
            cards.forEach((card, index) => {
                if (index >= 2) {
                    if (isListExpanded) {
                        card.classList.remove('hidden-card');
                    } else {
                        card.classList.add('hidden-card');
                    }
                }
            });
            
            // 버튼 텍스트와 아이콘 업데이트
            const scheduleData = filterSchedules(currentlySelectedDate);
            if (isListExpanded) {
                toggleListButton.innerHTML = `봉사 일정 간략히 보기 <i data-lucide="chevron-up" class="w-5 h-5 ml-1 transition-transform"></i>`;
            } else {
                toggleListButton.innerHTML = `더 많은 봉사 일정 보기 (${scheduleData.length - 2}개 더) <i data-lucide="chevron-down" class="w-5 h-5 ml-1 transition-transform"></i>`;
            }
            lucide.createIcons();
        };


        // --- 이벤트 리스너 설정 ---

        // 캘린더 이벤트
        calendarDates.forEach(dateElement => {
            const originalDate = dateElement.getAttribute('data-date');
            if (!originalDate) return;

            // 클릭 이벤트: 날짜 확정 선택
            dateElement.addEventListener('click', () => {
                isListExpanded = false; // 날짜 변경 시 목록은 항상 축소 상태로 초기화

                // 기존 선택 해제 및 새로운 선택 적용
                document.querySelectorAll('.calendar-dates .selected-date').forEach(el => el.classList.remove('selected-date'));
                dateElement.classList.add('selected-date');
                
                currentlySelectedDate = originalDate;
                updateSchedulePanel(originalDate);
            });
        });
        
        // 지역 드롭다운 토글
        toggleRegionList.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const isHidden = regionOptions.classList.contains('hidden');
            if (isHidden) {
                regionOptions.classList.remove('hidden');
                dropdownArrow.classList.add('rotate-180');
            } else {
                regionOptions.classList.add('hidden');
                dropdownArrow.classList.remove('rotate-180');
            }
        });

        // 지역 선택 항목 클릭
        regionOptions.addEventListener('click', (event) => {
            const selectedLi = event.target.closest('li');
            if (selectedLi) {
                currentSelectedRegion = selectedLi.getAttribute('data-value');
                // 이모지 및 공백 제거 후 텍스트 설정
                selectedRegionText.textContent = selectedLi.textContent.trim().replace(/[\uD800-\uDBFF\uDC00-\uDFFF]/g, '').trim(); 
                
                regionOptions.classList.add('hidden');
                dropdownArrow.classList.remove('rotate-180');
                
                isListExpanded = false; // 필터 변경 시 목록은 항상 축소 상태로 초기화
                updateSchedulePanel(currentlySelectedDate);
            }
        });

        // 카테고리 필터링
        categoryFilters.addEventListener('click', (event) => {
            const target = event.target.closest('.pill-button');
            if (target) {
                categoryFilters.querySelectorAll('.pill-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('default');
                });

                target.classList.add('active');
                target.classList.remove('default');
                
                currentSelectedCategory = target.getAttribute('data-category');
                
                isListExpanded = false; // 필터 변경 시 목록은 항상 축소 상태로 초기화
                updateSchedulePanel(currentlySelectedDate);
            }
        });

        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', (event) => {
            if (!regionSelectBox.contains(event.target)) {
                regionOptions.classList.add('hidden');
                dropdownArrow.classList.remove('rotate-180');
            }
        });


        // --- 초기화 ---
        window.onload = () => {
            // 초기 선택된 날짜 (2025-11-20) 기준으로 일정 패널 로드
            const initialDateElement = document.querySelector(`[data-date="${currentlySelectedDate}"]`);
            if (initialDateElement) {
                initialDateElement.classList.add('selected-date');
            }
            updateSchedulePanel(currentlySelectedDate);
        };


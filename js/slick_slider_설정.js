
$(function(){
$('.slider_area').slick({



    rows: 1,             //이미지를 몇 줄로 나타낼건지 (int)
    dots: false,         //네비게이션버튼 (boolean) -default:false
    appendDots: $('#dots'), //네비게이션버튼 변경 (선택자 혹은 $(element))
    dotsClass: 'custom-dots', //네비게이션버튼 클래스 변경
	infinite: true,      //무한반복 (boolean) -default:true
	slidesToShow: 4,     //한번에 보여줄 사진의 갯수(int)
	slidesToScroll: 4,   //한번에 넘길 사진의 갯수(int)
    slidesPerRow: 1,     //보여질 행의 수 (한 줄, 두 줄 ... )
	autoplay: true,      //자동시작 (boolean) -default:false
	autoplaySpeed: 2000, //자동넘기기 시간(int, 1000ms = 1초)
    variableWidth: true, //사진마다 width의 크기가 다른가? (boolean) -default:false
	draggable: false,    //리스트 드래그 가능여부 (boolean) -default:true
    arrows: true,        //화살표(넘기기버튼) 여부 (boolean) -default:true
    pauseOnFocus: true,  //마우스 포커스 시 슬라이드 멈춤 -default:true
    pauseOnHover: true,  //마우스 호버 시 슬라이드 멈춤 -default:true
    pauseOnDotsHover: true,  //네이게이션버튼 호버 시 슬라이드 멈춤 -default:false
    vertical: true,      //세로방향 여부 (boolean) -default:false
    verticalSwiping: true,     //세로방향 스와이프 여부 (boolean) -default:false
    accessibility: true, //접근성 여부 (boolean) -default:true
    appendArrows: $('#arrows'), // 좌우 화살표 변경 (선택자 혹은 $(element))
    prevArrow: $('#prevArrow'), // 좌 (이전) 화살표만 변경 (선택자 혹은 $(element))
    nextArrow: $('#nextArrow'), // 우 (다음) 화살표만 변경 (선택자 혹은 $(element))
    initialSlide: 1,     //처음 보여질 슬라이드 번호 -default: 0
    centerMode: true,    //중앙에 슬라이드가 보여지는 모드 -default:false
    centerPadding: '70px',  //중앙에 슬라이드가 보여지는 모드에서 padding값
    fade: true,          //모션 사용 여부 -default:false
    speed: 2000,         //모션 시간 (얼마나 빠른속도로 넘어가는지)(int, 1000ms = 1초)
    waitForAnimate: true, //애니메이션 중에는 동작을 제한함 -default:true
    responsive: [
        {
            breakpoint: 1024, //breakpoint: 반응형 구간
            settings: {  //settings: 반응형 구간에 따른 설정 변경
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }
    ] //반응형


    
});

});
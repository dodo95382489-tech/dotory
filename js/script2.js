
    const mapContainer = document.getElementById('map');
    const mapOptions = {
        center: new kakao.maps.LatLng(35.1645, 129.0447),
        level: 4
    };
    const map = new kakao.maps.Map(mapContainer, mapOptions);

    // 보호소 마커
    const shelters = [
        { name: "따뜻한 품 보호소", lat: 35.1645, lng: 129.0447 },
        { name: "행복이들 구조 센터", lat: 35.1682, lng: 129.0501 },
        { name: "희망의 케어 센터", lat: 35.1700, lng: 129.0304 }
    ];

    shelters.forEach(s => {
        new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(s.lat, s.lng)
        });
    });

    // GPS 자동 탐지
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const userLocation = new kakao.maps.LatLng(lat, lng);

                map.setCenter(userLocation);

                new kakao.maps.Marker({
                    map,
                    position: userLocation,
                    image: new kakao.maps.MarkerImage(
                        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                        new kakao.maps.Size(24, 35)
                    )
                });
            },
            function () {
                alert("현재 위치를 가져올 수 없습니다. 위치 권한을 허용해주세요.");
            }
        );
    }

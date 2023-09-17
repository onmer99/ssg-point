"use client";
import { useEffect, useState } from "react";
import { StoreMapType } from '@/types/StoreType';
import MapOverlay from './MapOverlay';
import {renderToString} from 'react-dom/server';
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const session=useSession();
  type coordinate = { lat: number; lng: number;};
  type bound = {sw:coordinate; ne:coordinate}
  // 스크립트 주입
  const mapScript = document.createElement("script");

  // const [mapLevel, setMapLevel] = useState(Number);
  const [mylocation, setMylocation] = useState<coordinate>();
  // const [mapBound, setMapBound] = useState<bound>();
  mapScript.async = true;
  mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=30825d7ff55d14a818299c266e641081&autoload=false&libraries=services,clusterer,drawing`;
  document.head.appendChild(mapScript);

  // 매장들 정보
  let markerList: any[] = [];
  let myAdd = function(x: number, y: number): number { 
    return x+y; 
  };

  var placeOverlay: any = null;
  var contentNode = document.createElement('div');

  const DeleteAllMarker = () => {
    // 마커 초기화
    markerList.forEach(o => {
      o.setMap(null)
    })
    markerList = []
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'center-right',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })

  const displayPlaceInfo = (map:any,place:StoreMapType) => {
    var content = renderToString(<MapOverlay store={place}/>)
    contentNode.innerHTML = content;
    placeOverlay.setPosition(new window.kakao.maps.LatLng(place.lat, place.lng));
    placeOverlay.setMap(map);
  }

  const fetchAddFavoriteStore = (storeId:number) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session.data?.user.data.token
    };

    fetch(`https://workjo.duckdns.org/api/v1/store/fav/${storeId}`, {
      method: 'POST',
      headers: headers
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.code === 'S001'){
        Toast.fire({
          icon: 'success',
          title: `<div style='font-size:0.9rem;'>단골매장 추가</div>`
        })
      } else{
        Toast.fire({
          icon: 'error',
          title:  `<div style='font-size:0.9rem;'>${data.message}</div>`
        })
      }
      
    })
  }

  useEffect(() => {
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {

        const newOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };

        // 지도를 표시할 div
        const mapContainer = document.getElementById("map");
        // 세팅 (div에 지도 옵션 부여)
        const map = new window.kakao.maps.Map(mapContainer, newOption);

        if (navigator.geolocation) {
          // GeoLocation을 이용해서 현재 위치 알아내기.
          navigator.geolocation.getCurrentPosition(function (position) {
            let locPosition = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude); // geolocation으로 얻어온 좌표
            map.setCenter(locPosition); // 지도 중심좌표 이동
          },
          function (){
            Toast.fire({
              icon: 'error',
              title:  `<div style='font-size:0.9rem;'>위치 권한을 허용해주세요</div>`,
              text: "브라우저에 대한 위치권한이 설정되어 있지 않습니다.위치권한을 설정하셔야 해당서비스를 이용할 수 있습니다.",
              timer: 2000
            })
          })
        } else{
          Toast.fire({
            icon: 'error',
            title:  `<div style='font-size:0.9rem;'>현재 위치를 찾을 수 없습니다!</div>`
          })
        }

        placeOverlay = new window.kakao.maps.CustomOverlay({zIndex:1});
        // 커스텀 오버레이 컨텐츠를 설정합니다
        placeOverlay.setContent(contentNode);  

        window.kakao.maps.event.addListener(map,"dragend",function (mouseEvent: { latLng: any }) {
            var bounds = map.getBounds();
            var bound_sw = bounds.getSouthWest();
            var bound_ne = bounds.getNorthEast();
            // setMapBound({
            //   sw: {lat:bound_sw.getLat(), lng:bound_sw.getLng()},
            //   ne: {lat:bound_ne.getLat(), lng:bound_ne.getLng()},
            // })

            // 지도 내 매장 정보 가져오기
            console.log(`현재 지도 bound sw_lat=${bound_sw.getLat()}&ne_lat=${bound_ne.getLat()}&sw_lng=${bound_sw.getLng()}&ne_lng=${bound_ne.getLng()} `)
            fetch(`http://localhost:8000/api/v1/store/find-map?sw_lat=${bound_sw.getLat()}&ne_lat=${bound_ne.getLat()}&sw_lng=${bound_sw.getLng()}&ne_lng=${bound_ne.getLng()}`, {
                method: 'GET',
                headers: {
                  'Content-type':'application/json'
                },
            })
            .then((res) => res.json())
            .then((data) => {
              console.log(data)
              let storeList : StoreMapType[] = data.data;

              DeleteAllMarker()
              storeList.forEach(o =>{
                var imageSrc = o.imageUrl || "https://storage.googleapis.com/ssg-point-spharos/ssg-partner/default.png", // 마커이미지의 주소, 이미지 없을 경우 default 주소 
                  imageSize = new window.kakao.maps.Size(30, 35); // 마커이미지의 크기입니다
                var icon = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

                var marker = new window.kakao.maps.Marker({
                  map: map,
                  image: icon,
                  position: new window.kakao.maps.LatLng(
                    o.lat,
                    o.lng
                  ),
                });
                // 마커 리스트에 마커 추가
                markerList.push(marker)

                // 마커에 click 이벤트를 등록합니다
                window.kakao.maps.event.addListener(marker, 'click', function(){
                  displayPlaceInfo(map, o)
                  console.log(o.storeName)
                  Swal.fire({
                    title: `${o.storeName}👋`,
                    position: 'bottom',
                    backdrop: false,
                    showClass: {
                      popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                      `
                    },
                    hideClass: {
                      popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                      `
                    },
                    grow: 'row',
                    showConfirmButton: true,
                    showCloseButton: true,
                    confirmButtonText: '자주 찾는 매장 등록'
                  }).then(result => {
                    // 만약 Promise리턴을 받으면,
                    if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                      fetchAddFavoriteStore(o.id)
                    }
                  });
                });
              })  
          })
          }
        );
      })
    }

    mapScript.addEventListener("load", onLoadKakaoMap);
    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  }, []);

  return (
    <>
      <h3 className="hidden">지도로 찾기</h3>
      <div className="w[100%] h-[100%]" id="map" />
    </>
  );
};
export default KakaoMap;

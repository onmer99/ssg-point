// import { Swiper, SwiperSlide } from "swiper/react";

// import { EffectCoverflow, Navigation, Mousewheel} from "swiper";

// const EventSwiper = () => {
// <Swiper
//         effect={"coverflow"}
//         grabCursor={true}
//         centeredSlides={true}
//         slidesPerView={4}
//         coverflowEffect={{
//           rotate: 10, // 회전각도
//           stretch: 0, 
//           depth: 100, // 깊이감도
//           modifier: 2, // 
//           slideShadows: true,//선택한 부분 밝게 나머지는 그늘지게 해준다.
//         }}
//         navigation={true} // 네비게이션 버튼
//         mousewheel={true} // 마우스 휠
//         modules={[EffectCoverflow,Navigation,Mousewheel]} // 모듈추가
//         className="mySwiper"
//       >
//             <div className="container">
            
//                 {movies.map(movie =>
//                 <SwiperSlide>
//                     <Movie
//                         id={movie.id}
//                         key={movie.id}
//                         poster_path={movie.poster_path}
//                         title={movie.title}
//                         average={movie.vote_average}
//                     /> </SwiperSlide>)} </div>
//                 </Swiper>
// }
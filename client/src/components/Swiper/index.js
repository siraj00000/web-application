import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";

import "./swiper.css";

// import required modules
import { EffectCreative, Autoplay } from "swiper";

function ProductCrousel({ content }) {
    return (
        <Swiper
            grabCursor={true}
            effect={"creative"}
            creativeEffect={{
                prev: {
                    shadow: true,
                    translate: [0, 0, -400],
                },
                next: {
                    translate: ["100%", 0, 0],
                },
            }}
            modules={[EffectCreative, Autoplay]}
            autoplay={{ delay: 3000 }}
            className="mySwiper"
        >
            {content.map((item, index) => (
                <SwiperSlide key={index}>
                    <article className="product-article">
                        <img src={item?.asset} alt="pro" />
                        <h3>{item?.heading}</h3>
                        <p>{item?.text}</p>
                    </article>
                </SwiperSlide>
            ))}

        </Swiper>
    );
}


// import Carousel from 'react-bootstrap/Carousel';

// function ProductCrousel({ content }) {
//     return (
//         <section className='product-crousel'>
//             <Carousel>
//                 {content.map((item, index) => (
//                     <>
//                         <Carousel.Item key={index}>
//                             <img
//                                 className="w-100 product-image"
//                                 src={item?.asset}
//                                 alt={item?.asset}
//                             />
//                         </Carousel.Item>
//                         <h3>{item?.heading}</h3>
//                         <p>{item?.text}</p>
//                     </>
//                 ))}
//             </Carousel>
//         </section>
//     );
// }

export default ProductCrousel;
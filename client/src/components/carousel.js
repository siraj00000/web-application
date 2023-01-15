import Carousel from 'react-bootstrap/Carousel';
import '../components/component.css'

function CorouselComp({ item1, item2, item3 }) {
    return (
        <Carousel>
            <Carousel.Item interval={1000}>
                {item1}
            </Carousel.Item>
            <Carousel.Item interval={1000}>
                {item2}
            </Carousel.Item>
            <Carousel.Item interval={1000}>
                {item3}
            </Carousel.Item>
        </Carousel>
    );
}

export default CorouselComp;
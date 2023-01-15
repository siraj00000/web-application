import React from 'react';
import { Col, Row } from "react-bootstrap";

const ProductServices = ({ content, index }) => {
    let odd = index % 2 !== 0;
    let Icon = content.Icon;
    // console.log(content);
    const handleConnectEvent = () => {
        window.open(content.info, "_blank");
    };
    return (
        <Row style={{ flexDirection: odd && "row-reverse" }} >
            <Col>
                <h1>{content.name}</h1>
                <p>Connect with us for resolving your product queries</p>
                <button onClick={handleConnectEvent}><Icon /> Connect now</button>
            </Col>
            <Col>
                <img
                    src={content.asset}
                    alt={content.name}
                />
            </Col>
        </Row>
    );
};

export default ProductServices;
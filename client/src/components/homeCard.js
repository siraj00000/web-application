import React from 'react';
import '../components/component.css';
const HomeCard = ({ image, step, text }) => {
    return (
        <div className='home-card'>
            <img src={image} alt={step} />
            <h4>{step}</h4>
            <p>{text}</p>
        </div>
    );
};

export default HomeCard;
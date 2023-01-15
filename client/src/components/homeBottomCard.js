import React from 'react';
import '../components/component.css';
const HomeBottomCard = ({ Icon, bgColor, text1, text2, text3 }) => {
    return (
        <div className='home-bottom-card'
            style={{ backgroundColor: bgColor, flex: 1 }}
        >
            <Icon sx={{
                position: "absolute",
                right: "30px",
                backgroundColor: "#2987C2FF",
                padding: "10px",
                color: "#ffff",
                fontSize: "3rem",
                borderRadius: "6px"
            }} />
            <p>{text1}</p>
            <p>{text2}</p>
            <p>{text3}</p>
        </div>
    );
};

export default HomeBottomCard;
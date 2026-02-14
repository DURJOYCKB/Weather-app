import React, { useMemo } from 'react';

const Stars = () => {
    const stars = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 70; i++) {
            const style = {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`, // 1px to 4px
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
            };
            arr.push(style);
        }
        return arr;
    }, []);

    return (
        <div className="stars-container">
            {stars.map((style, i) => (
                <div key={i} className="star" style={style}></div>
            ))}
        </div>
    );
};

export default Stars;

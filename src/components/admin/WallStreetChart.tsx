import React from 'react';

interface WallStreetChartProps {
    data: number[];
    color: string;
}

export const WallStreetChart: React.FC<WallStreetChartProps> = ({ data, color }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / (max - min)) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-12 relative border-b border-lumina-border/50 bg-lumina-panel/50">
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_19%,rgba(100,100,100,0.05)_20%)] bg-[size:20%_100%]"></div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <polygon points={`0,100 ${points} 100,100`} fill={color} fillOpacity="0.1" />
            </svg>
        </div>
    );
};

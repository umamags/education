import { useState, useEffect } from 'react';
import './FocusCircle.css';

const dimensions = [
  { id: 0, title: 'Cognitive', tooltip: 'Thinking, reasoning, memory, problem solving', color: '#FF6B6B' },
  { id: 1, title: 'Language', tooltip: 'Listening, speaking, vocabulary, reading, writing', color: '#4ECDC4' },
  { id: 2, title: 'Physical', tooltip: 'Gross motor, fine motor, coordination, strength', color: '#FFE66D' },
  { id: 3, title: 'Social', tooltip: 'Sharing, cooperation, friendships, empathy', color: '#95E1D3' },
  { id: 4, title: 'Emotional', tooltip: 'Self-awareness, regulation, resilience', color: '#F38181' },
  { id: 5, title: 'Curiosity', tooltip: 'Questions, exploration, experimentation', color: '#AA96DA' },
  { id: 6, title: 'Learning', tooltip: 'Attention, persistence, learning strategies', color: '#FCBAD3' },
  { id: 7, title: 'Independence', tooltip: 'Self-care, responsibility, decision-making', color: '#A8D8EA' },
];

const ROTATION_SPEED = 3; // seconds
const CIRCLE_SIZE = 400;
const RADIUS = CIRCLE_SIZE / 2;

const roundToNearestHalf = (age) => {
  return Math.round(age * 2) / 2;
};

export default function FocusCircle() {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [age, setAge] = useState(1);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const roundedAge = roundToNearestHalf(age);
        const formattedAge = roundedAge.toFixed(1);
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}data/age_${formattedAge}.json`);
        if (response.ok) {
          const data = await response.json();
          if (data.dimensions && data.dimensions[selectedIndex]) {
            setSelectedData(data.dimensions[selectedIndex]);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [age, selectedIndex]);

  const handleRotate = () => {
    if (isRotating) return;

    setIsRotating(true);
    const spins = 5;
    const randomOffset = Math.random() * 360;
    const newRotation = spins * 360 + randomOffset;

    setRotation(newRotation);

    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const newSelectedIndex = Math.round(normalizedRotation / 45) % 8;
      setSelectedIndex(newSelectedIndex);
      setIsRotating(false);
    }, ROTATION_SPEED * 1000);
  };

  const handleSliceClick = (index) => {
    if (isRotating) return;
    setSelectedIndex(index);
    setRotation(0);
  };

  // Create SVG pie slices
  const createPieSlice = (index) => {
    const sliceAngle = 360 / 8;
    const startAngle = index * sliceAngle;
    const endAngle = (index + 1) * sliceAngle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = RADIUS + RADIUS * Math.cos(startRad);
    const y1 = RADIUS + RADIUS * Math.sin(startRad);
    const x2 = RADIUS + RADIUS * Math.cos(endRad);
    const y2 = RADIUS + RADIUS * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${RADIUS} ${RADIUS}`,
      `L ${x1} ${y1}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return pathData;
  };

  const getTitlePosition = (index) => {
    const sliceAngle = 360 / 8;
    const angle = index * sliceAngle + sliceAngle / 2;
    const rad = (angle - 90) * Math.PI / 180;
    const distance = RADIUS * 0.65;
    const x = RADIUS + distance * Math.cos(rad);
    const y = RADIUS + distance * Math.sin(rad);
    return { x, y, angle };
  };

  return (
    <div className="focus-circle-page">
      <div className="content-wrapper">
        <div className="header-section">
          <h1>Choose your child's growth area</h1>
          <button
            onClick={handleRotate}
            disabled={isRotating}
            className="rotate-button"
          >
            {isRotating ? '⟳ Spinning...' : '⟳ Rotate'}
          </button>
        </div>

        <div className="main-layout">
          <div className="left-section">
            <div className="circle-container">
              <svg
                width={CIRCLE_SIZE}
                height={CIRCLE_SIZE}
                className={`circle-svg ${isRotating ? 'spinning' : ''}`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isRotating ? `${ROTATION_SPEED}s` : '0s',
                }}
              >
                {dimensions.map((dimension, index) => {
                  const pos = getTitlePosition(index);
                  return (
                    <g key={dimension.id}>
                      <path
                        d={createPieSlice(index)}
                        fill={dimension.color}
                        stroke="white"
                        strokeWidth="2"
                        className={`pie-slice ${selectedIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSliceClick(index)}
                        style={{ cursor: 'pointer' }}
                      />
                      <text
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="slice-label"
                        style={{
                          transform: `rotate(${-rotation}deg)`,
                          transformOrigin: `${pos.x}px ${pos.y}px`,
                        }}
                      >
                        {dimension.title}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="age-slider-container">
              <label className="slider-label">Pick your child's age</label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={age}
                onChange={(e) => setAge(parseFloat(e.target.value))}
                className="age-slider"
              />
              <div className="age-display">{age.toFixed(1)}</div>
            </div>

            <div className="selected-section">
              <p>Currently selected: <span className="age-info">Age {age.toFixed(1)}</span></p>
              <h2>{dimensions[selectedIndex].title}</h2>
              <p className="tooltip-text">{dimensions[selectedIndex].tooltip}</p>
            </div>
          </div>

          <div className="sidebar">
            {loading ? (
              <p className="loading">Loading...</p>
            ) : selectedData ? (
              <>
                <div className="data-block">
                  <h3>Milestones</h3>
                  <ul>
                    {selectedData.milestones.map((milestone, idx) => (
                      <li key={idx}>{milestone}</li>
                    ))}
                  </ul>
                </div>

                <div className="data-block">
                  <h3>Activities</h3>
                  <ul>
                    {selectedData.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                </div>

                <div className="data-block">
                  <h3>Watch For</h3>
                  <ul>
                    {selectedData.watchFor.map((watch, idx) => (
                      <li key={idx}>{watch}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';

const SwipeCard = ({ children, onSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [transform, setTransform] = useState({ x: 0, rotate: 0 });
  const cardRef = useRef(null);
  
  const SWIPE_THRESHOLD = 80;
  const MAX_ROTATION = 15;

  const handleStart = (clientX) => {
    console.log('SwipeCard: handleStart', clientX);
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    const rotation = (deltaX / window.innerWidth) * MAX_ROTATION;
    
    console.log('SwipeCard: handleMove', { clientX, startX, deltaX, threshold: SWIPE_THRESHOLD });
    
    // Ensure currentX is updated immediately for proper swipe detection
    setCurrentX(clientX);
    setTransform({ x: deltaX, rotate: rotation });
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const deltaX = currentX - startX;
    console.log('SwipeCard: handleEnd', { currentX, startX, deltaX, threshold: SWIPE_THRESHOLD, willSwipe: Math.abs(deltaX) > SWIPE_THRESHOLD });
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      // Swipe detected
      const direction = deltaX > 0 ? 'right' : 'left';
      
      // Animate card off screen with enhanced exit animation
      const exitX = deltaX > 0 ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
      const exitRotation = deltaX > 0 ? MAX_ROTATION * 2 : -MAX_ROTATION * 2;
      setTransform({ x: exitX, rotate: exitRotation });
      
      // Call onSwipe after a short delay
      setTimeout(() => {
        onSwipe && onSwipe(direction);
        // Don't reset card - let it be removed from DOM by parent component
      }, 200);
    } else {
      // Snap back to center
      setTransform({ x: 0, rotate: 0 });
    }

    setIsDragging(false);
  };

  const resetCard = () => {
    setTransform({ x: 0, rotate: 0 });
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    console.log('SwipeCard: mouseDown event', e);
    e.preventDefault();
    handleStart(e.clientX);
    
    let lastClientX = e.clientX;
    
    const handleMouseMove = (e) => {
      e.preventDefault();
      lastClientX = e.clientX;
      handleMove(e.clientX);
    };
    const handleMouseUp = (e) => {
      e.preventDefault();
      // Update currentX with the final position and call handleEnd
      setCurrentX(lastClientX);
      handleEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch events
  const handleTouchStart = (e) => {
    console.log('SwipeCard: touchStart event', e);
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const cardStyle = {
    transform: `translateX(${transform.x}px) rotate(${transform.rotate}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'pan-x',
  };

  // Color overlay based on swipe direction
  const getOverlayStyle = () => {
    if (!isDragging || Math.abs(transform.x) < 50) {
      return { opacity: 0 };
    }
    
    const opacity = Math.min(Math.abs(transform.x) / SWIPE_THRESHOLD, 0.3);
    const backgroundColor = transform.x > 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    
    return {
      opacity,
      backgroundColor,
    };
  };

  const getOverlayText = () => {
    if (!isDragging || Math.abs(transform.x) < 50) return null;
    
    return transform.x > 0 ? (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-xl transform rotate-12 shadow-lg">
          LIKE
        </div>
      </div>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xl transform -rotate-12 shadow-lg">
          NOPE
        </div>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full"
      style={cardStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Color overlay */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none z-5"
        style={getOverlayStyle()}
      />
      
      {/* Overlay text */}
      {getOverlayText()}
      
      {/* Card content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default SwipeCard;

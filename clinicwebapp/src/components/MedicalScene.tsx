import React from 'react';

// Advanced medical AI visualization with CSS
const MedicalSceneContainer = () => {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Neural network nodes and connections */}
      <div className="neural-network" style={{
        position: 'relative',
        width: '80%',
        height: '80%',
      }}>
        {/* Generate neural network nodes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`node-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 85}%`,
              top: `${Math.random() * 85}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              borderRadius: '50%',
              background: `rgba(33, 150, 243, ${Math.random() * 0.5 + 0.5})`,
              boxShadow: '0 0 15px rgba(33, 150, 243, 0.8)',
              animation: `pulse ${Math.random() * 3 + 2}s infinite alternate ease-in-out, float ${Math.random() * 10 + 20}s infinite linear`,
              zIndex: 2,
            }}
          />
        ))}

        {/* DNA double helix in the center */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '40%',
          width: '20%',
          height: '90%',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          animation: 'rotate3d 20s infinite linear',
          zIndex: 1,
        }}>
          {/* Generate DNA strands */}
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={`dna-${i}`}>
              {/* First strand */}
              <div style={{
                position: 'absolute',
                top: `${i * 5}%`,
                left: '0',
                width: '100%',
                height: '10px',
                background: 'linear-gradient(90deg, #2196f3, #64b5f6)',
                borderRadius: '10px',
                transform: `rotateY(${i * 18}deg) translateZ(50px)`,
                boxShadow: '0 0 15px rgba(33, 150, 243, 0.6)',
                opacity: 0.9,
              }} />
              
              {/* Second strand */}
              <div style={{
                position: 'absolute',
                top: `${i * 5}%`,
                left: '0',
                width: '100%',
                height: '10px',
                background: 'linear-gradient(90deg, #64b5f6, #90caf9)',
                borderRadius: '10px',
                transform: `rotateY(${(i * 18) + 180}deg) translateZ(50px)`,
                boxShadow: '0 0 15px rgba(33, 150, 243, 0.6)',
                opacity: 0.9,
              }} />
              
              {/* Connection between strands */}
              {i % 2 === 0 && (
                <div style={{
                  position: 'absolute',
                  top: `${i * 5 + 5}%`,
                  left: '0',
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(100, 181, 246, 0.7))',
                  borderRadius: '5px',
                  transform: `rotateY(${i * 18 + 90}deg) translateZ(50px)`,
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Floating medical icons */}
        <div className="floating-icons">
          {['❤️', '🧠', '🩺', '🔬', '💊', '🧬', '🦠', '🩸'].map((icon, i) => (
            <div
              key={`icon-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                fontSize: `${Math.random() * 20 + 20}px`,
                opacity: 0.3,
                transform: 'rotate(10deg)',
                animation: `float ${Math.random() * 10 + 15}s infinite linear, fadeInOut ${Math.random() * 5 + 5}s infinite alternate`,
                zIndex: 1,
              }}
            >
              {icon}
            </div>
          ))}
        </div>
        
        {/* Pulsing circles representing AI processing */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`pulse-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${(i + 1) * 100}px`,
              height: `${(i + 1) * 100}px`,
              borderRadius: '50%',
              border: '1px solid rgba(33, 150, 243, 0.3)',
              animation: `pulse-ring ${(i + 1) * 2}s infinite`,
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes rotate3d {
            from { transform: rotateY(0deg) rotateX(30deg); }
            to { transform: rotateY(360deg) rotateX(30deg); }
          }
          
          @keyframes pulse {
            from { transform: scale(0.8); opacity: 0.7; }
            to { transform: scale(1.2); opacity: 1; }
          }
          
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, 10px) rotate(5deg); }
            50% { transform: translate(-5px, 15px) rotate(0deg); }
            75% { transform: translate(-10px, -5px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          
          @keyframes fadeInOut {
            from { opacity: 0.1; }
            to { opacity: 0.5; }
          }
          
          @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.3; }
            80%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default MedicalSceneContainer; 
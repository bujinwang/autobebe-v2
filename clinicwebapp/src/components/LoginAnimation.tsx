import React from 'react';

// Medical Triage AI Animation Component
const LoginAnimation = () => {
  return (
    <div className="login-animation-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: -1,
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.2) 100%)',
        zIndex: -1,
      }} />

      {/* Neural Network Visualization */}
      <div className="neural-network" style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3,
      }}>
        {/* Neural Network Nodes */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`node-${i}`}
            className="network-node"
            style={{
              position: 'absolute',
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              backgroundColor: Math.random() > 0.7 ? 'rgba(0, 188, 212, 0.6)' : 'rgba(33, 150, 243, 0.6)',
              borderRadius: '50%',
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(33, 150, 243, 0.4)`,
              zIndex: 1,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Neural Network Connections */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`connection-${i}`}
            className="network-connection"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: '1px',
              background: `linear-gradient(90deg, 
                rgba(33, 150, 243, ${Math.random() * 0.1 + 0.05}) 0%, 
                rgba(0, 188, 212, ${Math.random() * 0.1 + 0.05}) 100%)`,
              transform: `rotate(${Math.random() * 360}deg)`,
              transformOrigin: '0 0',
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Vital Signs Monitor */}
      <div className="vital-monitor" style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '180px',
        height: '120px',
        border: '2px solid rgba(33, 150, 243, 0.3)',
        borderRadius: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: '10px',
        boxShadow: '0 0 15px rgba(33, 150, 243, 0.2)',
        overflow: 'hidden',
        opacity: 0.4,
      }}>
        {/* Heart Rate Line */}
        <div className="heart-rate-line" style={{
          position: 'absolute',
          top: '30px',
          left: '10px',
          width: '160px',
          height: '40px',
        }}>
          <svg width="160" height="40" viewBox="0 0 160 40">
            <path 
              d="M0,20 L10,20 L15,20 L20,10 L25,30 L30,20 L35,20 L40,20 L45,20 L50,20 L55,5 L60,35 L65,20 L70,20 L80,20 L85,20 L90,10 L95,30 L100,20 L105,20 L110,20 L115,20 L120,20 L125,5 L130,35 L135,20 L140,20 L150,20 L155,20 L160,20" 
              fill="none" 
              stroke="rgba(33, 150, 243, 0.6)" 
              strokeWidth="1"
              className="heart-line"
            />
          </svg>
        </div>
        
        {/* Vital Stats */}
        <div style={{ position: 'absolute', top: '75px', left: '15px', color: 'rgba(33, 150, 243, 0.8)', fontSize: '12px', fontFamily: 'monospace' }}>
          HR: <span className="vital-value">78</span> BPM
        </div>
        <div style={{ position: 'absolute', top: '75px', right: '15px', color: 'rgba(0, 188, 212, 0.8)', fontSize: '12px', fontFamily: 'monospace' }}>
          O₂: <span className="vital-value">99</span> %
        </div>
        <div style={{ position: 'absolute', top: '95px', left: '15px', color: 'rgba(0, 188, 212, 0.8)', fontSize: '12px', fontFamily: 'monospace' }}>
          BP: <span className="vital-value">120</span>/<span className="vital-value">80</span>
        </div>
        <div style={{ position: 'absolute', top: '95px', right: '15px', color: 'rgba(33, 150, 243, 0.8)', fontSize: '12px', fontFamily: 'monospace' }}>
          TEMP: <span className="vital-value">37.0</span>°
        </div>
      </div>

      {/* AI Data Processing Animation */}
      <div className="data-processing" style={{
        position: 'absolute',
        top: '15%',
        left: '8%',
        width: '150px',
        height: '150px',
        opacity: 0.4,
      }}>
        <div className="data-ring" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '3px solid transparent',
          borderRadius: '50%',
          borderTopColor: 'rgba(33, 150, 243, 0.6)',
          borderRightColor: 'rgba(0, 188, 212, 0.3)',
          animation: 'spin 3s linear infinite',
        }} />
        
        <div className="data-ring" style={{
          position: 'absolute',
          width: '75%',
          height: '75%',
          top: '12.5%',
          left: '12.5%',
          border: '3px solid transparent',
          borderRadius: '50%',
          borderTopColor: 'rgba(0, 188, 212, 0.6)',
          borderLeftColor: 'rgba(33, 150, 243, 0.3)',
          animation: 'spin 2s linear infinite reverse',
        }} />
        
        <div className="data-ring" style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          top: '25%',
          left: '25%',
          border: '2px solid transparent',
          borderRadius: '50%',
          borderBottomColor: 'rgba(33, 150, 243, 0.6)',
          borderLeftColor: 'rgba(0, 188, 212, 0.3)',
          animation: 'spin 1.5s linear infinite',
        }} />
      </div>

      {/* Medical AI classification bubbles */}
      <div className="classification-bubbles" style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '150px',
        height: '200px',
        opacity: 0.5,
      }}>
        {/* Triage Priority Levels */}
        <div className="triage-bubble priority-high" style={{
          position: 'absolute',
          top: '10px',
          left: '30px',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 67, 54, 0.3)',
          border: '1px solid rgba(244, 67, 54, 0.5)',
          animation: 'pulseSize 3s infinite alternate',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'rgba(244, 67, 54, 0.9)',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          1
        </div>
        
        <div className="triage-bubble priority-medium" style={{
          position: 'absolute',
          top: '70px',
          left: '80px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 152, 0, 0.3)',
          border: '1px solid rgba(255, 152, 0, 0.5)',
          animation: 'pulseSize 3s infinite alternate 0.5s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'rgba(255, 152, 0, 0.9)',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          2
        </div>
        
        <div className="triage-bubble priority-low" style={{
          position: 'absolute',
          top: '120px',
          left: '40px',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          backgroundColor: 'rgba(76, 175, 80, 0.3)',
          border: '1px solid rgba(76, 175, 80, 0.5)',
          animation: 'pulseSize 3s infinite alternate 1s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'rgba(76, 175, 80, 0.9)',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          3
        </div>
      </div>

      {/* AI Scanning Effect */}
      <div className="scan-effect" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        opacity: 0.2,
        pointerEvents: 'none',
      }}>
        <div className="scan-line" style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: 'rgba(33, 150, 243, 0.6)',
          boxShadow: '0 0 8px 2px rgba(33, 150, 243, 0.4)',
          animation: 'scanLine 4s ease-in-out infinite',
        }} />
      </div>

      {/* Data Processing Points */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`data-point-${i}`}
          className="data-point"
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            backgroundColor: Math.random() > 0.5 ? 'rgba(33, 150, 243, 0.8)' : 'rgba(0, 188, 212, 0.8)',
            borderRadius: '50%',
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* CSS Animations */}
      <style>
        {`
          .network-node {
            animation: pulse 3s infinite alternate ease-in-out;
          }
          
          .network-connection {
            animation: dataFlow 4s infinite linear;
          }
          
          .data-point {
            animation: moveDataPoint 10s infinite linear;
          }
          
          .vital-value {
            animation: updateValue 3s infinite alternate;
          }
          
          .heart-line {
            animation: animateHeartLine 2s infinite linear;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
          }
          
          @keyframes pulse {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 0.7; transform: scale(1.2); }
          }
          
          @keyframes dataFlow {
            0% { opacity: 0; transform-origin: 0 0; transform: scaleX(0) rotate(var(--rotate, 0deg)); }
            50% { opacity: 1; }
            100% { opacity: 0; transform-origin: 0 0; transform: scaleX(1) rotate(var(--rotate, 0deg)); }
          }
          
          @keyframes moveDataPoint {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(30px) translateX(-20px); }
            50% { transform: translateY(0) translateX(-40px); }
            75% { transform: translateY(-30px) translateX(-20px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes updateValue {
            0% { opacity: 0.7; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0.7; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulseSize {
            0% { transform: scale(0.9); opacity: 0.4; }
            100% { transform: scale(1.1); opacity: 0.6; }
          }
          
          @keyframes scanLine {
            0% { top: -5%; opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { top: 105%; opacity: 0; }
          }
          
          @keyframes animateHeartLine {
            0% { stroke-dashoffset: 200; }
            100% { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default LoginAnimation; 
// SpinnerLoader.tsx
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

export const SpinnerLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    // Custom events to control the spinner visibility
    window.addEventListener('showSpinner', handleStart);
    window.addEventListener('hideSpinner', handleStop);

    return () => {
      window.removeEventListener('showSpinner', handleStart);
      window.removeEventListener('hideSpinner', handleStop);
    };
  }, []);

  return (
    <>
      {loading && (
        <div>
          {/* Overlay to disable background */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
              zIndex: 9998,
            }}
          />
          {/* Spinner and text */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              textAlign: 'center',
            }}
          >
            <Spin size="large" />
            <div
              style={{
                marginTop: 10,
                fontSize: '16px',
                color: '#1890ff',
              }}
            >
              Loading...
            </div>
          </div>
        </div>
      )}
    </>
  );
};

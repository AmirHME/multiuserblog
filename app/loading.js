// app/loading.js
"use client";
import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // شبیه‌سازی پیشرفت بارگذاری
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (5 + Math.random() * 10);
      });
    }, 300);

    // نمایش پیام بعد از 3 ثانیه اگر هنوز بارگذاری ادامه دارد
    const timeout = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
          <span className="progress-text">{Math.min(progress, 100)}%</span>
        </div>
        
        <h2 className="loading-text">در حال آماده‌سازی ...</h2>
        
        {showMessage && (
          <div className="loading-message animate-fade-in">
            <p>بارگذاری کمی طول می‌کشد، لطفاً شکیبا باشید...</p>
            <div className="typing-animation">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        
        .loading-content {
          text-align: center;
          padding: 2rem;
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
        }
        
        .loading-spinner {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(93, 156, 236, 0.2);
          border-top-color: #5d9cec;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .progress-container {
          width: 100%;
          height: 20px;
          background-color: rgba(93, 156, 236, 0.1);
          border-radius: 10px;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #5d9cec, #4ecdc4);
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
        }
        
        .loading-text {
          font-family: 'Vazir', sans-serif;
          color: #2c3e50;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .loading-message {
          margin-top: 1.5rem;
          color: #95a5a6;
          font-size: 0.9rem;
        }
        
        .typing-animation span {
          display: inline-block;
          animation: bounce 1s infinite;
          margin-left: 2px;
        }
        
        .typing-animation span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-animation span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .loading-text {
            font-size: 1.1rem;
          }
          
          .loading-message {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
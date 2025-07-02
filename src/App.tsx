import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionName, setSessionName] = useState('Work');
  const [sessionCount, setSessionCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const sendNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            playSound();
            sendNotification(`${sessionName} Session Finished!`, `Time for a ${sessionName === 'Work' ? 'break' : 'work session'}.`);

            if (sessionName === 'Work') {
              if (sessionCount === 3) {
                setSessionName('Long Break');
                setMinutes(15);
                setSessionCount(0);
              } else {
                setSessionName('Short Break');
                setMinutes(5);
                setSessionCount(sessionCount + 1);
              }
            } else {
              setSessionName('Work');
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds, minutes, sessionName, sessionCount]);

  const toggle = () => {
    setIsActive(!isActive);
  }

  const reset = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setSessionName('Work');
    setSessionCount(0);
  }

  return (
    <div className={`container text-center ${sessionName.toLowerCase().replace(' ', '-')}`}>
      <h1>Pomodoro Timer</h1>
      <div className="timer-container">
        <h2>{sessionName}</h2>
        <div className="timer">
          {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
      <div className="buttons">
        <button className="btn btn-primary" onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>
      <audio ref={audioRef} src="/notification.mp3" />
    </div>
  );
}

export default App;
import React, { useEffect, useRef, useState } from 'react';
import './pomodoro.sass';

const appendZero = (value) => (value < 10 ? '0' + value : String(value));

export default function Pomodoro() {
  const [active, setActive] = useState('focus');
  const [minCount, setMinCount] = useState(24);
  const [count, setCount] = useState(59);
  const [paused, setPaused] = useState(true);

  const intervalRef = useRef(null);
  const minRef = useRef(minCount);
  const countRef = useRef(count);

  useEffect(() => {
    minRef.current = minCount;
  }, [minCount]);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const displayTime = () => {
    // Matches original behaviour: before starting, show (minCount + 1):00
    if (paused && count === 59) return `${minCount + 1}:00`;
    return `${appendZero(minCount)}:${appendZero(count)}`;
  };

  const pauseTimer = () => {
    setPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTime = () => {
    pauseTimer();
    switch (active) {
      case 'long':
        setMinCount(14);
        break;
      case 'short':
        setMinCount(4);
        break;
      default:
        setMinCount(24);
        break;
    }
    setCount(59);
  };

  const startTimer = () => {
    if (!paused) return;
    setPaused(false);

    // avoid double intervals
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const c = countRef.current;
      const m = minRef.current;

      if (c > 0) {
        setCount((prev) => prev - 1);
      } else {
        if (m > 0) {
          setMinCount((prevM) => prevM - 1);
          setCount(59);
        } else {
          // finished
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setPaused(true);
        }
      }
    }, 1000);
  };

  const setMode = (mode) => {
    setActive(mode);
    pauseTimer();
    setCount(59);
    switch (mode) {
      case 'long':
        setMinCount(14);
        break;
      case 'short':
        setMinCount(4);
        break;
      default:
        setMinCount(24);
        break;
    }
  };

  return (
    <div className="container">
      <div className="mode-btns-box">
        <button
          type="button"
          className={`focus-btn ${active === 'focus' ? 'btn-focus' : ''}`}
          onClick={() => setMode('focus')}
        >
          Focus
        </button>
        <button
          type="button"
          className={`short-break-btn ${active === 'short' ? 'btn-focus' : ''}`}
          onClick={() => setMode('short')}
        >
          Short break
        </button>
        <button
          type="button"
          className={`long-break-btn ${active === 'long' ? 'btn-focus' : ''}`}
          onClick={() => setMode('long')}
        >
          Long break
        </button>
      </div>

      <h1 className="timer">{displayTime()}</h1>

      <div className="btns">
        {paused ? (
          <button className="start-btn" type="button" onClick={startTimer}>
            Start
          </button>
        ) : null}

        {!paused ? (
          <button className="pause-btn" type="button" onClick={pauseTimer}>
            Pause
          </button>
        ) : null}

        {!paused ? (
          <button className="reset-btn" type="button" onClick={resetTime}>
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import confettiLib from 'canvas-confetti';
import './App.css';

export default function TimeTrackerApp() {
  const [task, setTask] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("logs");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLog, setCurrentLog] = useState(null);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const handleStart = () => {
    const start = new Date();
    setStartTime(start);
    setStopTime(null);
    setCurrentLog({
      task,
      date: start.toLocaleDateString(),
      startTime: start.toLocaleTimeString(),
      stopTime: "",
      duration: ""
    });
  };

  const handleStop = () => {
    const stop = new Date();
    setStopTime(stop);
    if (startTime && task) {
      const duration = ((stop - startTime) / 1000).toFixed(0);
      const finishedLog = {
        ...currentLog,
        stopTime: stop.toLocaleTimeString(),
        duration: formatDuration(duration)
      };
      setLogs([...logs, finishedLog]);
      setCurrentLog(null);
      setTask("");
      setStartTime(null);
      confetti();
    }
  };

  const handleDelete = (indexToDelete) => {
    const updatedLogs = logs.filter((_, index) => index !== indexToDelete);
    setLogs(updatedLogs);
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(logs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "Meg_Time_Tracker.xlsx");
  };

  const confetti = () => {
    const duration = 1 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confettiLib({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const buttonStyle = {
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease, box-shadow 0.2s ease'
  };

  const handlePressAnimation = (e) => {
    e.target.style.transform = 'scale(0.95)';
    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
  };

  const handleReleaseAnimation = (e) => {
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="app-container">
      <div className="floating-flowers">
        {[...Array(10)].map((_, i) => <div key={i} className="flower" />)}
      </div>
      <h1 className="title">🌸 Meg’s Time Tracker 🌸</h1>

      <input
        className="task-input"
        placeholder="Enter task name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <div className="button-row">
        <button className="start-btn" onMouseDown={handlePressAnimation} onMouseUp={handleReleaseAnimation} onClick={handleStart} disabled={!task}>Start</button>
        <button className="stop-btn" onMouseDown={handlePressAnimation} onMouseUp={handleReleaseAnimation} onClick={handleStop} disabled={!startTime}>Stop</button>
        <button className="excel-btn" onClick={exportToExcel} disabled={logs.length === 0}>Save to Excel</button>
      </div>

      <table className="log-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Task</th>
            <th>Start</th>
            <th>Stop</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentLog && (
            <tr>
              <td>{currentLog.date}</td>
              <td>{currentLog.task}</td>
              <td>{currentLog.startTime}</td>
              <td>{currentLog.stopTime}</td>
              <td>{currentLog.duration}</td>
              <td></td>
            </tr>
          )}
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.date}</td>
              <td>{log.task}</td>
              <td>{log.startTime}</td>
              <td>{log.stopTime}</td>
              <td>{log.duration}</td>
              <td onClick={() => handleDelete(index)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png" alt="delete" style={{ width: '20px', height: '20px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

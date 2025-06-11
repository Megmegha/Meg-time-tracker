import { useState } from 'react';

export default function TimeTrackerApp() {
  const [task, setTask] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleStart = () => {
    setStartTime(new Date());
    setStopTime(null);
  };

  const handleStop = () => {
    const stop = new Date();
    setStopTime(stop);
    if (startTime && task) {
      const duration = ((stop - startTime) / 1000).toFixed(0); // seconds
      setLogs([
        ...logs,
        {
          task,
          startTime: startTime.toLocaleTimeString(),
          stopTime: stop.toLocaleTimeString(),
          duration: formatDuration(duration),
        },
      ]);
      setTask("");
      setStartTime(null);
    }
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>⏱ Time Tracker</h1>
      <input
        style={{ padding: '8px', width: '100%', marginTop: '10px' }}
        placeholder="Enter task name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={handleStart} disabled={!task}>
          Start
        </button>
        <button onClick={handleStop} disabled={!startTime}>
          Stop
        </button>
      </div>

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Task</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Start</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Stop</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{log.task}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{log.startTime}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{log.stopTime}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{log.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

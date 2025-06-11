import { useState } from 'react';
import * as XLSX from 'xlsx';

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(logs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "Meg_Time_Tracker.xlsx");
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '700px',
      margin: '0 auto',
      fontFamily: 'Quicksand, sans-serif'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: '600',
        color: '#85586F',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        🌸 Meg’s Time Tracker 🌸
      </h1>

      <input
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ddd',
          marginBottom: '10px'
        }}
        placeholder="Enter task name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={{
          backgroundColor: '#f8d7e0',
          color: '#4a3f35',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }} onClick={handleStart} disabled={!task}>Start</button>

        <button style={{
          backgroundColor: '#d1e7dd',
          color: '#3a3f35',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }} onClick={handleStop} disabled={!startTime}>Stop</button>

        <button style={{
          backgroundColor: '#ffe0ac',
          color: '#4a3f35',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginLeft: 'auto'
        }} onClick={exportToExcel} disabled={logs.length === 0}>Save to Excel</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fffefc', borderRadius: '8px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #f0c9d0', padding: '10px', color: '#6f4f4f' }}>Task</th>
            <th style={{ borderBottom: '2px solid #f0c9d0', padding: '10px', color: '#6f4f4f' }}>Start</th>
            <th style={{ borderBottom: '2px solid #f0c9d0', padding: '10px', color: '#6f4f4f' }}>Stop</th>
            <th style={{ borderBottom: '2px solid #f0c9d0', padding: '10px', color: '#6f4f4f' }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={{ borderBottom: '1px solid #f4e5ec', padding: '10px' }}>{log.task}</td>
              <td style={{ borderBottom: '1px solid #f4e5ec', padding: '10px' }}>{log.startTime}</td>
              <td style={{ borderBottom: '1px solid #f4e5ec', padding: '10px' }}>{log.stopTime}</td>
              <td style={{ borderBottom: '1px solid #f4e5ec', padding: '10px' }}>{log.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

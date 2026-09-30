import { type ReactNode } from 'react'

// Row of sunken status cells; the first cell stretches to fill the bar
function StatusBar({ cells }: { cells: ReactNode[] }) {
  return (
    <div className="statusbar">
      {cells.map((cell, i) => (
        <div key={i} className={`status-cell${i === 0 ? ' grow' : ''}`}>{cell}</div>
      ))}
    </div>
  );
}

export default StatusBar

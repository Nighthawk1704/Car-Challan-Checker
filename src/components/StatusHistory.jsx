import { getHistoryFor } from '../utils/status.js'
import Badge from './ui/Badge.jsx'

function download(filename, text, type = 'text/plain') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function toCSV(rows) {
  return rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
}

export default function StatusHistory({ vehicleNo, challan }) {
  const history = getHistoryFor(vehicleNo, challan) || []

  function exportJSON() {
    const payload = { vehicleNo, challan, history }
    download(
      `status-history-${vehicleNo}-${challan.id}.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    )
  }

  function exportCSV() {
    const head = ['timestamp', 'status', 'note']
    const rows = history.map(h => [h.timestamp, h.status, h.note ?? ''])
    download(
      `status-history-${vehicleNo}-${challan.id}.csv`,
      toCSV([head, ...rows]),
      'text/csv'
    )
  }

  const latestStatus = history.at(-1)?.status || 'Unpaid'

  return (
    <div className="history card card-pad">
      <div className="row" style={{ marginBottom: 8 }}>
        <h3>Status history</h3>
        <Badge status={latestStatus} />
      </div>

      <div className="actions" style={{ marginBottom: 10 }}>
        <button className="btn btn-icon" onClick={exportCSV} title="Export CSV">CSV</button>
        <button className="btn btn-icon btn-secondary" onClick={exportJSON} title="Export JSON">JSON</button>
      </div>

      {history.length === 0 ? (
        <p className="muted">No history available.</p>
      ) : (
        <ul className="audit">
          {history.map((h, i) => (
            <li key={i} className="audit-row">
              <div className={`pill ${
                h.status === 'Paid' ? 'ok'
                  : (h.status === 'Unpaid' || h.status === 'Due') ? 'warn'
                  : 'neut'
              }`}>
                {h.status}
              </div>
              <div className="audit-main">
                <div className="audit-top">
                  <span className="audit-time">
                    {new Date(h.timestamp).toLocaleString()}
                  </span>
                </div>
                {h.note && <div className="audit-note muted">{h.note}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

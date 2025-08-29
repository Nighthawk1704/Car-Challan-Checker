import { getHistoryFor } from '../utils/status.js'
import Badge from './ui/Badge.jsx'

function download(filename, text) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function StatusHistory({ vehicleNo, challan }) {
  const history = getHistoryFor(vehicleNo, challan)

  function exportJSON() {
    const payload = { vehicleNo, challan, history }
    download(`status-history-${vehicleNo}-${challan.id}.json`, JSON.stringify(payload, null, 2))
  }

  function exportCSV() {
    const head = ['timestamp', 'status', 'note']
    const rows = history.map(h => [h.timestamp, h.status, h.note ?? ''])
    const csv = [head, ...rows]
      .map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    download(`status-history-${vehicleNo}-${challan.id}.csv`, csv)
  }

  function getDotClass(status) {
    if (!status) return 'timeline-dot dot-gray'
    const s = status.toLowerCase()
    if (s === 'paid') return 'timeline-dot dot-green'
    if (s === 'unpaid' || s === 'due') return 'timeline-dot dot-red'
    return 'timeline-dot dot-amber'
  }

  return (
    <div className="history card card-pad">
      <div className="history-header">
        <h3>Status History</h3>
        <Badge status={history.at(-1)?.status || 'Unpaid'} />
      </div>

      <div className="actions">
        <button className="btn btn-icon" onClick={exportCSV}>⬇ CSV</button>
        <button className="btn btn-icon btn-secondary" onClick={exportJSON}>⬇ JSON</button>
      </div>

      <div className="timeline">
        {history.length === 0 && <p className="muted">No history available.</p>}
        {history.map((h, i) => (
          <div className="timeline-item" key={i}>
            <div className={getDotClass(h.status)} aria-hidden />
            <div className="timeline-content">
              <div className="timeline-row">
                <strong>{h.status}</strong>
                <span className="muted">{new Date(h.timestamp).toLocaleString()}</span>
              </div>
              {h.note && <p className="muted note">{h.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import Badge from './ui/Badge.jsx'
import { getCurrentStatusFor, setStatus } from '../utils/status.js'

function download(filename, text, type = 'text/plain') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function toCSV(rows) {
  return rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g,'""')}"`).join(',')).join('\n')
}

export default function ChallanList({ vehicleNo, challans, onSelect, onUpdate }) {
  if (challans.length === 0) {
    return <p className="muted">No challans for this filter.</p>
  }

  function exportCSV() {
    const head = ['id','type','amount','date','status']
    const rows = challans.map(c => [
      c.id,
      c.type,
      c.amount,
      new Date(c.date).toISOString(),
      getCurrentStatusFor(vehicleNo, c)
    ])
    download(`challans-${vehicleNo}.csv`, toCSV([head, ...rows]), 'text/csv')
  }

  function exportJSON() {
    const payload = challans.map(c => ({
      id: c.id,
      type: c.type,
      amount: c.amount,
      date: c.date,
      status: getCurrentStatusFor(vehicleNo, c)
    }))
    download(`challans-${vehicleNo}.json`, JSON.stringify(payload, null, 2), 'application/json')
  }

  const handleChange = (challan, next) => {
    setStatus(vehicleNo, challan, next)
    onUpdate?.()
  }

  return (
    <div>
      {/* Summary bar + export buttons */}
      <div className="summary-toolbar">
        <div className="summary-bar">
          <strong>{challans.length}</strong> challan(s) · Total ₹
          {challans.reduce((s, c) => s + (c.amount || 0), 0).toLocaleString('en-IN')}
        </div>
        <div className="toolbar">
          <button className="btn btn-icon" onClick={exportCSV} title="Export CSV">CSV</button>
          <button className="btn btn-icon btn-secondary" onClick={exportJSON} title="Export JSON">JSON</button>
        </div>
      </div>

      {/* Challan list */}
      <div className="list">
        {challans.map((c) => {
          const currentStatus = getCurrentStatusFor(vehicleNo, c)
          return (
            <article
              key={c.id}
              className="item card card-pad"
              onClick={() => onSelect?.(c)}
            >
              <div className="row">
                <h3 className="item-title">{c.type}</h3>
                <Badge status={currentStatus} />
              </div>

              <div className="row">
                <div className="muted">
                  {new Date(c.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="amount">₹ {c.amount}</div>
              </div>

              {/* Status segmented toggle */}
              <div className="row">
                <div
                  className="seg"
                  onClick={(e) => e.stopPropagation()}
                  role="group"
                  aria-label="Set status"
                >
                  <button
                    type="button"
                    className={`seg-btn ${currentStatus === 'Paid' ? 'active' : ''}`}
                    onClick={() => handleChange(c, 'Paid')}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${currentStatus === 'Unpaid' ? 'active' : ''}`}
                    onClick={() => handleChange(c, 'Unpaid')}
                  >
                    Unpaid
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

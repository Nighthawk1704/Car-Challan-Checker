import Badge from './ui/Badge.jsx'
import { toggleStatus, getCurrentStatusFor } from '../utils/status.js'

function download(filename, text, type = 'text/plain') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ChallanList({ vehicleNo, challans, onSelect, onUpdate }) {
  function handleToggle(challan) {
    toggleStatus(vehicleNo, challan)
    onUpdate?.()
  }

  if (challans.length === 0) {
    return <p className="muted">No challans for this filter.</p>
  }

  const total = challans.reduce((s, c) => s + (c.amount || 0), 0)

  function exportCSV() {
    const head = ['id','type','amount','date','status']
    const rows = challans.map(c => [
      c.id,
      c.type,
      c.amount,
      new Date(c.date).toISOString(),
      getCurrentStatusFor(vehicleNo, c)
    ])
    const csv = [head, ...rows]
      .map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))
      .join('\n')
    download(`challans-${vehicleNo}.csv`, csv, 'text/csv')
  }

  function exportJSON() {
    const payload = challans.map(c => ({
      id: c.id,
      type: c.type,
      amount: c.amount,
      date: c.date,
      status: getCurrentStatusFor(vehicleNo, c),
    }))
    download(`challans-${vehicleNo}.json`, JSON.stringify(payload, null, 2), 'application/json')
  }

  return (
    <div>
      {/* Summary + Export toolbar */}
      <div className="summary-toolbar">
        <div className="summary-bar">
          <strong>{challans.length}</strong> challan(s) · Total ₹{total.toLocaleString('en-IN')}
        </div>
        <div className="toolbar">
          <button className="btn btn-icon" onClick={exportCSV} title="Export CSV">
            <svg viewBox="0 0 24 24" className="icon-16" aria-hidden>
              <path d="M12 3v12m0 0l-3-3m3 3l3-3M5 21h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            CSV
          </button>
          <button className="btn btn-icon btn-secondary" onClick={exportJSON} title="Export JSON">
            <svg viewBox="0 0 24 24" className="icon-16" aria-hidden>
              <path d="M7 7h10v10H7z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            JSON
          </button>
        </div>
      </div>

      {/* List */}
      <div className="list">
        {challans.map((c) => {
          const currentStatus = getCurrentStatusFor(vehicleNo, c)
          return (
            <article key={c.id} className="item card card-pad" onClick={() => onSelect?.(c)}>
              <div className="row">
                <h3 className="item-title">{c.type}</h3>
                <Badge status={currentStatus} />
              </div>
              <div className="row">
                <div className="muted">
                  {new Date(c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div className="amount">₹ {c.amount}</div>
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={(e) => { e.stopPropagation(); handleToggle(c) }}
                >
                  Mark as {currentStatus === 'Paid' ? 'Unpaid' : 'Paid'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

const KEY = 'ccc_status_history_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function getCurrentStatusFor(vehicleNo, challan) {
  const history = getHistoryFor(vehicleNo, challan)
  return history[0]?.status || challan.status || 'Unpaid'
}

export function getHistoryFor(vehicleNo, challan) {
  const db = load()
  const v = db[vehicleNo] || {}
  const arr = v[challan.id] || []
  if (arr.length === 0) {
    return [ { status: challan.status || 'Unpaid', timestamp: challan.date || new Date().toISOString(), note: 'Initial status from record' } ]
  }
  return arr
}

export function toggleStatus(vehicleNo, challan) {
  const db = load()
  db[vehicleNo] = db[vehicleNo] || {}
  const curr = getCurrentStatusFor(vehicleNo, challan)
  const next = curr === 'Paid' ? 'Unpaid' : 'Paid'
  const record = { status: next, timestamp: new Date().toISOString(), note: `Marked as ${next} by user` }
  const arr = db[vehicleNo][challan.id] || []
  db[vehicleNo][challan.id] = [record, ...arr]
  save(db)
  return record
}

const KEY = 'ccc_status_history_v2' // bump key to avoid old data quirks

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}
function save(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {}
}

/**
 * Returns the current status for a challan (default 'Unpaid')
 */
export function getCurrentStatusFor(vehicleNo, challan) {
  const db = load()
  const key = `${vehicleNo}:${challan.id}`
  const list = db[key] || []
  return list.length ? list[list.length - 1].status : (challan.status || 'Unpaid')
}

/**
 * Return history array (oldest → newest)
 */
export function getHistoryFor(vehicleNo, challan) {
  const db = load()
  const key = `${vehicleNo}:${challan.id}`
  return db[key] || []
}

/**
 * Set status explicitly (Paid / Unpaid / Due / etc.)
 * - De-dupes consecutive equal statuses
 * - Optional cooldown to avoid spam flips (default 10s)
 * - Optional note
 */
export function setStatus(vehicleNo, challan, nextStatus, note = '', cooldownMs = 10000) {
  const db = load()
  const key = `${vehicleNo}:${challan.id}`
  const list = db[key] || []

  const now = Date.now()
  const last = list[list.length - 1]

  // Normalize casing
  const ns = String(nextStatus || '').trim()
  if (!ns) return

  // 1) If same as last status, ignore (no redundant writes)
  if (last && last.status === ns) {
    return
  }

  // 2) Optional cooldown: if last change was too recent, ignore
  if (last && now - new Date(last.timestamp).getTime() < cooldownMs) {
    return
  }

  list.push({
    timestamp: new Date(now).toISOString(),
    status: ns,
    note: note || ''
  })

  db[key] = list
  save(db)
}

/**
 * Convenience: toggle between Paid <-> Unpaid with safeguards
 * Uses setStatus under the hood (so still de-dupes + cooldown)
 */
export function toggleStatus(vehicleNo, challan) {
  const current = getCurrentStatusFor(vehicleNo, challan)
  const next = current === 'Paid' ? 'Unpaid' : 'Paid'
  setStatus(vehicleNo, challan, next)
}

/** Optional admin utility */
export function clearHistory(vehicleNo, challan) {
  const db = load()
  const key = `${vehicleNo}:${challan.id}`
  delete db[key]
  save(db)
}

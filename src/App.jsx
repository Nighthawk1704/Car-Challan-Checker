import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Steps from './components/Steps.jsx'
import VehicleInput from './components/VehicleInput.jsx'
import ChallanList from './components/ChallanList.jsx'
import StatusHistory from './components/StatusHistory.jsx'
import EmptyState from './components/EmptyState.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'
import FAQ from './components/FAQ.jsx'
import { getGeo, searchChallans } from './utils/api.js'

export default function App() {
  const [vehicleNo, setVehicleNo] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geo, setGeo] = useState(null)
  const [selectedChallan, setSelectedChallan] = useState(null)

  // Filters & sorting
  const [filter, setFilter] = useState('all')           // all | paid | unpaid
  const [dateFrom, setDateFrom] = useState('')          // yyyy-mm-dd
  const [dateTo, setDateTo] = useState('')              // yyyy-mm-dd
  const [sortBy, setSortBy] = useState('date_desc')     // date_desc | date_asc | amount_desc | amount_asc

  // ✅ toggle to quickly disable geo API fetch if needed
  const SHOW_GEO = true // flip to false to disable geo fetch quickly

  useEffect(() => {
    if (!SHOW_GEO) {
      setGeo({ unavailable: true })
      return
    }
    getGeo()
      .then(setGeo)
      .catch(() => setGeo({ unavailable: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SHOW_GEO])

  const onSearch = async (plate) => {
    if (!plate) return
    setError('')
    setLoading(true)
    setSelectedChallan(null)
    try {
      const data = await searchChallans(plate)
      setResult(data)
      setVehicleNo(plate)
    } catch (e) {
      setError(e.message || 'Something went wrong')
      setResult({ vehicleNo: plate, challans: [] })
    } finally {
      setLoading(false)
    }
  }

  // Apply status + date filters and sorting on the client
  const challans = (result?.challans || [])
    .filter(c => {
      // status filter
      if (filter !== 'all') {
        const status = (c.status || 'Unpaid').toLowerCase()
        if (status !== filter) return false
      }
      // date filter (inclusive)
      const t = new Date(c.date).getTime()
      const fromT = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0) : null
      const toT = dateTo ? new Date(dateTo).setHours(23, 59, 59, 999) : null
      if (fromT && t < fromT) return false
      if (toT && t > toT) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount_desc') return (b.amount || 0) - (a.amount || 0)
      if (sortBy === 'amount_asc') return (a.amount || 0) - (b.amount || 0)
      return 0
    })

  return (
    <div className="app-shell">
      <Header geo={geo} />
      <Hero onSearch={onSearch} />
      <Steps />

      <main className="container">
        <section className="panel section-card">
          <VehicleInput onSearch={onSearch} loading={loading} />
        </section>

        {loading && (
          <section className="panel section-card">
            <Loader label="Checking challans..." />
          </section>
        )}

        {error && (
          <section className="panel section-card error">
            <strong>Oops!</strong> {error}
          </section>
        )}

        {!loading && result && (
          <section className="grid">
            {/* LEFT: Results + filters */}
            <div className="panel section-card">
              {/* Header controls */}
              <div className="list-header">
                <h2 className="section-title">Challans ({challans.length})</h2>

                <div className="filters">
                  {['all', 'paid', 'unpaid'].map(f => (
                    <button
                      key={f}
                      className={`chip ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f[0].toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="controls">
                  <div className="control">
                    <label htmlFor="from">From</label>
                    <input
                      id="from"
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="control">
                    <label htmlFor="to">To</label>
                    <input
                      id="to"
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                    />
                  </div>
                  <div className="control">
                    <label htmlFor="sort">Sort</label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      <option value="date_desc">Date ↓ (newest)</option>
                      <option value="date_asc">Date ↑ (oldest)</option>
                      <option value="amount_desc">Amount ↓ (high)</option>
                      <option value="amount_asc">Amount ↑ (low)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List itself */}
              <ChallanList
                vehicleNo={vehicleNo}
                challans={challans}
                onSelect={setSelectedChallan}
                onUpdate={() => setResult({ ...result })}
              />
            </div>

            {/* RIGHT: History panel */}
            <div className="panel section-card">
              {selectedChallan ? (
                <StatusHistory vehicleNo={vehicleNo} challan={selectedChallan} />
              ) : (
                <EmptyState
                  title="Select a challan"
                  subtitle="Click a challan to view its detailed status history."
                />
              )}
            </div>
          </section>
        )}

        {!loading && result && result.challans?.length === 0 && (
          <section className="panel section-card">
            <EmptyState
              title="No challans found"
              subtitle={`No challans for ${vehicleNo}. Drive safe!`}
            />
          </section>
        )}

        {!loading && !result && (
          <section className="panel section-card">
            <EmptyState
              title="Check e-Challans"
              subtitle="Enter your vehicle number to see challans and status history."
            />
          </section>
        )}

        <section className="panel section-card">
          <FAQ />
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { useState } from 'react'

export default function VehicleInput({ onSearch, loading }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  // Uppercase; remove spaces; allow A–Z and 0–9 only
  function normalize(v) {
    return String(v).toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '')
  }

  // Lenient India plate check (DL10AB1234, KA01AA0001, etc.)
  function isValidPlate(v) {
    return /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{3,4}$/.test(v)
  }

  function handleChange(e) {
    const v = normalize(e.target.value)
    setValue(v)
    if (error) setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const v = normalize(value)
    if (!isValidPlate(v)) {
      setError('Enter a valid vehicle number (e.g., DL10AB1234).')
      return
    }
    onSearch?.(v)
  }

  const valid = isValidPlate(value)

  return (
    <form className="vehicle-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="vehicleNo">Vehicle number</label>
          <div className="input-wrap">
            <input
              id="vehicleNo"
              className="input input-lg"
              type="text"
              placeholder="DL10AB1234"
              value={value}
              onChange={handleChange}
              autoComplete="off"
              inputMode="latin"
              aria-invalid={!valid && value ? 'true' : 'false'}
              aria-describedby="vehicleHelp"
            />
          </div>
          <div id="vehicleHelp" className={`helper ${error ? 'error-text' : ''}`}>
            {error ? error : 'Format: 2 letters • 1–2 digits • 1–2 letters • 3–4 digits'}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-lg"
            disabled={!valid || loading}
            aria-disabled={!valid || loading}
          >
            {loading ? (
              <span className="btn-content">
                <span className="spinner" aria-hidden />
                Checking…
              </span>
            ) : (
              <span className="btn-content">
                <SearchIcon />
                Check challans
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

// Minimal inline search icon (no libraries)
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="icon-16"
      aria-hidden
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="6" strokeWidth="1.6" />
      <path d="M20 20l-3.5-3.5" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

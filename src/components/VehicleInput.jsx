import { useState } from 'react'

const IN_PLATE_REGEX = /^(?:[A-Z]{2}\d{1,2}[A-Z]{0,2}\d{4}|[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4})$/i

export default function VehicleInput({ onSearch, loading }) {
  const [plate, setPlate] = useState('')
  const [touched, setTouched] = useState(false)

  const normalized = plate.trim().toUpperCase().replace(/\s+/g, '')
  const valid = IN_PLATE_REGEX.test(normalized)

  function submit(e) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    onSearch(normalized)
  }

  function quickFill(p){ setPlate(p) }

  return (
    <form className="vehicle-form" onSubmit={submit} noValidate>
      <label htmlFor="vehicleNo">Vehicle Number</label>
      <div className="input-row">
        <input
          id="vehicleNo"
          name="vehicleNo"
          placeholder="e.g., DL10AB1234"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          aria-invalid={touched && !valid}
          aria-describedby="vehicleNoHelp"
          disabled={loading}
        />
        <button className="btn" type="submit" disabled={!valid || loading}>
          {loading ? 'Checking...' : 'Check Challans'}
        </button>
      </div>
      <small id="vehicleNoHelp" className={touched && !valid ? 'help error' : 'help'}>
        Try: <button type="button" className="chip" onClick={()=>quickFill('DL10AB1234')}>DL10AB1234</button>
        <button type="button" className="chip" onClick={()=>quickFill('MH12XY9876')}>MH12XY9876</button>
        <button type="button" className="chip" onClick={()=>quickFill('KA05MN2468')}>KA05MN2468</button>
      </small>
    </form>
  )
}

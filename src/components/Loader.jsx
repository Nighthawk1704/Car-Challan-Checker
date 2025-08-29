export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="loader">
      <span className="spinner" aria-hidden />
      <span>{label}</span>
    </div>
  )
}

export default function EmptyState({ title, subtitle }) {
  return (
    <div className="empty">
      <div className="icon" aria-hidden>
        {/* Professional shield/check icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="icon-svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            d="M12 3l6 2v6c0 4.4-2.7 8.3-6 9.9C8.7 19.3 6 15.4 6 11V5l6-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            d="M9 12l2.2 2.2L15 10.5"
          />
        </svg>
      </div>
      <h3>{title}</h3>
      <p className="muted">{subtitle}</p>
    </div>
  )
}

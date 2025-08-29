import Logo from '../assets/Car_logo.svg';

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="icon-svg"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        d="M12 21s-6-5-6-10a6 6 0 1112 0c0 5-6 10-6 10z"
      />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Header({ geo }) {
  // Clean long region text
  const region = geo?.region?.includes("National Capital Territory")
    ? "Delhi"
    : geo?.region;

  const hasGeo = Boolean(geo && (geo.city || geo.region));
  const tried = Boolean(geo); // we set geo to {unavailable:true} on failure

  return (
    <header className="header">
      <div className="container header-row">
        {/* Brand */}
        <div className="brand">
          <img src={Logo} alt="Car Challan Checker logo" className="logo-img" />
          <div className="brand-text">
            <a href="/" className="brand-title" aria-label="Car Challan Checker — Home">
              Car <span className="brand-title-em">Challan Checker</span>
            </a>
            <p className="brand-subtitle">
              Check & manage your <strong>e-Challans</strong> instantly
            </p>
          </div>
        </div>

        {/* Geo (from free API) */}
        <div className="geo">
          {hasGeo ? (
            <span title="Detected via free IP API">
              <LocationIcon /> {geo.city}, {region}
            </span>
          ) : !tried ? (
            <span className="muted">Detecting location…</span>
          ) : geo?.unavailable ? (
            <span className="muted">Location unavailable (API quota exceeded)</span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
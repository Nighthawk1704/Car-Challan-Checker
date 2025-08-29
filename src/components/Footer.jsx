export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="muted">
          Built for the Anslation Frontend Internship assignment. Demo data only.
        </p>
        <p className="muted">
          Location detection powered by{" "}
          <a
            href="https://ipapi.co/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-blue-500"
          >
            ipapi.co API
          </a>
          {" "}
          (free tier – may show “unavailable” if quota is exceeded).
        </p>
      </div>
    </footer>
  )
}

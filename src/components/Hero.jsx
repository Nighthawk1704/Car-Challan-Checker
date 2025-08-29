export default function Hero({ onSearch }) {
  function handleQuick(plate){ onSearch?.(plate) }
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div>
          <h2>Check your e-Challans instantly</h2>
          <p className="muted">Clean, modern UI. Demo data • No login required.</p>
        </div>
        <div className="hero-cta">
          <button className="chip" onClick={()=>handleQuick('DL10AB1234')}>DL10AB1234</button>
          <button className="chip" onClick={()=>handleQuick('MH12XY9876')}>MH12XY9876</button>
          <button className="chip" onClick={()=>handleQuick('KA05MN2468')}>KA05MN2468</button>
        </div>
      </div>
    </section>
  )
}
